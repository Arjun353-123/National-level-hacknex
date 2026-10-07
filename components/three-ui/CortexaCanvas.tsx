"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CortexaCanvasProps {
  className?: string;
  speed?: number;
  particleCount?: number;
  glowIntensity?: number;
}

export function CortexaCanvas({
  className = "",
  speed = 1.0,
  glowIntensity = 1.0,
}: CortexaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- 3D Bust Group ---
    const bustGroup = new THREE.Group();
    scene.add(bustGroup);

    // Position bust nicely in center-screen
    bustGroup.position.set(0, -0.25, 0);

    // --- Procedural 3D Head & Bust Geometry Generation ---
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const alphas: number[] = [];
    const randomOffsets: number[] = [];

    // Helper: evaluate head/bust surface radius at given height y and angle theta
    // y ranges from -1.4 (base of bust/shoulders) to 1.3 (top of cranium)
    function getBustRadius(y: number, theta: number): { r: number; zOffset: number; isRim: boolean } {
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta); // positive is facing forward (+z)

      let r = 0.8;
      let zOffset = 0;
      let isRim = false;

      if (y > 0.4) {
        // --- Cranium & Forehead (y: 0.4 -> 1.25) ---
        const t = (y - 0.4) / 0.85; // 0 at brow, 1 at top of skull
        const dome = Math.sqrt(Math.max(0, 1 - Math.pow(t * 1.1 - 0.1, 2)));
        r = 0.82 * dome;

        // Flatten slightly on sides, elongate front-to-back
        r *= 0.9 + 0.18 * Math.abs(sinT);

        // Forehead slope
        if (sinT > 0 && y < 0.85) {
          zOffset += 0.08 * (1 - t);
        }
        // Occipital curve at back
        if (sinT < 0) {
          zOffset -= 0.12 * Math.pow(1 - t, 0.8);
        }
      } else if (y >= -0.3) {
        // --- Face & Jaw (y: -0.3 -> 0.4) ---
        const faceT = (y + 0.3) / 0.7; // 0 at chin, 1 at brow
        r = 0.62 + faceT * 0.2;

        // Side width vs front/back
        r *= 0.88 + 0.15 * Math.abs(cosT);

        if (sinT > 0.3) {
          // Front of face features:
          // Nose bridge & tip around y = 0.05 to 0.28
          if (y > 0.05 && y < 0.32 && Math.abs(cosT) < 0.35) {
            const nosePeak = Math.sin(((y - 0.05) / 0.27) * Math.PI);
            const noseProtrusion = 0.35 * Math.pow(nosePeak, 1.4) * (1 - Math.abs(cosT) * 2.5);
            zOffset += Math.max(0, noseProtrusion);
          }
          // Eye sockets indent around y = 0.22 to 0.38, cosT ~ 0.4
          if (y > 0.2 && y < 0.38 && Math.abs(cosT) > 0.25 && Math.abs(cosT) < 0.65) {
            zOffset -= 0.08;
          }
          // Lips protrusion around y = -0.08 to 0.02
          if (y > -0.1 && y < 0.04 && Math.abs(cosT) < 0.3) {
            zOffset += 0.08 * Math.cos(((y + 0.03) / 0.07) * (Math.PI / 2));
          }
          // Chin protrusion around y = -0.3 to -0.15
          if (y < -0.12 && Math.abs(cosT) < 0.4) {
            const chinFactor = (1 - (y + 0.3) / 0.18);
            zOffset += 0.16 * chinFactor * (1 - Math.abs(cosT) * 1.8);
          }
        }
        // Jawline definition
        if (y < 0.0 && Math.abs(cosT) > 0.5) {
          r *= 1.05;
          isRim = true;
        }
      } else if (y >= -0.85) {
        // --- Neck (y: -0.85 -> -0.3) ---
        const neckT = (y + 0.85) / 0.55;
        r = 0.46 + (1 - neckT) * 0.14;
        r *= 0.95 + 0.1 * Math.abs(cosT);
        zOffset -= 0.08 * (1 - neckT); // natural slight forward head posture
      } else {
        // --- Shoulders & Trapezius (y: -1.4 -> -0.85) ---
        const shoulderT = (y + 1.4) / 0.55; // 0 at chest base, 1 at neck
        const spreadX = Math.pow(1 - shoulderT, 0.75) * 1.6;
        r = 0.58 + spreadX;
        // Shoulders are much wider sideways (cosT) than front-to-back (sinT)
        r *= 0.65 + 1.15 * Math.pow(Math.abs(cosT), 1.3);
        zOffset += 0.05 * sinT;
        isRim = true;
      }

      return { r, zOffset, isRim };
    }

    // 1. Generate Silhouette & Surface Points (High-density contour)
    const surfaceCount = 14000;
    for (let i = 0; i < surfaceCount; i++) {
      // Stratified height distribution to get great detail across face, crown & shoulders
      const u = Math.random();
      let y: number;
      if (u < 0.35) {
        // Face & chin focus
        y = -0.3 + Math.random() * 0.7;
      } else if (u < 0.7) {
        // Cranium & crown
        y = 0.4 + Math.random() * 0.85;
      } else {
        // Neck & shoulders
        y = -1.35 + Math.random() * 1.05;
      }

      const theta = Math.random() * Math.PI * 2;
      const { r, zOffset, isRim } = getBustRadius(y, theta);

      // Slight thickness jitter for volumetric presence
      const radialJitter = 1.0 + (Math.random() - 0.5) * 0.04;
      const finalR = r * radialJitter;

      const px = finalR * Math.cos(theta);
      const py = y;
      const pz = finalR * Math.sin(theta) + zOffset;

      positions.push(px, py, pz);
      randomOffsets.push(Math.random() * 100);

      // Color computation: glowing cyan rim, electric blue surface
      // Check if point is on silhouette rim (edges relative to front view)
      const absCos = Math.abs(Math.cos(theta));
      const isProfileEdge = absCos > 0.82 || (Math.abs(Math.sin(theta)) > 0.92 && Math.random() < 0.4);
      const isTopCrown = y > 1.1;

      if (isProfileEdge || isRim || isTopCrown) {
        // Bright cyan/white rim silhouette highlight
        colors.push(0.4, 0.95, 1.0); // Bright radiant cyan
        sizes.push(4.2 + Math.random() * 3.0);
        alphas.push(0.9 + Math.random() * 0.1);
      } else {
        // Deep electric blue body surface
        const depthTone = (pz + 1.0) / 2.0;
        colors.push(
          0.05 + depthTone * 0.25,
          0.55 + depthTone * 0.35,
          0.95 + depthTone * 0.05
        );
        sizes.push(2.2 + Math.random() * 2.2);
        alphas.push(0.55 + Math.random() * 0.35);
      }
    }

    // 2. Generate Volumetric Neural Core / Brain Points (Internal lattice)
    const neuralCount = 7500;
    for (let i = 0; i < neuralCount; i++) {
      // Concentrated inside head cavity (y: 0.1 to 1.15)
      const y = 0.1 + Math.random() * 1.05;
      const theta = Math.random() * Math.PI * 2;
      const { r, zOffset } = getBustRadius(y, theta);

      // Distribute inside the volume with radial falloff
      const volumeFraction = Math.pow(Math.random(), 0.7) * 0.88;
      const inR = r * volumeFraction;

      const px = inR * Math.cos(theta);
      const py = y;
      const pz = inR * Math.sin(theta) + zOffset * volumeFraction;

      positions.push(px, py, pz);
      randomOffsets.push(Math.random() * 100);

      // Inner neural matrix: electric blue & cyan synapse sparks
      const isSynapse = Math.random() < 0.18;
      if (isSynapse) {
        colors.push(0.7, 0.98, 1.0); // Hot white-cyan neural node
        sizes.push(3.5 + Math.random() * 2.5);
        alphas.push(0.85);
      } else {
        colors.push(0.08, 0.45, 0.92); // Deep blue neural matrix
        sizes.push(1.8 + Math.random() * 1.8);
        alphas.push(0.35 + Math.random() * 0.3);
      }
    }

    // 3. Ambient Drifting Space Dust / Star Particles (Atmospheric Nebula)
    const dustCount = 2800;
    for (let i = 0; i < dustCount; i++) {
      // Spread across a 3D bounding bubble around the bust
      const rad = 1.2 + Math.pow(Math.random(), 0.5) * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const px = rad * Math.cos(phi) * Math.cos(theta);
      const py = rad * Math.sin(phi) + 0.1;
      const pz = rad * Math.cos(phi) * Math.sin(theta);

      positions.push(px, py, pz);
      randomOffsets.push(Math.random() * 100);

      // Twinkling cosmic cyan dust
      const isBrightStar = Math.random() < 0.08;
      if (isBrightStar) {
        colors.push(0.65, 0.95, 1.0);
        sizes.push(3.0 + Math.random() * 2.5);
        alphas.push(0.75);
      } else {
        colors.push(0.15, 0.55, 0.88);
        sizes.push(1.2 + Math.random() * 1.6);
        alphas.push(0.25 + Math.random() * 0.35);
      }
    }

    // --- Build BufferGeometry ---
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("customColor", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.Float32BufferAttribute(alphas, 1));
    geometry.setAttribute("randomOffset", new THREE.Float32BufferAttribute(randomOffsets, 1));

    // --- Custom Shader Material for High-End Glowing Bloom ---
    const vertexShader = `
      uniform float uTime;
      uniform float uPixelRatio;
      uniform vec2 uMouse;
      
      attribute vec3 customColor;
      attribute float size;
      attribute float alpha;
      attribute float randomOffset;
      
      varying vec3 vColor;
      varying float vAlpha;
      varying float vDist;
      
      void main() {
        vColor = customColor;
        vAlpha = alpha;
        
        vec3 pos = position;
        
        // Gentle organic breathing wave
        float wave = sin(uTime * 1.6 + randomOffset + pos.y * 1.5) * 0.025;
        pos += normal * wave;
        
        // Subtle vertical float
        pos.y += sin(uTime * 1.1 + pos.x * 0.8) * 0.035;
        
        // Ambient dust swirl for distant particles
        if (length(pos) > 2.0) {
          float angle = uTime * 0.08 + randomOffset * 0.05;
          pos.x += cos(angle) * 0.05;
          pos.z += sin(angle) * 0.05;
        }
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Perspective-attenuated point size
        float depthScale = 320.0 / -mvPosition.z;
        gl_PointSize = size * depthScale * (uPixelRatio / 2.0);
        
        // Twinkle factor
        float twinkle = 0.85 + 0.15 * sin(uTime * 2.5 + randomOffset);
        vAlpha = alpha * twinkle;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        // High-end procedural soft glowing circle
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) {
          discard;
        }
        
        // Concentrated hot center with soft glowing halo falloff
        float core = exp(-dist * dist * 38.0);
        float halo = pow(clamp(1.0 - dist * 2.0, 0.0, 1.0), 2.4);
        float intensity = core * 0.95 + halo * 0.55;
        
        // Color boost towards pure white in the dead-center
        vec3 finalColor = mix(vColor, vec3(0.9, 0.98, 1.0), core * 0.65);
        
        gl_FragColor = vec4(finalColor, vAlpha * intensity);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pointCloud = new THREE.Points(geometry, material);
    bustGroup.add(pointCloud);

    // --- Interactive Mouse Dynamics with Smooth Lerp ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    let targetBustY = -0.25;
    let currentBustY = -0.25;

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Normalized coordinates from -1 to 1
      const nx = (e.clientX / windowWidth) * 2 - 1;
      const ny = (e.clientY / windowHeight) * 2 - 1;

      targetRotationY = nx * 0.52; // Look left/right
      targetRotationX = ny * 0.28; // Look up/down
      targetBustY = -0.25 - ny * 0.08;

      uniforms.uMouse.value.set(nx, ny);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = (touch.clientY / window.innerHeight) * 2 - 1;
        targetRotationY = nx * 0.45;
        targetRotationX = ny * 0.25;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      uniforms.uPixelRatio.value = pixelRatio;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime() * speed;
      uniforms.uTime.value = elapsedTime;

      // Smooth camera / bust tracking physics
      currentRotationX += (targetRotationX - currentRotationX) * 0.055;
      currentRotationY += (targetRotationY - currentRotationY) * 0.055;
      currentBustY += (targetBustY - currentBustY) * 0.055;

      // Subtle idle breathing motion added to rotation
      const idleYaw = Math.sin(elapsedTime * 0.4) * 0.06;
      const idlePitch = Math.cos(elapsedTime * 0.5) * 0.03;

      bustGroup.rotation.y = currentRotationY + idleYaw;
      bustGroup.rotation.x = currentRotationX + idlePitch;
      bustGroup.position.y = currentBustY + Math.sin(elapsedTime * 0.8) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      resizeObserver.disconnect();

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed, glowIntensity]);

  return (
    <div
      ref={containerRef}
      className={`cortexa-3d-scene ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Luminous background aura matching Cortexa screenshot */}
      <div
        className="cortexa-radial-glow"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(0, 210, 255, 0.16) 0%, rgba(0, 130, 255, 0.07) 40%, rgba(2, 6, 23, 0) 75%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Top subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(2, 4, 10, 0.7) 85%, #02040a 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}

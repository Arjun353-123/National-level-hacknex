"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface BioTechDnaCanvasProps {
  className?: string;
  speed?: number;
}

export function BioTechDnaCanvas({
  className = "",
  speed = 1.0,
}: BioTechDnaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf0fdfa, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.6);
    dirLight1.position.set(5, 8, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0d9488, 1.2);
    dirLight2.position.set(-5, -4, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x14b8a6, 2, 15);
    pointLight.position.set(2, 0, 3);
    scene.add(pointLight);

    // --- 3D DNA Helix Group ---
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Position DNA to the right side of the screen matching the screenshot
    dnaGroup.position.set(2.0, 0, 0);
    dnaGroup.rotation.z = -0.32; // Diagonal tilt like screenshot
    dnaGroup.rotation.x = 0.2;

    // Build DNA Double Helix Strands & Base Pairs
    const helixRadius = 1.05;
    const helixHeight = 11;
    const turns = 3.2;
    const rungsCount = 52;
    const pointsPerStrand = 180;

    // Strand 1 Curve & Strand 2 Curve
    const strand1Points: THREE.Vector3[] = [];
    const strand2Points: THREE.Vector3[] = [];

    for (let i = 0; i <= pointsPerStrand; i++) {
      const t = i / pointsPerStrand;
      const y = (t - 0.5) * helixHeight;
      const angle = t * Math.PI * 2 * turns;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;

      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      strand1Points.push(new THREE.Vector3(x1, y, z1));
      strand2Points.push(new THREE.Vector3(x2, y, z2));
    }

    const curve1 = new THREE.CatmullRomCurve3(strand1Points);
    const curve2 = new THREE.CatmullRomCurve3(strand2Points);

    const tubeGeo1 = new THREE.TubeGeometry(curve1, 140, 0.07, 12, false);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 140, 0.07, 12, false);

    // Translucent Crystal Teal Material for Strands
    const strandMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f766e, // Deep rich teal
      emissive: 0x0d9488,
      emissiveIntensity: 0.25,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.65,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.9,
      clearcoat: 0.8,
    });

    const strandMesh1 = new THREE.Mesh(tubeGeo1, strandMaterial);
    const strandMesh2 = new THREE.Mesh(tubeGeo2, strandMaterial);
    dnaGroup.add(strandMesh1);
    dnaGroup.add(strandMesh2);

    // Base-Pair Rungs (Horizontal Crossbars connecting strands)
    const rungGeo = new THREE.CylinderGeometry(0.038, 0.038, 1, 10);
    const nodeSphereGeo = new THREE.SphereGeometry(0.09, 14, 14);

    const rungMaterial1 = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, // Cyan
      emissive: 0x0891b2,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    const rungMaterial2 = new THREE.MeshPhysicalMaterial({
      color: 0x14b8a6, // Teal
      emissive: 0x0f766e,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    for (let i = 0; i < rungsCount; i++) {
      const t = i / (rungsCount - 1);
      const y = (t - 0.5) * helixHeight;
      const angle = t * Math.PI * 2 * turns;

      const p1 = new THREE.Vector3(
        Math.cos(angle) * helixRadius,
        y,
        Math.sin(angle) * helixRadius
      );
      const p2 = new THREE.Vector3(
        Math.cos(angle + Math.PI) * helixRadius,
        y,
        Math.sin(angle + Math.PI) * helixRadius
      );

      // Distance and midpoint
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);

      const rungMesh = new THREE.Mesh(
        rungGeo,
        i % 2 === 0 ? rungMaterial1 : rungMaterial2
      );
      rungMesh.scale.set(1, distance, 1);
      rungMesh.position.copy(mid);

      // Orient cylinder towards endpoints
      const orientation = new THREE.Vector3().subVectors(p2, p1).normalize();
      rungMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), orientation);
      dnaGroup.add(rungMesh);

      // Node Spheres on the joints
      const node1 = new THREE.Mesh(nodeSphereGeo, nodeMaterial);
      node1.position.copy(p1);
      dnaGroup.add(node1);

      const node2 = new THREE.Mesh(nodeSphereGeo, nodeMaterial);
      node2.position.copy(p2);
      dnaGroup.add(node2);
    }

    // --- Molecular Plexus & Floating Constellation (Left & Center Background) ---
    const plexusGroup = new THREE.Group();
    scene.add(plexusGroup);

    const nodeCount = 140;
    const nodeCoords: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5 - 1.5
      );
      nodeCoords.push(pos);
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        )
      );
    }

    // Node Points
    const plexusGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      posArray[i * 3] = nodeCoords[i].x;
      posArray[i * 3 + 1] = nodeCoords[i].y;
      posArray[i * 3 + 2] = nodeCoords[i].z;
    }
    plexusGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const plexusPointsMat = new THREE.PointsMaterial({
      color: 0x0d9488,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
    });
    const plexusPoints = new THREE.Points(plexusGeo, plexusPointsMat);
    plexusGroup.add(plexusPoints);

    // Dynamic Connecting Lines between nearby nodes
    const maxLines = 400;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.28,
      linewidth: 1,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    plexusGroup.add(lineSegments);

    // Floating Bokeh & Micro Particles
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 14;
      dustPos[i + 1] = (Math.random() - 0.5) * 10;
      dustPos[i + 2] = (Math.random() - 0.5) * 7;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // --- Mouse Parallax Tracking ---
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx * 0.4;
      targetY = -ny * 0.3;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- Resize Observer ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Responsive DNA position: shift towards center on mobile, right on desktop
      if (width < 768) {
        dnaGroup.position.set(0.5, 0, -1);
      } else {
        dnaGroup.position.set(2.2, 0, 0);
      }

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // --- Animation Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * speed;

      // Rotate DNA double helix continuously
      dnaGroup.rotation.y += delta * 0.45 * speed;

      // Smooth mouse parallax lerp
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX;
      camera.position.y = currentY;
      camera.lookAt(0, 0, 0);

      // Gentle floating oscillation
      dnaGroup.position.y = Math.sin(time * 0.6) * 0.15;

      // Animate Plexus Nodes & Connections
      let lineIndex = 0;
      const positions = plexusGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        nodeCoords[i].add(nodeVelocities[i]);

        // Boundary bounce
        if (Math.abs(nodeCoords[i].x) > 6) nodeVelocities[i].x *= -1;
        if (Math.abs(nodeCoords[i].y) > 4.5) nodeVelocities[i].y *= -1;

        positions[i * 3] = nodeCoords[i].x;
        positions[i * 3 + 1] = nodeCoords[i].y;
        positions[i * 3 + 2] = nodeCoords[i].z;

        // Find neighbors for connection lines
        for (let j = i + 1; j < nodeCount; j++) {
          if (lineIndex >= maxLines * 6) break;
          const d = nodeCoords[i].distanceTo(nodeCoords[j]);
          if (d < 1.35) {
            linePositions[lineIndex++] = nodeCoords[i].x;
            linePositions[lineIndex++] = nodeCoords[i].y;
            linePositions[lineIndex++] = nodeCoords[i].z;

            linePositions[lineIndex++] = nodeCoords[j].x;
            linePositions[lineIndex++] = nodeCoords[j].y;
            linePositions[lineIndex++] = nodeCoords[j].z;
          }
        }
      }

      plexusGeo.attributes.position.needsUpdate = true;

      // Clear remaining line slots
      for (let k = lineIndex; k < maxLines * 6; k++) {
        linePositions[k] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      tubeGeo1.dispose();
      tubeGeo2.dispose();
      strandMaterial.dispose();
      rungGeo.dispose();
      nodeSphereGeo.dispose();
      rungMaterial1.dispose();
      rungMaterial2.dispose();
      nodeMaterial.dispose();
      plexusGeo.dispose();
      plexusPointsMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`biotech-dna-canvas ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Luminous Medical Gradient Aura & Vignette */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(255, 255, 255, 0) 75%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "550px",
          height: "550px",
          background:
            "radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, rgba(240, 253, 250, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

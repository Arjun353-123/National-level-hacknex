import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Simulate authentication logic
    // In a real app, you would verify against a database
    const isAdmin = email.includes("admin");
    const user = {
      id: isAdmin ? "admin-001" : "patient-001",
      email,
      role: isAdmin ? "admin" : "patient",
      name: isAdmin ? "Admin User" : "Patient User",
    };

    // In a real app, you would:
    // 1. Hash and verify password
    // 2. Create a JWT token or session
    // 3. Set secure HTTP-only cookies

    return NextResponse.json({
      success: true,
      user,
      token: `mock-token-${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

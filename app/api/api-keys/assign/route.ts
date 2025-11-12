import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assignKeyToUser, getKeyByUser } from "@/lib/api-key-manager";

/**
 * POST /api/api-keys/assign
 * Assign an API key to the logged-in user
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only Google OAuth is configured, so any authenticated session is from Google
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be logged in with Google to request an API key",
        },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Check if user already has a key
    const existingKey = getKeyByUser(userEmail);
    if (existingKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Already Assigned",
          message: "You already have an API key assigned",
          apiKey: existingKey.key,
        },
        { status: 400 }
      );
    }

    // Assign a new key
    const result = assignKeyToUser(userEmail);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Assignment Failed",
          message: result.error || "Failed to assign API key",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "API key assigned successfully",
        apiKey: result.key,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning API key:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to assign API key",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/api-keys/assign
 * Get the current user's API key if they have one
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication - only Google OAuth is configured, so any authenticated session is from Google
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be logged in with Google to view your API key",
        },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Get user's key
    const key = getKeyByUser(userEmail);

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          hasKey: false,
          message: "You don't have an API key assigned yet",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        hasKey: true,
        apiKey: key.key,
        assignedAt: key.assignedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting API key:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to get API key",
      },
      { status: 500 }
    );
  }
}


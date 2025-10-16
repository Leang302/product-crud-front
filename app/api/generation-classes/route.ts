import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const API_BASE_URL = "http://167.172.68.245:8088/api/v1";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get("generationId");
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";

    const session = await auth();
    console.log("Session:", session);
    console.log("Session keys:", session ? Object.keys(session) : "No session");
    const accessToken = (session as any)?.accessToken as string;

    if (!accessToken) {
      console.log("No access token found in session");
      console.log("Session object:", JSON.stringify(session, null, 2));
      return NextResponse.json(
        { error: "Unauthorized - No access token in session" },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}/generation-classes?generationId=${generationId}&page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch generation classes: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Generation classes API response:", data);
    console.log("First item details:", data.payload?.items?.[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in generation-classes API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

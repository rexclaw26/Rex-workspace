import { NextResponse } from "next/server";

// POST /api/tasks/run — triggers skill execution
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId, skill, skillCode, description, agent } = body;

    if (!taskId || !skill) {
      return NextResponse.json(
        { error: "taskId and skill are required" },
        { status: 400 }
      );
    }

    // In production, this calls sessions_spawn via REX_API_URL
    const rexApiUrl = process.env.REX_API_URL;
    if (!rexApiUrl) {
      return NextResponse.json(
        { error: "REX_API_URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${rexApiUrl}/sessions/spawn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: `Execute skill "${skill}" for task: ${description}`,
        agentId: agent || "Rex",
      }),
    });

    if (!response.ok) {
      throw new Error(`Spawn failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      sessionKey: data.sessionKey || data.session_key,
      status: "started",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}

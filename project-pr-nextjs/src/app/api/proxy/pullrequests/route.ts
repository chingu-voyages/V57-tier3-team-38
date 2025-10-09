// src/app/api/proxy/pullrequests/route.ts
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const state = searchParams.get("state") ?? "open";

  // Forward to your Express backend
  const upstream = `${API_BASE}/api/pullrequests?owner=${owner}&repo=${repo}&state=${state}`;

  try {
    const res = await fetch(upstream);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: `Upstream error: ${res.status} ${text}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Proxy request failed" }, { status: 500 });
  }
}

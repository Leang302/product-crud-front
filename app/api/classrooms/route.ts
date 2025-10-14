import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/app/api/auth/[...nextauth]/route"

const API_BASE = "http://167.172.68.245:8088/api/v1"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authConfig as any)
  const accessToken = (session as any)?.accessToken as string | undefined
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ?? "1"
  const size = searchParams.get("size") ?? "10"
  const url = `${API_BASE}/classrooms?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" })
  const text = await res.text()
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig as any)
  const accessToken = (session as any)?.accessToken as string | undefined
  const body = await req.text()
  const url = `${API_BASE}/classrooms`
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }
  const res = await fetch(url, { method: "POST", headers, body })
  const text = await res.text()
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } })
}



import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "Unknown";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "toolify.local";

  const headersObj: Record<string, string> = {};
  request.headers.forEach((val, key) => {
    headersObj[key] = val;
  });

  return NextResponse.json({
    ip,
    userAgent,
    protocol: proto,
    host,
    headers: headersObj,
  });
}

import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip === "0.0.0.0") return true;

  const parts = ip.split(".").map(Number);
  if (parts.length === 4) {
    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) return true;
    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0 - 169.254.255.255 (Link-local / AWS Metadata)
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetUrl = body.url;

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL syntax" }, { status: 400 });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Only HTTP and HTTPS protocols are supported" }, { status: 400 });
    }

    // SSRF DNS resolution validation
    try {
      const lookup = await dns.promises.lookup(parsedUrl.hostname);
      if (isPrivateIp(lookup.address)) {
        return NextResponse.json(
          { error: "Access to private, localhost, or internal cloud IP ranges is blocked (SSRF Protection)." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json({ error: `Could not resolve domain: ${parsedUrl.hostname}` }, { status: 404 });
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Toolify-Uptime-Bot/1.0 (+https://toolify.local)",
      },
    });

    clearTimeout(timeout);
    const endTime = Date.now();
    const responseTimeMs = endTime - startTime;

    return NextResponse.json({
      online: response.status >= 200 && response.status < 400,
      statusCode: response.status,
      statusText: response.statusText,
      responseTimeMs,
      finalUrl: response.url,
      contentType: response.headers.get("content-type") || "unknown",
      server: response.headers.get("server") || "hidden",
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json({ error: "Connection timed out after 6 seconds" }, { status: 504 });
    }
    return NextResponse.json({ error: err.message || "Failed to connect to target host" }, { status: 502 });
  }
}

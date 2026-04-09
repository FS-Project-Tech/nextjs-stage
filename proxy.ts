import { NextResponse, type NextRequest } from "next/server";
import { proxy as addSecurityHeadersToResponse } from "@/lib/security-headers";
import { headers } from "next/headers";

/**
 * Next.js 16+: `middleware.ts` is deprecated in favor of `proxy.ts`.
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */
export function proxy(_request: NextRequest) {
  try {
    const response = NextResponse.next();
    return addSecurityHeadersToResponse(_request);
  } catch (error) {
    console.error("[Proxy] Error:", error);
    const response = NextResponse.next();
    return addSecurityHeadersToResponse(_request);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

const nonce = (await headers()).get("x-nonce") ?? undefined;
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com;
  img-src 'self' data: https://www.google-analytics.com;
`

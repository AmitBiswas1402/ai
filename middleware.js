import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; // Ensure NextResponse is imported

// Custom function to match protected routes
const isProtectedRoute = (req) => {
  const protectedRoutes = [
    "/dashboard",
    "/resume",
    "/interview",
    "/ai-cover-letter",
    "/onboarding",
  ];
  const url = new URL(req.url);
  return protectedRoutes.some((route) => url.pathname.startsWith(route));
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
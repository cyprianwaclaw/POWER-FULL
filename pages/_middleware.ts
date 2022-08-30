import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname, basePath } = req.nextUrl;
  if (pathname == "/login" || pathname == "/register") {
    return NextResponse.next();
  }

  const res = await fetch(`${process.env.API_URL}/users/current`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.cookies.access_token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (res.status != 200) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname == "/quizzes") {
    return NextResponse.redirect(`${req.url}/1`);
  }

  return NextResponse.next();
}

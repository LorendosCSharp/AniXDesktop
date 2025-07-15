import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { fetchDataViaPost } from "../utils";
import { ENDPOINTS } from "../config";

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 0;
  const query = decodeURI(request.nextUrl.searchParams.get("q")) || null;
  const token = request.nextUrl.searchParams.get("token") || null;

  const where = request.nextUrl.searchParams.get("where") || "releases";
  const searchBy = parseInt(request.nextUrl.searchParams.get("searchBy")) || 0;
  const list = parseInt(request.nextUrl.searchParams.get("list")) || null;

  let url: URL;

  if (where == "list") {
    if (!list) {
      return NextResponse.json(
        { message: "List ID required" },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json({ message: "token required" }, { status: 400 });
    }
    url = new URL(`${ENDPOINTS.search}/profile/list/${list}/${page}`);
  } else if (where == "history") {
    if (!token) {
      return NextResponse.json({ message: "token required" }, { status: 400 });
    }
    url = new URL(`${ENDPOINTS.search}/history/${page}`);
  } else if (where == "favorites") {
    if (!token) {
      return NextResponse.json({ message: "token required" }, { status: 400 });
    }
    url = new URL(`${ENDPOINTS.search}/favorites/${page}`);
  } else if (where == "collections") {
    if (!token) {
      return NextResponse.json({ message: "token required" }, { status: 400 });
    }
    url = new URL(`${ENDPOINTS.search}/favoriteCollections/${page}`);
  } else if (where == "profiles") {
    url = new URL(`${ENDPOINTS.search}/profiles/${page}`);
  } else {
    url = new URL(`${ENDPOINTS.search}/releases/${page}`);
  }

  if (token) {
    url.searchParams.set("token", token);
  }
  const body = { query, searchBy };

  const { data, error } = await fetchDataViaPost(
    url.toString(),
    JSON.stringify(body),
    true
  );
  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

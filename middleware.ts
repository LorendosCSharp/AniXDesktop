import type { NextFetchEvent } from "next/server";
import { fetchDataViaGet, fetchDataViaPost } from "#/api/utils";
import { API_URL } from "#/api/config";

export const config = {
  matcher: "/api/proxy/:path*",
};

export default async function middleware(
  request: Request,
  context: NextFetchEvent
) {
  if (request.method == "GET") {
    const url = new URL(request.url);
    const isApiV2 = url.searchParams.get("API-Version") == "v2" || false;
    if (isApiV2) {
      url.searchParams.delete("API-Version");
    }
    let path = url.pathname.match(/\/api\/proxy\/(.*)/)?.[1] + url.search;

    const { data, error } = await fetchDataViaGet(
      `${API_URL}/${path}`,
      isApiV2
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

  if (request.method == "POST") {
    const url = new URL(request.url);
    const isApiV2 = url.searchParams.get("API-Version") == "v2" || false;
    if (isApiV2) {
      url.searchParams.delete("API-Version");
    }
    const path = url.pathname.match(/\/api\/proxy\/(.*)/)?.[1] + url.search;

    const ReqContentTypeHeader = request.headers.get("Content-Type") || "";
    const ReqSignHeader = request.headers.get("Sign") || null;
    let ResContentTypeHeader = "";
    let body = null;

    if (ReqContentTypeHeader.split(";")[0] == "multipart/form-data") {
      ResContentTypeHeader = ReqContentTypeHeader;
      body = await request.arrayBuffer();
    } else if (ReqContentTypeHeader == "application/x-www-form-urlencoded") {
      ResContentTypeHeader = ReqContentTypeHeader;
    } else {
      ResContentTypeHeader = "application/json; charset=UTF-8";
      body = JSON.stringify(await request.json());
    }

    let resHeaders = {};
    resHeaders["Content-Type"] = ResContentTypeHeader;
    ReqSignHeader && (resHeaders["Sign"] = ReqSignHeader);

    const { data, error } = await fetchDataViaPost(
      `${API_URL}/${path}`,
      body,
      isApiV2,
      resHeaders
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
}

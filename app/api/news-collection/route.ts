// app/api/news-collection/route.ts
import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get("id");
    const nextPage = searchParams.get("nextPage") || "";
    const category = searchParams.get("category") || "";
    const fromDate = searchParams.get("from_date") || "";
    const toDate = searchParams.get("to_date") || "";
    const query = searchParams.get("q") || "";
    const pageSize = searchParams.get("size") || "12";

    if (!NEWS_API_KEY) {
      console.error("NEWS_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "News service is not configured. Please set NEWS_API_KEY in the environment.",
        },
        { status: 500 }
      );
    }

    let apiUrl: string;

    if (articleId) {
      apiUrl = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&id=${articleId}`;
    } else {
      // Build API URL - use country=bd for Bangladesh news
      apiUrl = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=bd&size=${pageSize}`;

      // Use nextPage token for pagination instead of page number
      if (nextPage) {
        apiUrl += `&page=${nextPage}`;
      }

      if (category) {
        apiUrl += `&category=${category}`;
      }

      if (fromDate) {
        apiUrl += `&from_date=${fromDate}`;
      }

      if (toDate) {
        apiUrl += `&to_date=${toDate}`;
      }

      if (query) {
        apiUrl += `&q=${encodeURIComponent(query)}`;
      }
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("News API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        // url: apiUrl.replace(NEWS_API_KEY, "REDACTED"),
      });
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();

    return NextResponse.json({
      results: data.results || [],
      nextPage: data.nextPage || null,
      totalResults: data.totalResults || 0,
    });
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", results: [], nextPage: null },
      { status: 500 }
    );
  }
}

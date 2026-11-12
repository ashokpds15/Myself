import {
  createBlogErrorResponse,
  createBlogResponse,
  getBlogPosts,
} from "../../_shared/blog-feed.mjs";

export async function onRequestGet({ request, env }) {
  const requestedLimit = Number.parseInt(
    new URL(request.url).searchParams.get("maxResults"),
    10
  );
  const maxResults = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : 12;

  try {
    const data = await getBlogPosts({
      blogId: env.BLOGGER_BLOG_ID,
      maxResults,
    });
    return createBlogResponse(data);
  } catch (error) {
    console.error("Error fetching Blogger posts:", error);
    return createBlogErrorResponse();
  }
}

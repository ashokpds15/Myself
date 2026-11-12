import {
  createBlogErrorResponse,
  createBlogResponse,
  getBlogPost,
} from "../../../_shared/blog-feed.mjs";

export async function onRequestGet({ params, env }) {
  if (!/^\d+$/.test(params.postId)) {
    return new Response(JSON.stringify({ message: "Invalid blog post ID." }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  try {
    const post = await getBlogPost({
      blogId: env.BLOGGER_BLOG_ID,
      postId: params.postId,
    });
    return createBlogResponse(post);
  } catch (error) {
    console.error("Error fetching Blogger post:", error);
    return createBlogErrorResponse();
  }
}

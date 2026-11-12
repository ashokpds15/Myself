const DEFAULT_BLOG_ID = "3800019340026834324";

function normalizePost(entry) {
  const rawId = entry?.id?.$t || "";
  const id = rawId.match(/\.post-(\d+)$/)?.[1];

  if (!id) {
    throw new Error("Blogger returned a post with an invalid ID");
  }

  return {
    id,
    title: entry.title?.$t || "Untitled post",
    content: entry.content?.$t || entry.summary?.$t || "",
    published: entry.published?.$t || "",
    updated: entry.updated?.$t || "",
    url:
      (entry.link || []).find((link) => link.rel === "alternate")?.href || "",
  };
}

async function fetchFeed({ blogId, postId, maxResults, fetchImpl }) {
  const postPath = postId ? `/${encodeURIComponent(postId)}` : "";
  const url = new URL(
    `https://www.blogger.com/feeds/${blogId}/posts/default${postPath}`
  );
  url.searchParams.set("alt", "json");

  if (maxResults) {
    url.searchParams.set("max-results", String(maxResults));
  }

  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Blogger feed request failed (${response.status})`);
  }

  return response.json();
}

export async function getBlogPosts({
  blogId = DEFAULT_BLOG_ID,
  maxResults = 12,
  fetchImpl = fetch,
} = {}) {
  const data = await fetchFeed({ blogId, maxResults, fetchImpl });
  const feed = data.feed || {};

  return {
    items: (feed.entry || []).map(normalizePost),
    totalItems: Number(feed["openSearch$totalResults"]?.$t || 0),
  };
}

export async function getBlogPost({
  blogId = DEFAULT_BLOG_ID,
  postId,
  fetchImpl = fetch,
} = {}) {
  const data = await fetchFeed({ blogId, postId, fetchImpl });
  return normalizePost(data.entry);
}

export function createBlogResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function createBlogErrorResponse() {
  return new Response(
    JSON.stringify({ message: "Unable to load blog content." }),
    {
      status: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );
}

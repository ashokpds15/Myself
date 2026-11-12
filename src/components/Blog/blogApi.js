export const API_BASE_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const BLOG_API_BASE_URL = (
  process.env.REACT_APP_BLOG_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : API_BASE_URL)
).replace(/\/+$/, "");

async function fetchBlogResource(path, signal) {
  const response = await fetch(`${BLOG_API_BASE_URL}/api/blog/${path}`, {
    signal,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load blog content.");
  }

  return data;
}

export function fetchBlogPosts(maxResults, signal) {
  const query = new URLSearchParams({ maxResults: String(maxResults) });
  return fetchBlogResource(`posts?${query}`, signal);
}

export function fetchBlogPost(postId, signal) {
  return fetchBlogResource(`posts/${encodeURIComponent(postId)}`, signal);
}

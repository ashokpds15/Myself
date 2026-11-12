import test from "node:test";
import assert from "node:assert/strict";
import { getBlogPost, getBlogPosts } from "./blog-feed.mjs";

const sampleEntry = {
  id: { $t: "tag:blogger.com,1999:blog-123.post-456" },
  title: { $t: "A test post" },
  content: { $t: "<p>Post content</p>" },
  published: { $t: "2026-01-02T03:04:05Z" },
  updated: { $t: "2026-01-03T03:04:05Z" },
  link: [{ rel: "alternate", href: "https://example.com/post" }],
};

test("normalizes Blogger feed entries for the blog list", async () => {
  let requestedUrl;
  const result = await getBlogPosts({
    blogId: "123",
    maxResults: 5,
    fetchImpl: async (url) => {
      requestedUrl = new URL(url);
      return Response.json({
        feed: {
          entry: [sampleEntry],
          "openSearch$totalResults": { $t: "27" },
        },
      });
    },
  });

  assert.equal(requestedUrl.searchParams.get("alt"), "json");
  assert.equal(requestedUrl.searchParams.get("max-results"), "5");
  assert.deepEqual(result, {
    items: [
      {
        id: "456",
        title: "A test post",
        content: "<p>Post content</p>",
        published: "2026-01-02T03:04:05Z",
        updated: "2026-01-03T03:04:05Z",
        url: "https://example.com/post",
      },
    ],
    totalItems: 27,
  });
});

test("loads a single post by its Blogger post ID", async () => {
  let requestedUrl;
  const post = await getBlogPost({
    blogId: "123",
    postId: "456",
    fetchImpl: async (url) => {
      requestedUrl = new URL(url);
      return Response.json({ entry: sampleEntry });
    },
  });

  assert.match(requestedUrl.pathname, /\/posts\/default\/456$/);
  assert.equal(post.id, "456");
  assert.equal(post.title, "A test post");
});

test("rejects malformed Blogger post entries", async () => {
  await assert.rejects(
    getBlogPost({
      blogId: "123",
      postId: "456",
      fetchImpl: async () =>
        Response.json({ entry: { title: { $t: "Missing ID" } } }),
    }),
    /invalid ID/
  );
});

import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Particle from "../Particle";
import DOMPurify from "dompurify";
import { fetchBlogPost } from "./blogApi";
import "./BlogPostDetail.css";

function BlogPostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const data = await fetchBlogPost(postId, controller.signal);

        if (data && data.id) {
          setPost(data);
          setError(null);
        } else {
          setError("Blog post not found.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPost();
    return () => controller.abort();
  }, [postId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "rgba(9, 29, 52, 0.95)" }}>
      <Particle />
      <Container style={{ paddingTop: "100px", paddingBottom: "50px" }}>
        {loading && (
          <p style={{ color: "white", textAlign: "center", fontSize: "1.2em" }}>
            Loading blog post...
          </p>
        )}

        {error && (
          <div style={{ color: "#ff6b6b", textAlign: "center", padding: "20px" }}>
            <p>{error}</p>
            <button
              onClick={() => navigate("/blog")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#c770f0",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to Blogs
            </button>
          </div>
        )}

        {post && (
          <article className="blog-post-detail">
            <h1 className="blog-post-title">{post.title}</h1>

            <div className="blog-post-meta">
              <span>Published: {formatDate(post.published)}</span>
              {post.updated && (
                <span style={{ marginLeft: "20px" }}>
                  Updated: {formatDate(post.updated)}
                </span>
              )}
            </div>

            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content),
              }}
            />

            <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #444" }}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#c770f0",
                  textDecoration: "none",
                  borderBottom: "2px solid #c770f0",
                  position: "relative",
                  zIndex: "10",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                View on Blogger →
              </a>
            </div>

            <button
              onClick={() => navigate("/blog")}
              style={{
                marginTop: "20px",
                padding: "8px 16px",
                backgroundColor: "#c770f0",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.95em",
              }}
            >
              ← Back to Blogs
            </button>
          </article>
        )}

        {!loading && !post && !error && (
          <p style={{ color: "white", textAlign: "center" }}>Post not found.</p>
        )}
      </Container>
    </div>
  );
}

export default BlogPostDetail;

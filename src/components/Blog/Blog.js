import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import BlogCard from "./BlogCard";
import BlogSubscription from "./BlogSubscription";
import { fetchBlogPosts } from "./blogApi";
import "./Blog.css";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const data = await fetchBlogPosts(12, controller.signal);

        if (Array.isArray(data.items)) {
          setPosts(data.items);
          setError(null);
        } else {
          setError("No blog posts found.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, []);

  return (
    <Container fluid className="blog-section">
      <Particle />
      <Container>
        <h1 className="blog-heading">
          My Recent <strong className="purple">Blogs </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few own words.
        </p>

        {loading && <p style={{ color: "white", textAlign: "center" }}>Loading blog posts...</p>}

        {error && (
          <div style={{ color: "#ff6b6b", textAlign: "center", padding: "20px" }}>
            <p>{error}</p>
            <p style={{ fontSize: "0.9em", marginTop: "10px" }}>
              Blog service configuration may be missing. Please try again later.
            </p>
          </div>
        )}

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {posts.map((post) => (
            <Col md={4} className="blog-card-container" key={post.id}>
              <BlogCard
                postId={post.id}
                title={post.title}
                description={post.content}
                link={post.url}
                published={post.published}
              />
            </Col>
          ))}
        </Row>

        {posts.length === 0 && !loading && !error && (
          <p style={{ color: "white", textAlign: "center" }}>
            No blog posts found. Start writing!
          </p>
        )}

        <BlogSubscription />

        <div style={{ textAlign: "center", paddingTop: "30px" }}>
          <a
            href="https://ashokpudasaini.blogspot.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#c770f0",
              fontSize: "1.1em",
              textDecoration: "none",
              borderBottom: "2px solid #c770f0",
              paddingBottom: "5px",
              position: "relative",
              zIndex: "10",
              pointerEvents: "auto",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            View all posts on Blogger →
          </a>
        </div>
      </Container>
    </Container>
  );
}

export default Blog;

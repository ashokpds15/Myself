import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BlogCard from "./BlogCard";
import { Link } from "react-router-dom";

function BlogPreview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BLOGGER_API_KEY = "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";
  const BLOG_ID = "3800019340026834324";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${BLOGGER_API_KEY}&maxResults=3`
        );
        const data = await response.json();
        if (data.items) {
          setPosts(data.items);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container fluid style={{ padding: "50px 0", backgroundColor: "rgba(9, 29, 52, 0.8)" }}>
      <Container>
        <h1 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
          My Recent <span style={{ color: "#c770f0" }}>Blogs</span>
        </h1>

        {loading && (
          <p style={{ color: "white", textAlign: "center" }}>Loading blog posts...</p>
        )}

        {posts.length > 0 && (
          <Row style={{ justifyContent: "center", marginBottom: "30px" }}>
            {posts.map((post) => (
              <Col md={4} key={post.id} style={{ marginBottom: "20px" }}>
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
        )}

        <Row style={{ justifyContent: "center", marginTop: "30px" }}>
          <Col md={12} style={{ textAlign: "center" }}>
            <Link to="/blog">
              <Button
                style={{
                  backgroundColor: "#c770f0",
                  border: "none",
                  padding: "10px 30px",
                  fontSize: "1em",
                }}
              >
                View All Blogs →
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default BlogPreview;

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import BlogCard from "./BlogCard";
import "./Blog.css";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace these with your actual Blogger API key and Blog ID
  const BLOGGER_API_KEY = "AIzaSyCI9xZXzwPvx4bICIctsnTbxk9mfzIWNsY";
  const BLOG_ID = "3800019340026834324";

  useEffect(() => {
    if (BLOGGER_API_KEY === "YOUR_BLOGGER_API_KEY" || BLOG_ID === "YOUR_BLOG_ID") {
      setError("Please configure your Blogger API key and Blog ID in Blog.js");
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${BLOGGER_API_KEY}&maxResults=12`
        );
        const data = await response.json();
        
        if (data.error) {
          console.error("API Error:", data.error);
          setError(`API Error: ${data.error.message}`);
        } else if (data.items) {
          setPosts(data.items);
          setError(null);
        } else {
          setError("No blog posts found.");
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts. Please check your API key and Blog ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [BLOGGER_API_KEY, BLOG_ID]);

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
              Get your API key from{" "}
              <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">
                Google Cloud Console
              </a>
              {" "}and your Blog ID from your Blogger dashboard.
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

        <div style={{ textAlign: "center", paddingTop: "30px" }}>
          <a
            href="https://ashokpudasaini.blogspot.com"
            target="_blank"
            rel="noreferrer"
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

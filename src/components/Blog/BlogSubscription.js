import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { AiOutlineMail } from "react-icons/ai";
import "./BlogSubscription.css";

const BlogSubscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setMessageType("danger");
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("✓ Successfully subscribed! You'll receive updates on new blogs.");
        setEmail("");
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessageType("danger");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessageType("danger");
      setMessage("Failed to subscribe. Please check the backend server.");
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="blog-subscription my-5">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col md={8}>
            <div className="subscription-card">
              <div className="subscription-header">
                <AiOutlineMail size={40} className="subscription-icon" />
                <h2>Subscribe to My Blog</h2>
                <p>Get notified when I publish new blog posts</p>
              </div>

              <Form onSubmit={handleSubscribe} className="subscription-form">
                <Form.Group className="subscription-input-group">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="subscription-input"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="subscription-button"
                  >
                    {loading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </Form.Group>

                {message && (
                  <Alert
                    variant={messageType}
                    className="subscription-alert mt-3"
                    dismissible
                    onClose={() => setMessage("")}
                  >
                    {message}
                  </Alert>
                )}
              </Form>

              <p className="subscription-privacy text-muted">
                We respect your privacy. Your email will only be used to send blog updates.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BlogSubscription;

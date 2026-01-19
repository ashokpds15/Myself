import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { Link } from "react-router-dom";

function BlogCard(props) {
  // Strip HTML tags from description
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const cleanDescription = stripHtml(props.description).substring(0, 150) + "...";

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <Card className="blog-card-view">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify", color: "#999" }}>
          {cleanDescription}
        </Card.Text>
        <div style={{ fontSize: "0.85em", color: "#888", marginBottom: "10px" }}>
          Published: {formatDate(props.published)}
        </div>
        <Link to={`/blog/${props.postId}`}>
          <Button variant="primary">
            <CgWebsite /> &nbsp;
            {"Read Full Post"}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default BlogCard;

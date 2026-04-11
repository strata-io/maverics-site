import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { HTMLContent } from "../components/Content";
import TableOfContents from "../components/TableOfContents";
import { getAuthor } from "../data/authors";

const BlogPostTemplate = ({
  content,
  title,
  date,
  author: authorName,
  description,
  category,
  featuredimage,
  tags,
}) => {
  const author = getAuthor(authorName);

  return (
    <>
      {/* Dark Hero Header */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="blog-hero-text">
            <h1 className="blog-hero-title">{title}</h1>
            <div className="blog-hero-meta">
              {author.image ? (
                <img
                  className="author-avatar"
                  src={author.image}
                  alt={author.name}
                />
              ) : (
                <div
                  className="author-avatar"
                  style={{
                    background: "#00BFA6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0A0A0A",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                  }}
                >
                  {author.name ? author.name.charAt(0) : "M"}
                </div>
              )}
              <div className="author-info">
                <span className="author-name">
                  Written by: {author.name}
                </span>
                <br />
                <span className="publish-date">Published: {date}</span>
              </div>
            </div>
            <div className="share-buttons">
              <span className="share-label">SHARE:</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                in
              </a>
              <a
                href={`https://twitter.com/intent/tweet`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
              >
                𝕏
              </a>
            </div>
          </div>
          {featuredimage && (
            <div className="blog-hero-image">
              <img src={featuredimage} alt={title} />
            </div>
          )}
        </div>
      </section>

      {/* Content Area */}
      <div className="blog-content-area">
        <div className="blog-content-wrapper">
          <TableOfContents content={content} />
          <div className="blog-body">
            <HTMLContent content={content} />
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <section
          style={{
            background: "#F5F5F5",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h4 style={{ color: "#666", marginBottom: "1rem" }}>Tags</h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/`}
                  style={{
                    background: "#E0E0E0",
                    color: "#333",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mav-cta-section">
        <h2>Ready to secure the future of identity for AI agents?</h2>
        <p>
          Orchestrate runtime identity security for AI Agents. Enforce Agent
          zero trust delegated authorization to MCP resources.
        </p>
        <Link to="/labs/agentic-ai-sandbox/" className="cta-button">
          Try the Sandbox
        </Link>
      </section>
    </>
  );
};

BlogPostTemplate.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string,
  date: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  category: PropTypes.string,
  featuredimage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  tags: PropTypes.array,
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <SEO
        title={`${post.frontmatter.title} | Maverics Blog`}
        description={post.frontmatter.description}
        article={true}
      />
      <BlogPostTemplate
        content={post.html}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        author={post.frontmatter.author}
        description={post.frontmatter.description}
        category={post.frontmatter.category}
        featuredimage={post.frontmatter.featuredimage}
        tags={post.frontmatter.tags}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        author
        description
        category
        tags
        featuredimage
      }
    }
  }
`;

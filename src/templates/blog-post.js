import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { HTMLContentWithCodeCopy } from "../components/Content";
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
            <HTMLContentWithCodeCopy content={content} />
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <section className="blog-tags-band">
          <div className="blog-tags-inner">
            <h4>Tags</h4>
            <div className="blog-tags-list">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  className="blog-tag-link"
                  to={`/tags/${tag
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — blog-only styling (gradient + outline button); see .mav-cta-section--blog */}
      <section className="mav-cta-section mav-cta-section--blog">
        <h2>Ready to make identity consistent?</h2>
        <p>
          Use Identity Orchestration to integrate, automate, and secure identity
          and apps across hybrid and multi-cloud environments
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

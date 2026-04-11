import React from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";

const TagRoute = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges;
  const tag = pageContext.tag;
  const totalCount = data.allMarkdownRemark.totalCount;

  return (
    <Layout>
      <Helmet title={`${tag} | Maverics Blog`} />
      <section
        style={{
          background: "#0A0A0A",
          padding: "6rem 2rem 2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#FFFFFF", fontSize: "2rem" }}>
          {totalCount} post{totalCount === 1 ? "" : "s"} tagged with &ldquo;{tag}&rdquo;
        </h1>
        <Link
          to="/blog/"
          style={{
            color: "#00BFA6",
            marginTop: "1rem",
            display: "inline-block",
          }}
        >
          &larr; Browse all posts
        </Link>
      </section>
      <section style={{ background: "#F5F5F5", padding: "3rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {posts.map(({ node: post }) => (
            <div
              key={post.id}
              style={{
                background: "#FFFFFF",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <Link
                to={post.fields.slug}
                style={{ color: "#1a1a1a", textDecoration: "none" }}
              >
                <h3 style={{ marginBottom: "0.5rem" }}>
                  {post.frontmatter.title}
                </h3>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  {post.frontmatter.date}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;

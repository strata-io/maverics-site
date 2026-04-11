import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { HTMLContentWithCodeCopy } from "../components/Content";
import NewsSlider from "../components/NewsSlider";

const SolutionPageTemplate = ({
  title,
  heroText,
  description,
  content,
  ctaText,
  ctaLink,
  newsItems,
}) => {
  return (
    <>
      <section className="solution-hero">
        <div className="solution-breadcrumb">
          SOLUTIONS / {title.toUpperCase()}
        </div>
        <h1 className="solution-title">{title}</h1>
      </section>

      <section
        style={{
          background: "#0A0A0A",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>
            {heroText}
          </h2>
          <p style={{ color: "#B0B0B0", lineHeight: "1.7" }}>{description}</p>
        </div>
      </section>

      {content && (
        <section style={{ background: "#F5F5F5", padding: "3rem 2rem" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", color: "#1a1a1a" }}>
            <HTMLContentWithCodeCopy content={content} />
          </div>
        </section>
      )}

      <section className="mav-cta-section">
        <h2>Ready to secure the future of identity for AI agents?</h2>
        <p>
          Orchestrate runtime identity security for AI Agents. Enforce Agent
          zero trust delegated authorization to MCP resources.
        </p>
        <Link to={ctaLink || "/labs/agentic-ai-sandbox/"} className="cta-button">
          {ctaText || "Try the Sandbox"}
        </Link>
      </section>

      {newsItems && newsItems.length > 0 && (
        <NewsSlider items={newsItems} />
      )}
    </>
  );
};

SolutionPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  heroText: PropTypes.string,
  description: PropTypes.string,
  content: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  newsItems: PropTypes.array,
};

const SolutionPage = ({ data }) => {
  const { markdownRemark: page } = data;
  return (
    <Layout>
      <SEO
        title={`${page.frontmatter.title} | Maverics Solutions`}
        description={page.frontmatter.description}
      />
      <SolutionPageTemplate
        title={page.frontmatter.title}
        heroText={page.frontmatter.heroText}
        description={page.frontmatter.description}
        content={page.html}
        ctaText={page.frontmatter.ctaText}
        ctaLink={page.frontmatter.ctaLink}
        newsItems={page.frontmatter.newsItems}
      />
    </Layout>
  );
};

SolutionPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default SolutionPage;

export const pageQuery = graphql`
  query SolutionPageByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        heroText
        description
        ctaText
        ctaLink
        newsItems {
          title
          excerpt
          category
        }
      }
    }
  }
`;

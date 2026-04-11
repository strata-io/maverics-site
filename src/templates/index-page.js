import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import FeaturesGrid from "../components/FeaturesGrid";
import IndustrySolutions from "../components/IndustrySolutions";
import NewsSlider from "../components/NewsSlider";

export const IndexPageTemplate = ({
  heading,
  description,
  ctaText,
  ctaLink,
  features,
  solutions,
  newsItems,
}) => {
  return (
    <>
      {/* Hero Section */}
      <section className="mav-hero">
        <div className="hero-logo">
          <img
            src="/img/maverics-hero-logo.webp"
            alt="Maverics"
            style={{ maxWidth: "600px", width: "100%", height: "auto" }}
          />
        </div>
        <h2 className="hero-heading">{heading}</h2>
        <p className="hero-description">{description}</p>
        {ctaLink && (
          <Link to={ctaLink} className="hero-cta">
            ✨ {ctaText || "Try the Sandbox"}
          </Link>
        )}
        <div className="hero-screenshot">
          <img
            src="/img/maverics-screenshot.webp"
            alt="Maverics Console"
          />
        </div>
      </section>

      {/* Gap section */}
      <section
        style={{
          background: "#0A0A0A",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#B0B0B0",
            maxWidth: "800px",
            margin: "0 auto",
            fontSize: "1.1rem",
            lineHeight: "1.7",
          }}
        >
          Don&apos;t let the identity gap hold you back from deploying AI agents
          securely and confidently to production.
        </p>
      </section>

      {/* Features */}
      <FeaturesGrid features={features} />

      {/* Industry Solutions */}
      <IndustrySolutions solutions={solutions} />

      {/* CTA Section */}
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

      {/* Delegated Auth Section */}
      <section
        style={{
          background: "#0A0A0A",
          padding: "5rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
            Secure delegated AI actions with policy, context, and full
            auditability
          </h2>
          <p
            style={{
              color: "#B0B0B0",
              lineHeight: "1.7",
              marginBottom: "2rem",
            }}
          >
            From issuing refunds to making purchases, AI agents increasingly act
            on-behalf-of users and other systems. However, legacy IAM can&apos;t
            trace who delegated what, or enforce fine-grained policies during
            execution.
          </p>
          <Link to="/labs/agentic-ai-sandbox/" className="cta-button">
            Try the Sandbox
          </Link>
        </div>
      </section>

      {/* News Slider */}
      <NewsSlider items={newsItems} />
    </>
  );
};

IndexPageTemplate.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  features: PropTypes.array,
  solutions: PropTypes.array,
  newsItems: PropTypes.array,
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <SEO title="Maverics.ai | The runtime identity control plane for AI Agents" />
      <IndexPageTemplate
        heading={frontmatter.heading}
        description={frontmatter.description}
        ctaText={frontmatter.ctaText}
        ctaLink={frontmatter.ctaLink}
        features={frontmatter.features}
        solutions={frontmatter.solutions}
        newsItems={frontmatter.newsItems}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        heading
        description
        ctaText
        ctaLink
        features {
          title
          description
        }
        solutions {
          title
          description
          link
        }
        newsItems {
          title
          excerpt
          category
        }
      }
    }
  }
`;

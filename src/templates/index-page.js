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

      {/* Gartner Quote Section */}
      <section
        style={{
          background: "#0A0A0A",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "3rem 2.5rem",
          }}
        >
          <p
            style={{
              color: "#B0B0B0",
              fontSize: "1rem",
              lineHeight: "1.8",
              fontStyle: "italic",
              marginBottom: "1.5rem",
            }}
          >
            &ldquo;A unified model that extends established IAM principles and
            protocols to AI agents, while also fostering interoperability between
            different AI platforms, is crucial for realizing the benefits of
            agentic AI in a secure and responsible manner.&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <img
              src="/img/gartner-logo.svg"
              alt="Gartner"
              style={{ height: "24px", opacity: 0.7 }}
            />
            <span style={{ color: "#666", fontSize: "0.8rem" }}>
              Gartner, IAM for LLM-Based AI Agents, Homan Farahmand, 12 June
              2025
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <FeaturesGrid features={features} />

      {/* Field Guide CTA */}
      <section
        style={{
          background: "#0A0A0A",
          padding: "5rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "4rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ flex: "1", minWidth: "300px" }}>
            <Link to="/labs/agentic-ai-sandbox/" className="hero-cta">
              Try the Sandbox
            </Link>
            <h2 style={{ fontSize: "2rem", marginTop: "1.5rem", marginBottom: "1rem" }}>
              From chaos to control: A field guide to AI agent identity
            </h2>
            <p style={{ color: "#B0B0B0", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              Autonomous agents are multiplying across your environment — but do
              you know what they&apos;re doing, who they&apos;re acting for, or
              what they&apos;re allowed to access?
            </p>
            <a
              href="https://www.strata.io/resources/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              Get the field guide
            </a>
          </div>
          <div style={{ flex: "0 0 250px" }}>
            <img
              src="/img/field-guide-book.png"
              alt="AI Agent Identity Field Guide"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        </div>
      </section>

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

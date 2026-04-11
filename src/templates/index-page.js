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
          />
        </div>
        <h1 className="hero-heading">{heading}</h1>
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
          <div className="hero-bottom-mask" />
        </div>
      </section>

      {/* Problem Statement Section — 3 columns matching production */}
      <section className="mav-problem-section">
        <div className="problem-heading">
          <h2>
            Don&apos;t let the identity gap hold you back from deploying AI
            agents securely and confidently to production.
          </h2>
          <p>
            AI agents operate autonomously but lack essential identity controls.
            Without zero trust authentication, access control and
            human-in-the-loop authorization, agents run uncontrolled.
          </p>
        </div>
        <div className="problem-columns">
          <div>
            <h5>End-to-end observability</h5>
            <p>
              Without end-to-end observability, agents create shadow access and
              risk.
            </p>
          </div>
          <div>
            <h5>On-premises deployment</h5>
            <p>
              Without on-premises deployment, agents can&apos;t access core
              systems that can&apos;t migrate to the cloud.
            </p>
          </div>
          <div>
            <h5>Identity Orchestration for Agents</h5>
            <p>
              Strata&apos;s Identity Orchestration for Agents solves these
              challenges through our proven enterprise hybrid platform –
              Maverics.
            </p>
          </div>
        </div>
      </section>

      {/* Gartner Quote Section — full-width card matching production */}
      <section style={{ background: "#050B11", padding: "0 2rem 4rem" }}>
        <div className="blur-quote-box">
          <p style={{ marginBottom: "1.5rem" }}>
            <img
              src="/img/gartner-logo.svg"
              alt="Gartner"
              style={{ width: "144px", height: "auto" }}
            />
          </p>
          <h4>
            According to Gartner<sup>&reg;</sup>, &ldquo;A unified model that
            extends established IAM principles and protocols to AI agents, while
            also fostering interoperability between different AI platforms, is
            crucial for realizing the benefits of agentic AI in a secure and
            responsible manner.&rdquo;
          </h4>
          <p className="gartner-citation">
            Gartner, IAM for LLM-Based AI Agents, Homan Farahmand, 12 June 2025
            <br />
            GARTNER is a registered trademark and service mark of Gartner, Inc.
            and/or its affiliates in the U.S. and internationally and is used
            herein with permission. All rights reserved.
          </p>
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

import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import FeaturesGrid from "../components/FeaturesGrid";
import IndustrySolutions from "../components/IndustrySolutions";
import NewsSlider from "../components/NewsSlider";
import MeshGradient from "../components/MeshGradient";

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
      {/* Mesh Gradient wrapper — covers hero through Gartner (matching prod) */}
      <div className="mesh-gradient-wrapper" style={{ position: "relative", overflow: "hidden" }}>
        <MeshGradient />

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
              &#10024; {ctaText || "Try the Sandbox"}
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

        {/* Problem Statement Section — 3 columns */}
        <section className="mav-problem-section">
          <div className="problem-heading">
            <h2>
              Don&apos;t let the identity gap hold you back from deploying AI
              agents securely and confidently to production.
            </h2>
            <p className="font-size-20">
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
                challenges through our proven enterprise hybrid platform &ndash;
                Maverics.
              </p>
            </div>
          </div>
        </section>

        {/* Gartner Quote — blur-quote-box */}
        <section style={{ padding: "0 2rem 4rem", position: "relative", zIndex: 1 }}>
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
          <p className="gartner-citation" style={{
            color: "#5c5f71",
            fontSize: "13px",
            fontStyle: "italic",
            marginTop: "1.5rem",
            lineHeight: "1.5em",
          }}>
            Gartner, IAM for LLM-Based AI Agents, Homan Farahmand, 12 June 2025
            <br />
            GARTNER is a registered trademark and service mark of Gartner, Inc.
            and/or its affiliates in the U.S. and internationally and is used
            herein with permission. All rights reserved.
          </p>
        </div>
        </section>
      </div>
      {/* End mesh-gradient-wrapper */}

      {/* Features */}
      <FeaturesGrid features={features} />

      {/* Field Guide — blur-box-one with 7/5 split */}
      <section style={{ background: "#050B11", padding: "4rem 2rem" }}>
        <div className="blur-box-one">
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "3rem",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: "1 1 58%", minWidth: "300px" }}>
              <h2>
                From chaos to control:<br />
                A field guide to AI agent identity
              </h2>
              <p className="font-size-20">
                Autonomous agents are multiplying across your environment &mdash; but
                do you know what they&apos;re doing, who they&apos;re acting
                for, or what they&apos;re allowed to access?
              </p>
              <a
                className="strata-btn1"
                href="https://www.strata.io/resources/whitepapers/field-guide-to-ai-agent-identity/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get the field guide
              </a>
            </div>
            <div style={{ flex: "0 0 300px", textAlign: "center" }}>
              <a
                href="https://www.strata.io/resources/whitepapers/field-guide-to-ai-agent-identity/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/img/field-guide-book.png"
                  alt="AI Agent Identity Field Guide"
                  style={{ width: "362px", maxWidth: "100%", height: "auto" }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <IndustrySolutions solutions={solutions} />

      {/* Ready to Secure CTA — blur-box-two */}
      <section style={{ background: "#050B11", padding: "4rem 2rem" }}>
        <div className="blur-box-two">
          <h2 style={{ textAlign: "center" }}>
            Ready to secure the future of identity for AI agents?
          </h2>
          <p className="font-size-20" style={{ textAlign: "center" }}>
            Orchestrate runtime identity security for AI Agents. Enforce Agent
            zero trust delegated authorization to MCP resources.
          </p>
          <p style={{ textAlign: "center" }}>
            <Link className="strata-btn2" to="/labs/agentic-ai-sandbox/">
              Try the Sandbox
            </Link>
          </p>
        </div>
      </section>

      {/* Secure Delegated AI Actions — if-row with image */}
      <section className="if-row" style={{ padding: "160px 2rem 100px" }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "3rem",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 50%", minWidth: "300px", paddingRight: "40px" }}>
            <h2>
              Secure delegated AI actions with policy, context, and full
              auditability
            </h2>
            <p>
              From issuing refunds to making purchases, AI agents increasingly
              act on-behalf-of users and other systems. However, legacy IAM
              can&apos;t trace who delegated what, or enforce fine-grained
              policies during execution.
            </p>
            <p>
              With Maverics: Secure every agent workflow with delegated identity,
              runtime access enforcement, and contextual policy evaluation.
              Support OAuth 2.0 On-Behalf-Of (OBO), Demonstration of Proof of
              Possession (DPoP), and attribute-based authorization at the API
              layer. Ensure each action is logged, scoped, and auditable.
            </p>
            <p>
              <Link className="strata-btn9" to="/labs/agentic-ai-sandbox/">
                Try the Sandbox
              </Link>
            </p>
          </div>
          <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
            <img
              src="/img/agent-fabric.webp"
              alt="Agent Identity Fabric"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
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

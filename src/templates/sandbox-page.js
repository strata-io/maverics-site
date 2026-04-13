import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const SandboxPageTemplate = ({ title, heading, description, learnItems }) => {
  useEffect(() => {
    // Load HubSpot form script
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "6226005",
          formId: "4dd23cd3-4182-420c-b3b0-1cb85556a4f2",
          target: "#hubspot-form",
          css: "",
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="sandbox-section">
      <div className="sandbox-container">
        <div className="sandbox-content">
          <p className="sandbox-eyebrow">{title}</p>
          <h1 className="sandbox-heading">{heading}</h1>
          <p className="sandbox-description">{description}</p>
          {learnItems && learnItems.length > 0 && (
            <>
              <hr className="sandbox-divider" />
              <p className="sandbox-learn-label">
                You&apos;ll learn how to:
              </p>
              <ul className="sandbox-learn-list">
                {learnItems.map((item, i) => (
                  <li key={i} className="sandbox-learn-item">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="sandbox-form-wrapper">
          <div id="hubspot-form">
            <p style={{ color: "#B0B0B0", textAlign: "center" }}>
              Loading form...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

SandboxPageTemplate.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  learnItems: PropTypes.array,
};

const SandboxPage = ({ data }) => {
  const { markdownRemark: page } = data;
  return (
    <Layout>
      <SEO
        title="Maverics Sandbox for Agentic Identity | Try Free"
        description={page.frontmatter.description}
      />
      <SandboxPageTemplate
        title={page.frontmatter.title}
        heading={page.frontmatter.heading}
        description={page.frontmatter.description}
        learnItems={page.frontmatter.learnItems}
      />
    </Layout>
  );
};

SandboxPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default SandboxPage;

export const pageQuery = graphql`
  query SandboxPageByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        heading
        description
        learnItems
      }
    }
  }
`;

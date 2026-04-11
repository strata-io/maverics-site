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
          portalId: "your-portal-id",
          formId: "your-form-id",
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
    <>
      <section
        style={{
          background: "linear-gradient(135deg, #0A0A0A 0%, #111827 100%)",
          padding: "4rem 2rem",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "4rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1", minWidth: "300px" }}>
            <p
              style={{
                color: "#00BFA6",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              {title}
            </p>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "#FFFFFF",
                lineHeight: "1.2",
                marginBottom: "1.5rem",
              }}
            >
              {heading}
            </h1>
            <p
              style={{
                color: "#B0B0B0",
                lineHeight: "1.7",
                marginBottom: "2rem",
              }}
            >
              {description}
            </p>
            {learnItems && learnItems.length > 0 && (
              <>
                <p style={{ color: "#00BFA6", fontWeight: "600" }}>
                  You&apos;ll learn how to:
                </p>
                <ul style={{ listStyle: "none", padding: "0", marginTop: "1rem" }}>
                  {learnItems.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        color: "#B0B0B0",
                        marginBottom: "0.75rem",
                        paddingLeft: "1.5rem",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "0",
                          color: "#00BFA6",
                        }}
                      >
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div
            style={{
              flex: "0 0 450px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "12px",
              padding: "2rem",
              minWidth: "300px",
            }}
          >
            <div id="hubspot-form">
              <p style={{ color: "#B0B0B0", textAlign: "center" }}>
                Loading form...
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
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

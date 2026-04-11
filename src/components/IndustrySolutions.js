import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const SOLUTION_ICONS = {
  "Financial Services": "/img/features/icon-financial.svg",
  Healthcare: "/img/features/icon-healthcare.svg",
  Retail: "/img/features/icon-retail.svg",
  Government: "/img/features/icon-government.svg",
};

const SOLUTION_HEADINGS = {
  "Financial Services": "Prevent unauthorized trades in high-speed markets",
  Healthcare: "Protect patient data with human-in-the-loop controls",
  Retail: "Secure AI-driven purchasing and inventory workflows",
  Government: "Prevent unauthorized actions in high-stakes operations",
};

const SOLUTION_LINKS = {
  "Financial Services":
    "https://www.strata.io/use-cases/financial-services/",
  Healthcare: "/solutions/healthcare/",
  Retail: "https://www.strata.io/use-cases/retail/",
  Government: "https://www.strata.io/use-cases/ddil/",
};

const IndustrySolutions = ({ solutions }) => {
  if (!solutions || solutions.length === 0) return null;

  return (
    <section className="mav-solutions">
      <div className="solutions-header">
        <h2>Industry solutions</h2>
        <p>
          Maverics delivers enterprise-grade identity orchestration for every
          stage of agentic AI &mdash; securing human-to-agent, agent-to-MCP, and
          multi-agent API workflows with unified policies. Maverics brings human
          and AI agent identity together, enforces security, and powers seamless
          agentic operations.
        </p>
      </div>
      <div className="solutions-grid">
        {solutions.map((solution, index) => {
          const icon = SOLUTION_ICONS[solution.title];
          const heading = SOLUTION_HEADINGS[solution.title];
          const link = SOLUTION_LINKS[solution.title] || solution.link;
          const isExternal = link && link.startsWith("http");

          return (
            <div key={index} className="solution-card">
              <p className="icon-left-text">
                {icon && (
                  <img src={icon} alt="" width="30" height="31" />
                )}
                {solution.title}
              </p>
              <h5 style={{ fontSize: "1.25rem", lineHeight: "1.4" }}>
                {heading || solution.title}
              </h5>
              <p>{solution.description}</p>
              {link && (
                isExternal ? (
                  <a
                    className="strata-btn9"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore use case
                  </a>
                ) : (
                  <Link className="strata-btn9" to={link}>
                    Explore use case
                  </Link>
                )
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

IndustrySolutions.propTypes = {
  solutions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ),
};

export default IndustrySolutions;

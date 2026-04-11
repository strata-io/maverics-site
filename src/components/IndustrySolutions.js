import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const SOLUTION_ICONS = {
  "Financial Services": "/img/features/icon-financial.svg",
  "Healthcare": "/img/features/icon-healthcare.svg",
  "Retail": "/img/features/icon-retail.svg",
  "Government": "/img/features/icon-government.svg",
};

const IndustrySolutions = ({ solutions }) => {
  if (!solutions || solutions.length === 0) return null;

  return (
    <section className="mav-solutions">
      <div className="solutions-header">
        <h2>Industry solutions</h2>
        <p>
          Maverics delivers enterprise-grade identity orchestration for every
          stage of agentic AI — securing human-to-agent, agent-to-MCP, and
          multi-agent API workflows with unified policies.
        </p>
      </div>
      <div className="solutions-grid">
        {solutions.map((solution, index) => (
          <div key={index} className="solution-card">
            {SOLUTION_ICONS[solution.title] && (
              <img
                src={SOLUTION_ICONS[solution.title]}
                alt=""
                style={{ width: "30px", height: "30px", marginBottom: "1rem" }}
              />
            )}
            <h3>{solution.title}</h3>
            <p>{solution.description}</p>
            {solution.link && (
              <Link to={solution.link} className="solution-link">
                Explore use case &rarr;
              </Link>
            )}
          </div>
        ))}
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

import React from "react";
import PropTypes from "prop-types";

const FEATURE_ICONS = {
  "Runtime Identity Control Plane": "/img/features/icon-secure.svg",
  "Human-in-the-loop Authorization": "/img/features/icon-human.svg",
  "Deploy in the cloud or on-premises": "/img/features/icon-discovery.svg",
  "Delegated OBO Authorization": "/img/features/icon-delegated.svg",
  "Open Identity for MCP Servers": "/img/features/icon-mcp.svg",
  "JIT Agent Lifecycle": "/img/features/icon-jit.svg",
  "Agent authentication": "/img/features/icon-agent.svg",
  "Agent authorization": "/img/features/icon-jit.svg",
  "Agent observability": "/img/features/icon-observe.svg",
};

const FeaturesGrid = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <section className="mav-features">
      <div className="features-header">
        <h2>Maverics Identity Orchestration for AI Agents</h2>
        <p>
          Maverics delivers enterprise-grade identity orchestration for every
          stage of agentic AI — securing human-to-agent, agent-to-MCP, and
          multi-agent API workflows with unified policies.
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              {FEATURE_ICONS[feature.title] ? (
                <img
                  src={FEATURE_ICONS[feature.title]}
                  alt=""
                  style={{ width: "30px", height: "30px" }}
                />
              ) : (
                <span>🔹</span>
              )}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

FeaturesGrid.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default FeaturesGrid;

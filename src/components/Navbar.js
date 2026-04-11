import React, { useState } from "react";
import { Link } from "gatsby";

const Navbar = () => {
  const [active, setActive] = useState(false);

  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" title="Maverics">
            <img
              src="/img/maverics-navbar-logo.svg"
              alt="Maverics by Strata"
              style={{ maxHeight: "2.5rem" }}
            />
          </Link>
          {/* eslint-disable-next-line */}
          <a
            role="button"
            className={`navbar-burger burger ${active ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setActive(!active)}
          >
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div className={`navbar-menu ${active ? "is-active" : ""}`}>
          <div className="navbar-start">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Product</a>
              <div className="navbar-dropdown">
                <a
                  className="navbar-item"
                  href="https://www.strata.io/maverics-platform/identity-orchestration-for-ai-agents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Identity Orchestration for AI Agents
                </a>
                <Link className="navbar-item" to="/labs/agentic-ai-sandbox/">
                  Agentic Sandbox
                </Link>
              </div>
            </div>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Solutions</a>
              <div className="navbar-dropdown">
                <Link
                  className="navbar-item"
                  to="/solutions/healthcare/"
                >
                  Healthcare
                </Link>
              </div>
            </div>
            <Link className="navbar-item" to="/blog/">
              Blog
            </Link>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Strata Resources</a>
              <div className="navbar-dropdown">
                <a
                  className="navbar-item"
                  href="https://docs.strata.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
                <a
                  className="navbar-item"
                  href="https://www.strata.io/resources/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resource Center
                </a>
                <a
                  className="navbar-item"
                  href="https://www.strata.io/resources/blog/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Strata Blog
                </a>
              </div>
            </div>
            <a
              className="navbar-item"
              href="https://www.strata.io/company/"
              target="_blank"
              rel="noopener noreferrer"
            >
              About
            </a>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <Link className="navbar-cta" to="/labs/agentic-ai-sandbox/">
                Try the sandbox
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

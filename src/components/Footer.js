import React from "react";
import { Link } from "gatsby";

const Footer = () => {
  return (
    <footer className="mav-footer">
      <div className="container">
        <div className="columns" style={{ marginBottom: "2.5rem" }}>
          <div className="column">
            <img
              src="/img/footer-logo.svg"
              alt="Strata"
              style={{ height: "2rem", marginBottom: "1.5rem", display: "block" }}
            />
            <img
              src="/img/certifications.png"
              alt="Security Certifications"
              style={{ maxWidth: "240px" }}
            />
          </div>
          <div className="column has-text-right">
            <a
              href="https://www.strata.io/security-portal/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#B0B0B0",
                fontSize: "0.85rem",
                textDecoration: "underline",
              }}
            >
              View our security portal
            </a>
          </div>
        </div>
        <div className="columns is-multiline">
          <div className="column is-2 footer-column">
            <h4>Platform</h4>
            <ul>
              <li>
                <a
                  href="https://www.strata.io/maverics-platform/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maverics Platform
                </a>
              </li>
            </ul>
          </div>
          <div className="column is-2 footer-column">
            <h4>Products</h4>
            <ul>
              <li>
                <a
                  href="https://www.strata.io/maverics-platform/identity-orchestration/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Identity Orchestration
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/maverics-platform/identity-orchestration-for-ai-agents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Identity Orchestration for AI Agents
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/maverics-platform/identity-continuity/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Identity Continuity
                </a>
              </li>
            </ul>
          </div>
          <div className="column is-2 footer-column">
            <h4>Use Cases</h4>
            <ul>
              <li>
                <a
                  href="https://www.strata.io/use-cases/unify-single-sign-on/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unify Single Sign-On
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/use-cases/rationalize-idps/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rationalize IDPs
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/use-cases/build-idp-resilience/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Build IDP Resilience
                </a>
              </li>
            </ul>
          </div>
          <div className="column is-2 footer-column">
            <h4>Resources</h4>
            <ul>
              <li>
                <a
                  href="https://www.strata.io/resources/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resource Center
                </a>
              </li>
              <li>
                <Link to="/blog/">Blog</Link>
              </li>
              <li>
                <a
                  href="https://docs.strata.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/resources/faq/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="column is-2 footer-column">
            <h4>Company</h4>
            <ul>
              <li>
                <a
                  href="https://www.strata.io/company/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/company/partners/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/company/careers/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="https://www.strata.io/company/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} Strata Identity, Inc.
          </span>
          <div className="footer-legal">
            <a
              href="https://www.strata.io/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.strata.io/security-portal/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Security Portal
            </a>
            <a
              href="https://www.linkedin.com/company/strata-identity/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img
                src="/img/linkedin-icon.svg"
                alt="LinkedIn"
                style={{ width: "18px", height: "18px" }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

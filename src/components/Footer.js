import React from "react";
import { Link } from "gatsby";

const Footer = () => {
  return (
    <footer className="mav-footer">
      <div className="container">
        {/* Upper section */}
        <div className="footer-wrapper">
          <div className="footer-col1">
            <a href="https://www.strata.io/" target="_blank" rel="noopener noreferrer">
              <img src="/img/footer-logo.svg" alt="Strata" />
            </a>
            <a href="https://www.strata.io/security-portal/" target="_blank" rel="noopener noreferrer">
              <img
                src="/img/certifications.png"
                alt="Security Certifications"
                className="footer-security-logos"
              />
            </a>
            <a
              href="https://www.strata.io/security-portal/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-security-link"
            >
              View our security portal &rarr;
            </a>
          </div>

          <div className="footer-col2">
            <div className="footer-block-title">PLATFORM</div>
            <ul className="footer-menu">
              <li>
                <a href="https://www.strata.io/maverics-platform/" target="_blank" rel="noopener noreferrer">
                  Maverics Platform
                </a>
              </li>
            </ul>
            <div className="footer-block-title" style={{ paddingTop: "22px" }}>PRODUCTS</div>
            <ul className="footer-menu">
              <li>
                <a href="https://www.strata.io/maverics-platform/identity-orchestration/" target="_blank" rel="noopener noreferrer">
                  Identity Orchestration
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/maverics-platform/identity-orchestration-for-ai-agents/" target="_blank" rel="noopener noreferrer">
                  Identity Orchestration for AI Agents
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/maverics-platform/identity-continuity/" target="_blank" rel="noopener noreferrer">
                  Identity Continuity
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/maverics-platform/app-discovery/" target="_blank" rel="noopener noreferrer">
                  App Discovery
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col3">
            <div className="footer-block-title">USE CASES</div>
            <ul className="footer-menu">
              <li>
                <a href="https://www.strata.io/use-cases/unify-single-sign-on/" target="_blank" rel="noopener noreferrer">
                  Unify Single Sign-On
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/use-cases/rationalize-idps/" target="_blank" rel="noopener noreferrer">
                  Rationalize IDPs
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/use-cases/build-idp-resilience/" target="_blank" rel="noopener noreferrer">
                  Build IDP Resilience
                </a>
              </li>
            </ul>
            <div className="footer-block-title" style={{ paddingTop: "22px" }}>RECIPES</div>
            <ul className="footer-menu">
              <li>
                <a href="https://www.strata.io/recipes/" target="_blank" rel="noopener noreferrer">
                  Recipes Library
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/cookbooks/" target="_blank" rel="noopener noreferrer">
                  Cookbooks Library
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col4">
            <div className="footer-block-title">RESOURCES</div>
            <ul className="footer-menu">
              <li>
                <a href="https://www.strata.io/resources/" target="_blank" rel="noopener noreferrer">
                  Resource Center
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/resources/whitepapers/" target="_blank" rel="noopener noreferrer">
                  Whitepapers
                </a>
              </li>
              <li>
                <Link to="/blog/">Blog</Link>
              </li>
              <li>
                <a href="https://www.strata.io/media-kit/" target="_blank" rel="noopener noreferrer">
                  Media Kit
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/glossary/" target="_blank" rel="noopener noreferrer">
                  Glossary
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/resources/faq/" target="_blank" rel="noopener noreferrer">
                  FAQ
                </a>
              </li>
              <li>
                <a href="https://docs.strata.io" target="_blank" rel="noopener noreferrer">
                  Docs
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col5">
            <div className="footer-block-title">COMPANY</div>
            <ul className="footer-menu">
              <li>
                <a href="https://www.strata.io/company/" target="_blank" rel="noopener noreferrer">
                  About
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/company/partners/" target="_blank" rel="noopener noreferrer">
                  Partners
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/company/careers/" target="_blank" rel="noopener noreferrer">
                  Careers
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/company/press-room/" target="_blank" rel="noopener noreferrer">
                  Press Room
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/company/contact/" target="_blank" rel="noopener noreferrer">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower section */}
        <div className="footer-lower-wrapper">
          <div className="footer-col6">
            <span className="copyright-text">&copy; 2026 Strata Identity, Inc.</span>
            <ul className="footer-legal">
              <li>
                <a href="https://www.strata.io/privacy-policy/" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/cookiebot-declaration/" target="_blank" rel="noopener noreferrer">
                  Cookiebot Declaration
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/security-portal/" target="_blank" rel="noopener noreferrer">
                  Security Portal
                </a>
              </li>
              <li>
                <a href="https://www.strata.io/site-map/" target="_blank" rel="noopener noreferrer">
                  Site Map
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col7">
            <a
              href="https://www.linkedin.com/company/strata-identity/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img src="/img/linkedin-icon.svg" alt="LinkedIn" style={{ width: "18px", height: "18px" }} />
            </a>
          </div>

          <div className="footer-col8">
            <div className="footer-hs-newsletter">
              <div className="newsletter-input">
                <input type="email" placeholder="Email address" />
              </div>
              <div className="newsletter-submit">
                <button type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

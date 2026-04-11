import React, { useState, useEffect } from "react";
import { Link } from "gatsby";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu) => {
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav
      className={`navbar${scrolled ? " scroll-header" : ""}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link to="/" title="Maverics">
          <img
            src="/img/maverics-navbar-logo.svg"
            alt="Maverics by Strata"
          />
        </Link>
      </div>

      <ul className="navbar-nav">
        {/* Product */}
        <li
          className="nav-item"
          onMouseEnter={() => handleMouseEnter("product")}
          onMouseLeave={handleMouseLeave}
        >
          <span>
            Product <span className="nav-arrow">&#9662;</span>
          </span>
          {openDropdown === "product" && (
            <div className="mega-menu mega-menu-platform">
              <div className="mega-link-top">Product</div>
              <a
                className="menu-purple-link"
                href="https://www.strata.io/maverics-platform/identity-orchestration-for-ai-agents/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Identity Orchestration for AI Agents
                <img
                  src="/img/nav/menu-right.svg"
                  className="menu-right-icon"
                  alt=""
                />
              </a>
              <Link
                className="menu-purple-link"
                to="/labs/agentic-ai-sandbox/"
              >
                Agentic Sandbox
                <img
                  src="/img/nav/menu-right.svg"
                  className="menu-right-icon"
                  alt=""
                />
              </Link>
            </div>
          )}
        </li>

        {/* Solutions */}
        <li
          className="nav-item"
          onMouseEnter={() => handleMouseEnter("solutions")}
          onMouseLeave={handleMouseLeave}
        >
          <span>
            Solutions <span className="nav-arrow">&#9662;</span>
          </span>
          {openDropdown === "solutions" && (
            <div className="mega-menu mega-menu-solutions">
              <div className="mega-link-top">Industry Solutions</div>
              <a
                className="menu-purple-link"
                href="https://www.strata.io/solutions/financial-services/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Financial Services
                <img
                  src="/img/nav/menu-right.svg"
                  className="menu-right-icon"
                  alt=""
                />
              </a>
              <Link className="menu-purple-link" to="/solutions/healthcare/">
                Healthcare
                <img
                  src="/img/nav/menu-right.svg"
                  className="menu-right-icon"
                  alt=""
                />
              </Link>
              <a
                className="menu-purple-link"
                href="https://www.strata.io/solutions/retail/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Retail
                <img
                  src="/img/nav/menu-right.svg"
                  className="menu-right-icon"
                  alt=""
                />
              </a>
              <a
                className="menu-purple-link"
                href="https://www.strata.io/solutions/government/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Government
                <img
                  src="/img/nav/menu-right.svg"
                  className="menu-right-icon"
                  alt=""
                />
              </a>
            </div>
          )}
        </li>

        {/* Strata Resources */}
        <li
          className="nav-item"
          onMouseEnter={() => handleMouseEnter("resources")}
          onMouseLeave={handleMouseLeave}
        >
          <span>
            Strata Resources <span className="nav-arrow">&#9662;</span>
          </span>
          {openDropdown === "resources" && (
            <div className="mega-menu mega-menu-wide">
              <div className="mega-left">
                <div className="mega-link-top">Resources</div>
                <a
                  className="menu-purple-link"
                  href="https://www.strata.io/resources/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/nav/icon-resource-center.svg"
                    className="nav-icon"
                    alt=""
                  />
                  Resource Center
                  <img
                    src="/img/nav/menu-right.svg"
                    className="menu-right-icon"
                    alt=""
                  />
                </a>
                <a
                  className="menu-purple-link"
                  href="https://www.strata.io/resources/whitepapers/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/nav/icon-whitepapers.svg"
                    className="nav-icon"
                    alt=""
                  />
                  Whitepapers
                  <img
                    src="/img/nav/menu-right.svg"
                    className="menu-right-icon"
                    alt=""
                  />
                </a>
                <a
                  className="menu-purple-link"
                  href="https://www.strata.io/resources/blog/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/nav/icon-blog.svg"
                    className="nav-icon"
                    alt=""
                  />
                  Blog
                  <img
                    src="/img/nav/menu-right.svg"
                    className="menu-right-icon"
                    alt=""
                  />
                </a>
                <a
                  className="menu-purple-link"
                  href="https://www.strata.io/resources/glossary/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/nav/icon-glossary.svg"
                    className="nav-icon"
                    alt=""
                  />
                  Glossary
                  <img
                    src="/img/nav/menu-right.svg"
                    className="menu-right-icon"
                    alt=""
                  />
                </a>
                <a
                  className="menu-purple-link"
                  href="https://docs.strata.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/nav/icon-docs.svg"
                    className="nav-icon"
                    alt=""
                  />
                  Docs
                  <img
                    src="/img/nav/menu-right.svg"
                    className="menu-right-icon"
                    alt=""
                  />
                </a>
              </div>
              <div className="mega-right">
                <Link to="/labs/agentic-ai-sandbox/">
                  <img
                    src="/img/maverics-console-frame.jpg"
                    alt="Maverics Sandbox"
                  />
                </Link>
                <div className="mega-link-top" style={{ paddingLeft: 0 }}>
                  Maverics Sandbox for Agentic Identity (AI)
                </div>
                <div className="menu-purple-link-text-content">
                  Get started with identity controls for AI agents!
                </div>
              </div>
            </div>
          )}
        </li>

        {/* Blog */}
        <li className="nav-item">
          <Link to="/blog/">Blog</Link>
        </li>

        {/* About */}
        <li className="nav-item">
          <a
            href="https://www.strata.io/company/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </li>
      </ul>

      {/* CTA Button */}
      <Link className="header-button" to="/labs/agentic-ai-sandbox/">
        Try the sandbox
      </Link>

      {/* Hamburger */}
      <button
        className={`navbar-burger${mobileOpen ? " is-active" : ""}`}
        aria-label="menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar-menu-mobile">
          <a
            href="https://www.strata.io/maverics-platform/identity-orchestration-for-ai-agents/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Identity Orchestration for AI Agents
          </a>
          <Link to="/labs/agentic-ai-sandbox/">Agentic Sandbox</Link>
          <a
            href="https://www.strata.io/solutions/financial-services/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Financial Services
          </a>
          <Link to="/solutions/healthcare/">Healthcare</Link>
          <a
            href="https://www.strata.io/solutions/retail/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Retail
          </a>
          <a
            href="https://www.strata.io/solutions/government/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Government
          </a>
          <a
            href="https://www.strata.io/resources/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resource Center
          </a>
          <a
            href="https://docs.strata.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
          <Link to="/blog/">Blog</Link>
          <a
            href="https://www.strata.io/company/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

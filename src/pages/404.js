import React from "react";
import Layout from "../components/Layout";
import { Link } from "gatsby";

const NotFoundPage = () => (
  <Layout>
    <section
      style={{
        background: "#0A0A0A",
        padding: "10rem 2rem",
        textAlign: "center",
        minHeight: "60vh",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ color: "#B0B0B0", fontSize: "1.2rem", marginBottom: "2rem" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        style={{
          color: "#00BFA6",
          fontSize: "1.1rem",
          textDecoration: "none",
        }}
      >
        &larr; Back to home
      </Link>
    </section>
  </Layout>
);

export default NotFoundPage;

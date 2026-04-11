import React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import BlogRoll from "../../components/BlogRoll";

const BlogIndexPage = () => {
  return (
    <Layout>
      <SEO
        title="Blog | Insights on Identity Orchestration & AI Agent Security"
        description="Insights on agentic identity, MCP security, and enterprise identity orchestration for AI agents."
      />
      <div className="blog-listing">
        <div className="blog-listing-header">
          <h1>Blog</h1>
          <p>
            Read how to best manage distributed identity systems, multi-cloud
            identity, hybrid identity, and Identity Orchestration. Stay informed
            on the latest trends, best practices, and company updates to help you
            navigate the complexities of modern IAM systems.
          </p>
        </div>
        <BlogRoll />
      </div>
    </Layout>
  );
};

export default BlogIndexPage;

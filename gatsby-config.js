module.exports = {
  siteMetadata: {
    title: "Maverics.ai | The runtime identity control plane for AI Agents",
    description:
      "Maverics delivers enterprise-grade identity orchestration for every stage of agentic AI — securing human-to-agent, agent-to-MCP, and multi-agent API workflows with unified policies.",
    siteUrl: "https://www.maverics.ai",
    image: "/img/maverics-og.png",
    keywords: [
      "identity orchestration",
      "AI agents",
      "agentic AI",
      "MCP security",
      "identity control plane",
      "agent governance",
      "runtime identity",
      "Strata Identity",
      "Maverics",
    ],
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-sass",
      options: {
        sassOptions: {
          indentedSyntax: true,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "uploads",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/img`,
        name: "images",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 2048,
              quality: 90,
              linkImagesToOriginal: false,
              backgroundColor: "transparent",
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
          "gatsby-remark-prismjs",
        ],
      },
    },
    {
      resolve: "gatsby-plugin-decap-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: "gatsby-plugin-purgecss",
      options: {
        develop: true,
        purgeOnly: ["/bulma-style.sass"],
      },
    },
    "gatsby-plugin-netlify",
  ],
};

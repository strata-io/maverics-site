const authors = {
  "Nick Gamb": {
    name: "Nick Gamb",
    slug: "nick-gamb",
    image: "/img/authors/nick-gamb.jpg",
    title: "Head of Developer Relations",
    bio: "Developer advocate focused on agentic identity, MCP security, and enterprise identity orchestration.",
    linkedin: "https://www.linkedin.com/in/nickgamb/",
    twitter: "https://twitter.com/nickgamb",
  },
  "Sawyer Pence": {
    name: "Sawyer Pence",
    slug: "sawyer-pence",
    image: "/img/authors/sawyer-pence.jpg",
    title: "Solutions Engineer",
    bio: "Building multi-agent systems with identity-governed workflows and enterprise integration patterns.",
    linkedin: "",
    twitter: "",
  },
};

/**
 * Get author data by name.
 * Falls back to a default if the author name isn't found.
 */
export const getAuthor = (name) => {
  if (!name) return authors["Nick Gamb"];
  return (
    authors[name] ||
    Object.values(authors).find(
      (a) => a.slug === name.toLowerCase().replace(/\s+/g, "-")
    ) || {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      image: null,
      title: "",
      bio: "",
      linkedin: "",
      twitter: "",
    }
  );
};

export default authors;

import React from "react";
import PropTypes from "prop-types";

const IndexPagePreview = ({ entry }) => {
  const data = entry.getIn(["data"]).toJS();
  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem" }}>{data.heading}</h1>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>{data.description}</p>
      <hr />
      <h2>Features</h2>
      {data.features &&
        data.features.map((f, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <strong>{f.title}</strong>
            <p>{f.description}</p>
          </div>
        ))}
    </div>
  );
};

IndexPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
};

export default IndexPagePreview;

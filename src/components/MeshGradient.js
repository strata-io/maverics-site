import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const MeshGradient = () => {
  useEffect(() => {
    // Wait for minigl.js to load, then initialize
    const initGradient = () => {
      if (typeof window !== "undefined" && window.Gradient) {
        const gradient = new window.Gradient();
        gradient.initGradient("#mesh-gradient-canvas");
      }
    };

    // Check if already loaded
    if (window.Gradient) {
      initGradient();
    } else {
      // Poll for it
      const interval = setInterval(() => {
        if (window.Gradient) {
          clearInterval(interval);
          initGradient();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <Helmet>
        <script src="/js/minigl.js" type="text/javascript" />
      </Helmet>
      <canvas
        id="mesh-gradient-canvas"
        style={{
          filter: "blur(15px)",
          transform: "scale(1.3)",
          zIndex: -1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          "--gradient-color-1": "#0E3952",
          "--gradient-color-2": "#282948",
          "--gradient-color-3": "#0D172E",
          "--gradient-color-4": "#050B11",
          "--gradient-speed": "0.00001",
        }}
      />
    </>
  );
};

export default MeshGradient;

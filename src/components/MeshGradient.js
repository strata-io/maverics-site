import React, { useEffect, useRef } from "react";

const MeshGradient = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;

    // Set CSS custom properties on the canvas element
    const el = canvasRef.current;
    el.style.setProperty("--gradient-color-1", "#0E3952");
    el.style.setProperty("--gradient-color-2", "#282948");
    el.style.setProperty("--gradient-color-3", "#0D172E");
    el.style.setProperty("--gradient-color-4", "#050B11");
    el.style.setProperty("--gradient-speed", "0.00001");

    // Load minigl.js dynamically
    const script = document.createElement("script");
    script.src = "/js/minigl.js";
    script.async = false; // ensure it executes before we try to use it
    script.onload = () => {
      requestAnimationFrame(() => {
        if (window.Gradient) {
          try {
            const gradient = new window.Gradient();
            gradient.initGradient("#mesh-gradient-canvas");
          } catch (e) {
            console.warn("Mesh gradient init failed:", e);
          }
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="mesh-gradient-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        filter: "blur(15px)",
        transform: "scale(1.3)",
      }}
    />
  );
};

export default MeshGradient;

import * as React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../style/bulma-style.sass";
import "../style/custom-style.sass";

const Layout = ({ children }) => {
  return (
    <div>
      <Helmet>
        <html lang="en" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Electrolize&family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import "../../public/Layout.css";

const Layout = ({
  children,
  title = "Ecommerce-shop now",
  description = "mern project",
  keyword = "mern,react",
  author = "prabhu",
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>ShopiVerse - {title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

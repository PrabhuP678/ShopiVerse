import React from "react";
import Layout from "../components/Layout/Layout";
import { Link, BrowserRouter } from "react-router-dom";
// Ensure the CSS file is correctly imported
import "../public/PagenotFound.css";
const PagenotFound = () => {
  return (
    <Layout>
      <div className="page-not-found">
        <div className="page-not-found-content">
          <div className="error-code">404</div>
          <br></br>
          <br></br>

          <h1>Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="go-back-button">
            Go Back
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PagenotFound;

import React from "react";
import Layout from "../components/Layout/Layout";
import "../public/Policy.css";

const Policy = () => {
  return (
    <Layout title="Policy">
      <div className="policy-container">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 21, 2024</p>
        <p>
          Welcome to our Privacy Policy page! When you use our web site
          services, you trust us with your information. This Privacy Policy is
          meant to help you understand what data we collect, why we collect it,
          and what we do with it. This is important; we hope you will take time
          to read it carefully.
        </p>
        import Policy from './Policy';
        <h2>Information We Collect</h2>
        <p>
          We collect information to provide better services to all our users. We
          collect information in the following ways:
        </p>
        <ul>
          <li>
            <strong>Information you give us.</strong> For example, many of our
            services require you to sign up for an account. When you do, we’ll
            ask for personal information, like your name, email address,
            telephone number, or credit card.
          </li>
          <li>
            <strong>Information we get from your use of our services.</strong>{" "}
            We collect information about the services that you use and how you
            use them, like when you visit a website that uses our advertising
            services or you view and interact with our ads and content.
          </li>
        </ul>
        <h2>How We Use Information We Collect</h2>
        <p>
          We use the information we collect from all of our services to provide,
          maintain, protect, and improve them, to develop new ones, and to
          protect our users. We also use this information to offer you tailored
          content – like giving you more relevant search results and ads.
        </p>
        <p>
          We may use the name you provide for your profile across all of the
          services we offer that require an account. In addition, we may replace
          past names associated with your account so that you are represented
          consistently across all our services.
        </p>
        <h2>Information We Share</h2>
        <p>
          We do not share personal information with companies, organizations,
          and individuals outside of our organization unless one of the
          following circumstances applies:
        </p>
        <ul>
          <li>
            <strong>With your consent.</strong> We will share personal
            information with companies, organizations, or individuals outside of
            our organization when we have your consent to do so.
          </li>
          <li>
            <strong>For legal reasons.</strong> We will share personal
            information with companies, organizations, or individuals outside of
            our organization if we have a good-faith belief that access, use,
            preservation, or disclosure of the information is reasonably
            necessary to:
            <ul>
              <li>
                Meet any applicable law, regulation, legal process, or
                enforceable governmental request.
              </li>
              <li>
                Enforce applicable Terms of Service, including investigation of
                potential violations.
              </li>
              <li>
                Detect, prevent, or otherwise address fraud, security, or
                technical issues.
              </li>
              <li>
                Protect against harm to the rights, property, or safety of our
                organization, our users, or the public as required or permitted
                by law.
              </li>
            </ul>
          </li>
        </ul>
        <h2>Data Security</h2>
        <p>
          We work hard to protect our users from unauthorized access to or
          unauthorized alteration, disclosure, or destruction of information we
          hold. In particular:
        </p>
        <ul>
          <li>We encrypt many of our services using SSL.</li>
          <li>
            We offer you two-step verification when you access your account.
          </li>
          <li>
            We restrict access to personal information to our employees,
            contractors, and agents who need that information in order to
            process it for us and who are subject to strict contractual
            confidentiality obligations and may be disciplined or terminated if
            they fail to meet these obligations.
          </li>
        </ul>
        <h2>Changes</h2>
        <p>
          Our Privacy Policy may change from time to time. We will not reduce
          your rights under this Privacy Policy without your explicit consent.
          We will post any privacy policy changes on this page and, if the
          changes are significant, we will provide a more prominent notice
          (including, for certain services, email notification of privacy policy
          changes).
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us.
        </p>
      </div>
    </Layout>
  );
};

export default Policy;

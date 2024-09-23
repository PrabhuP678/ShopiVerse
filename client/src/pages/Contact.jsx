import React from 'react';
import Layout from '../components/Layout/Layout';
import '../public/Contact.css'
const Contact = () => {
  return (
    <Layout title='Contact'>
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>Last updated: July 21, 2024</p>

      <p>
        We value your feedback and are here to assist you with any questions or concerns you may have. Please feel free to reach out to us using any of the methods below. Our dedicated team is ready to help you.
      </p>

      <h2>General Inquiries</h2>
      <p>
        <strong>Email:</strong> info@ourcompany.com<br />
        <strong>Phone:</strong> (123) 456-7890
      </p>

      <h2>Customer Support</h2>
      <p>
        For assistance with our products and services, please contact our customer support team.
      </p>
      <p>
        <strong>Email:</strong> support@ourcompany.com<br />
        <strong>Phone:</strong> (123) 456-7891
      </p>

      <h2>Sales</h2>
      <p>
        If you are interested in our offerings and would like to learn more about our products and services, please reach out to our sales team.
      </p>
      <p>
        <strong>Email:</strong> sales@ourcompany.com<br />
        <strong>Phone:</strong> (123) 456-7892
      </p>

      <h2>Office Address</h2>
      <p>
        You can also visit us at our office:
      </p>
      <p>
        <strong>Address:</strong><br />
        123 Main Street,<br />
        Anytown, USA
      </p>

      <h2>Follow Us</h2>
      <p>
        Stay connected with us on social media for the latest updates and news:
      </p>
      <p>
        <strong>Facebook:</strong> <a href="https://facebook.com/ourcompany" target="_blank" rel="noopener noreferrer">facebook.com/ourcompany</a><br />
        <strong>Twitter:</strong> <a href="https://twitter.com/ourcompany" target="_blank" rel="noopener noreferrer">twitter.com/ourcompany</a><br />
        <strong>LinkedIn:</strong> <a href="https://linkedin.com/company/ourcompany" target="_blank" rel="noopener noreferrer">linkedin.com/company/ourcompany</a>
      </p>

      <h2>Business Hours</h2>
      <p>
        Our business hours are:
      </p>
      <p>
        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br />
        <strong>Saturday - Sunday:</strong> Closed
      </p>
    </div>
    </Layout>
  );
}

export default Contact;

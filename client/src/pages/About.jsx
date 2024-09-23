import React from 'react';
import Layout from '../components/Layout/Layout';
import '../public/About.css'
const About = () => {
  return (
    <Layout title='About'>
    <div className="about-container">
      <h1>About Us</h1>
      <p>Last updated: July 21, 2024</p>

      <p>
        Welcome to our company! We are dedicated to delivering the best services and products to our valued customers. Our journey began with a simple idea to make a difference in the industry and provide top-notch solutions that meet the evolving needs of our clients.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to provide exceptional value to our customers through innovative products, outstanding customer service, and a commitment to quality. We strive to exceed expectations and be a leader in our industry.
      </p>

      <h2>Our Vision</h2>
      <p>
        We envision a world where our solutions make a significant impact on the lives of our customers. We aim to be a trusted partner and an integral part of our customers' success by consistently delivering excellence.
      </p>

      <h2>Our Values</h2>
      <ul>
        <li><strong>Customer Focus:</strong> We prioritize our customers' needs and work tirelessly to meet and exceed their expectations.</li>
        <li><strong>Innovation:</strong> We embrace creativity and strive for continuous improvement to stay ahead in our field.</li>
        <li><strong>Integrity:</strong> We conduct our business with the highest ethical standards and transparency.</li>
        <li><strong>Quality:</strong> We are committed to delivering superior quality in everything we do.</li>
        <li><strong>Teamwork:</strong> We believe in the power of collaboration and work together to achieve common goals.</li>
      </ul>

      <h2>Our History</h2>
      <p>
        Founded in [Year], our company has grown from a small startup to a respected name in the industry. Over the years, we have expanded our offerings and continuously evolved to meet the changing demands of the market. Our success is built on a foundation of hard work, dedication, and a passion for excellence.
      </p>

      <h2>Meet Our Team</h2>
      <p>
        Our team is composed of talented professionals who are experts in their respective fields. We are proud of our diverse and inclusive work environment, where everyone is encouraged to contribute their unique perspectives and ideas. Together, we work towards a common goal of achieving greatness and making a positive impact.
      </p>

      <h2>Contact Us</h2>
      <p>
        We love to hear from our customers and partners. If you have any questions, feedback, or inquiries, please do not hesitate to reach out to us. You can contact us at:
      </p>
      <p>
        <strong>Email:</strong> contact@ourcompany.com<br />
        <strong>Phone:</strong> (123) 456-7890<br />
        <strong>Address:</strong> 123 Main Street, Anytown, USA
      </p>
    </div>
    </Layout>
  );
}

export default About;

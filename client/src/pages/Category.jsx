import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spin, message, Card, Row, Col } from "antd";
import "../public/CategoryPage.css"; // Ensure this file exists and is correctly styled
import Layout from "../components/Layout/Layout.jsx"; // Corrected import path
const API_URL = process.env.REACT_APP_API;

const { Meta } = Card;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/category/get-category`
        );
        if (data.success) {
          setCategories(data.data);
        } else {
          message.error("Failed to fetch categories");
        }
      } catch (error) {
        message.error("Error fetching categories");
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <Layout title=" Category">
      <div className="categories-page">
        <h1>Categories</h1>
        {loading ? (
          <Spin tip="Loading..." />
        ) : categories.length > 0 ? (
          <Row gutter={[16, 16]}>
            {categories.map((category) => (
              <Col key={category._id} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  hoverable
                  onClick={() => handleCategoryClick(category.slug)}
                  className="category-card"
                >
                  <Meta title={category.name} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;

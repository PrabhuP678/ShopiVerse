import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  message,
  Spin,
  Button,
  Input,
  Rate,
  Card,
  Pagination,
  Row,
  Col,
} from "antd";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/CartContext";
import "../public/Details.css";

const { TextArea } = Input;

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newReview, setNewReview] = useState({
    title: "",
    reason: "",
    rating: 0,
  });
  const [editingReview, setEditingReview] = useState(null);
  const { addToCart } = useCart();
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/products/product/slug/${slug}`
        );
        if (data.success) {
          setProduct(data.product);
          fetchReviews(data.product._id);
        } else {
          message.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        message.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const fetchReviews = async (productId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/products/get-reviews/${productId}?page=${reviewPage}&limit=5`
      );
      if (data.success) {
        setReviews(data.reviews);
        setTotalReviews(data.totalReviews);
      } else {
        message.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      message.error("Error fetching reviews");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      message.success("Product added to cart");
    }
  };

  const handlePageChange = (page) => {
    setReviewPage(page);
    if (product) fetchReviews(product._id);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setNewReview((prevReview) => ({ ...prevReview, rating: value }));
  };

  const submitReview = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${API_URL}/api/v1/products/create-review`,
        {
          ...newReview,
          product: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response;

      if (data.success) {
        message.success("Review added successfully");
        setNewReview({ title: "", reason: "", rating: 0 });
        fetchReviews(product._id);
      } else {
        message.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Error submitting review");
    }
  };

  const startEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      title: review.title,
      reason: review.reason,
      rating: review.rating,
    });
  };

  const cancelEditReview = () => {
    setEditingReview(null);
    setNewReview({ title: "", reason: "", rating: 0 });
  };

  const updateReview = async () => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/products/update-review/${editingReview._id}`,
        {
          title: newReview.title,
          reason: newReview.reason,
          rating: newReview.rating,
        }
      );
      if (data.success) {
        message.success("Review updated successfully");
        setEditingReview(null);
        setNewReview({ title: "", reason: "", rating: 0 });
        fetchReviews(product._id);
      } else {
        message.error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      message.error("Error updating review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/reviews/delete-review/${reviewId}`
      );
      if (data.success) {
        message.success("Review deleted successfully");
        fetchReviews(product._id);
      } else {
        message.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Error deleting review");
    }
  };

  return (
    <Layout>
      {loading ? (
        <Spin tip="Loading..." />
      ) : product ? (
        <div className="product-details">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="product-image-container">
                <img
                  src={`${API_URL}/api/v1/products/product-photo/${product._id}`}
                  alt={product.name}
                  className="product-image"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: ${product.price}</p>
                <div className="product-actions">
                  <Button type="primary" onClick={handleAddToCart} size="large">
                    Add to Cart
                  </Button>
                  <Button
                    type="danger"
                    onClick={() =>
                      navigate("/checkout", { state: { product } })
                    }
                    size="large"
                    style={{ marginLeft: "10px" }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          <div className="product-reviews">
            <h2>Reviews</h2>
            <div className="review-form">
              <h3>{editingReview ? "Edit Your Review" : "Leave a Review"}</h3>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Review Title"
                    name="title"
                    value={newReview.title}
                    onChange={handleReviewChange}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <TextArea
                    placeholder="Review Reason"
                    name="reason"
                    value={newReview.reason}
                    onChange={handleReviewChange}
                    rows={3}
                  />
                </Col>
                <Col xs={24} md={4}>
                  <Rate
                    value={newReview.rating}
                    onChange={handleRatingChange}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: "10px" }}>
                {editingReview ? (
                  <Button
                    type="primary"
                    onClick={updateReview}
                    style={{ marginRight: "10px" }}
                  >
                    Update Review
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={submitReview}
                    style={{ marginRight: "10px" }}
                  >
                    Submit Review
                  </Button>
                )}
                {editingReview && (
                  <Button type="default" onClick={cancelEditReview}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <Card key={review._id} style={{ marginBottom: "10px" }}>
                    <Card.Meta
                      title={review.title}
                      description={
                        <>
                          <p>{review.reason}</p>
                          <Rate disabled value={review.rating} />
                          <Button
                            type="link"
                            onClick={() => startEditReview(review)}
                            style={{ marginRight: "10px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="link"
                            onClick={() => deleteReview(review._id)}
                            style={{ color: "red" }}
                          >
                            Delete
                          </Button>
                        </>
                      }
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
            <Pagination
              current={reviewPage}
              total={totalReviews}
              pageSize={5}
              onChange={handlePageChange}
              style={{ textAlign: "center", marginTop: "20px" }}
            />
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </Layout>
  );
};

export default ProductDetails;

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ReviewContext = createContext();

export const useReviews = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async (productId) => {
    try {
      const { data } = await axios.get("/api/v1/reviews/get-review", {
        params: { productId },
      });
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const addReview = async (review) => {
    try {
      const { data } = await axios.post(
        "/api/v1/reviews/create-review",
        review
      );
      setReviews((prevReviews) => [...prevReviews, data.review]);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, fetchReviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

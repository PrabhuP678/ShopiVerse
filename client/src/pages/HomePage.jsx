import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { message, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCart } from "../context/CartContext";
import "../public/HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { cartItems } = useCart();
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/v1/products/get-product?page=${currentPage}&limit=10`;
      const response = await axios.get(url);
      if (response.data.success) {
        setProducts((prevProducts) => {
          const newProducts = response.data.products;
          const uniqueProducts = [
            ...prevProducts,
            ...newProducts.filter(
              (product) => !prevProducts.some((p) => p._id === product._id)
            ),
          ];
          return uniqueProducts;
        });
        setHasMore(response.data.products.length === 10);
      } else {
        message.error("Failed to fetch products");
        setHasMore(false);
      }
    } catch (error) {
      message.error("Error fetching products");
      setHasMore(false);
    }
    setLoading(false);
  };

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Layout title="All Products" cartCount={cartCount}>
      <div className="home-page-container">
        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="products-grid">
            {loading && products.length === 0 ? (
              <Spin tip="Loading..." />
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="card">
                  <img
                    src={`${API_URL}/api/v1/products/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <Link
                      to={`/product/${product.slug}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </Layout>
  );
};

export default HomePage;

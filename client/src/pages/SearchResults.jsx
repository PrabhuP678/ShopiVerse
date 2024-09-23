import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { message, Spin } from "antd";
import Layout from "../components/Layout/Layout.jsx";
import FilterComponent from "./FilterComponent";
import "../public/SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]); // All products fetched based on search query
  const [filteredProducts, setFilteredProducts] = useState([]); // Products after applying filters
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const query = new URLSearchParams(useLocation().search).get("query");
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `${API_URL}/api/v1/products/get-product?search=${query}`;
        console.log("Fetching URL:", url); // Debug URL
        const { data } = await axios.get(url);
        console.log("API response:", data); // Debug API response
        if (data.success) {
          setProducts(data.products);
          setFilteredProducts(data.products); // Set initial products
        } else {
          message.error("Failed to fetch products");
        }
      } catch (error) {
        message.error(`Error fetching products: ${error.message}`);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, API_URL]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products]; // Start with all products

      if (filters.priceRange) {
        filtered = filtered.filter(
          (product) =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );
      }

      if (filters.rating) {
        filtered = filtered.filter(
          (product) =>
            product.rating >= filters.rating[0] &&
            product.rating <= filters.rating[1]
        );
      }

      if (filters.category) {
        filtered = filtered.filter(
          (product) => product.category === filters.category
        );
      }

      // If no products match the filters, show all products
      if (filtered.length === 0) {
        filtered = [...products]; // Reset to all products
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [filters, products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Layout title={`Search Results for "${query}"`}>
      <div className="search-results-container">
        <h2 className="text-center">Search Results</h2>
        <div className="d-flex">
          <div className="filter-container">
            <FilterComponent onFilter={handleFilterChange} />
          </div>
          <div className="results-container flex-grow-1">
            {loading ? (
              <Spin tip="Loading..." />
            ) : filteredProducts.length > 0 ? (
              <div className="d-flex flex-wrap justify-content-center">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="card m-2"
                    style={{ width: "18rem" }}
                  >
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
                ))}
              </div>
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;

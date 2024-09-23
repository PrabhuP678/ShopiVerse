import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout.jsx"; // Ensure correct import
import "../../public/CategoryProducts.css"; // Ensure correct path for CSS

const API_URL = process.env.REACT_APP_API;

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${API_URL}/api/v1/category/${slug}`;
        console.log("Fetching URL:", url); // Debug URL
        const { data } = await axios.get(url);
        console.log("API response:", data); // Debug API response
        if (data.success) {
          setProducts(data.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        setError(`Error fetching products: ${error.message}`);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <div className="d-flex flex-wrap justify-content-center">
          {products.length > 0 ? (
            products.map((product) => (
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
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProducts;

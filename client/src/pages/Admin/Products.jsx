import React, { useEffect, useState } from "react";
import Adminmenu from "./../../components/Layout/Adminmenu";
import { Layout, message, Popconfirm } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../public/Products.css"; // Import the CSS file
import CustomLayout from "../../components/Layout/Layout";
const { Content } = Layout;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API;

  // Fetch all products
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/products/get-product`
      );
      if (data && data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        message.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Error fetching products");
    }
    setLoading(false);
  };

  // Handle editing a product
  const handleEdit = (id) => {
    console.log(`Editing product with ID: ${id}`); // Debugging log
    navigate(`/dashboard/admin/update-product/${id}`);
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    console.log(`Deleting product with ID: ${id}`); // Debugging log
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/products/delete-product/${id}`
      );
      if (data.success) {
        message.success("Product deleted successfully");
        getAllProducts(); // Refresh the product list
      } else {
        message.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Error deleting product");
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <CustomLayout style={{ minHeight: "100vh" }} className="products-layout">
      <Adminmenu className="admin-menu" />
      <Layout className="products-content-layout">
        <Content className="products-content">
          <div className="products-container">
            <h1>Products</h1>
            {loading ? (
              <div className="loading-spinner">Loading...</div> // Replace with an actual spinner if needed
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <div
                    className="product-card"
                    style={{ width: "18rem" }}
                    key={p._id}
                  >
                    <img
                      src={`${API_URL}/api/v1/products/product-photo/${p._id}`}
                      className="product-card-img"
                      alt={p.name}
                    />
                    <div className="product-card-body">
                      <h5 className="product-card-title">{p.name}</h5>
                      <p className="product-card-text">{p.description}</p>
                      <Link
                        to={`/dashboard/admin/update-product/${p._id}`}
                        className="btn btn-primary"
                      >
                        Edit
                      </Link>
                      <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(p._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="btn btn-danger ms-2">Delete</button>
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </CustomLayout>
  );
};

export default Products;

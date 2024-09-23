import React, { useState, useEffect } from "react";
import { Layout, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import CustomLayout from "../../components/Layout/Layout";
const { Content } = Layout;

const UpdateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    shipping: "",
  });
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { productId } = useParams();
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/category/get-category`
        );
        if (data.success) {
          setCategories(data.data);
        } else {
          message.error(data.message || "Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/products/get-product/${productId}`
        );
        if (data.success) {
          if (data.product) {
            const product = data.product;
            setFormData({
              name: product.name || "",
              slug: product.slug || "",
              description: product.description || "",
              price: product.price || "",
              category: product.category ? product.category._id : "",
              quantity: product.quantity || "",
              shipping: product.shipping ? product.shipping.toString() : "",
            });
            setPhoto(product.photo || null); // Adjust if product.photo is a URL
          } else {
            message.error("Product not found");
          }
        } else {
          message.error(data.message || "Failed to fetch product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        message.error("Error fetching product data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (productId) fetchProduct();
  }, [API_URL, productId]); // Dependency array now includes productId

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setPhoto(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) =>
      formDataToSend.append(key, formData[key])
    );
    if (photo) formDataToSend.append("photo", photo);

    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/products/update-product/${productId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        message.success("Product updated successfully");
        navigate("/dashboard/admin/products");
      } else {
        message.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomLayout>
      <Content style={{ padding: "24px" }}>
        <div className="container mt-5">
          <Toaster />
          <h1 className="text-center mb-4">Update Product</h1>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="inputName" className="form-label">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                id="inputName"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputDescription" className="form-label">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                id="inputDescription"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputPrice" className="form-label">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                id="inputPrice"
                required
                min="0"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCategory" className="form-label">
                Category:
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                id="inputCategory"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputQuantity" className="form-label">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="form-control"
                id="inputQuantity"
                required
                min="0"
              />
            </div>
            <div className="col-md-6">
              {photo && (
                <div className="text-center mb-3">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Product Preview"
                    className="img-fluid"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}
              <label htmlFor="inputPhoto" className="form-label">
                Photo:
              </label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="form-control"
                id="inputPhoto"
                accept="image/*"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputShipping" className="form-label">
                Shipping:
              </label>
              <select
                name="shipping"
                value={formData.shipping}
                onChange={handleChange}
                className="form-select"
                id="inputShipping"
                required
              >
                <option value="">Select shipping option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </Content>
    </CustomLayout>
  );
};

export default UpdateProduct;

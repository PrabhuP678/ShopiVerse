import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import toast, { Toaster } from "react-hot-toast";
import Adminmenu from "../../components/Layout/Adminmenu";
import "../../public/CreateProduct.css"; // Import the CSS file

const CreateProduct = () => {
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

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.REACT_APP_API;
        const { data } = await axios.get(
          `${API_URL}/api/v1/category/get-category`
        );
        if (data.success) {
          setCategories(data.data);
        } else {
          toast.error(data.message || "Failed to fetch categories");
        }
      } catch (error) {
        toast.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setPhoto(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.quantity ||
      !formData.category ||
      !photo
    ) {
      toast.error("Please fill in all required fields and upload a photo");
      return;
    }

    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    form.append("photo", photo);

    try {
      const API_URL = process.env.REACT_APP_API;
      const { data } = await axios.post(
        `${API_URL}/api/v1/products/create-product`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Product created successfully!");
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: "",
          category: "",
          quantity: "",
          shipping: "",
        });
        setPhoto(null);
      } else {
        toast.error(data.message || "Failed to create product");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Error creating product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard - Create Product">
      <div className="create-product-container">
        <div className="admin-panel">
          <Adminmenu />
        </div>
        <div className="form-container">
          <Toaster />
          <h1 className="text-center mb-4">Create Product</h1>
          <div className="form-card">
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="inputName">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  id="inputName"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="inputDescription">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  id="inputDescription"
                  placeholder="Enter product description"
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inputPrice">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                  id="inputPrice"
                  placeholder="Enter price"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inputCategory">Category</label>
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

              <div className="form-group">
                <label htmlFor="inputQuantity">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-control"
                  id="inputQuantity"
                  placeholder="Enter quantity"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inputPhoto">Product Photo</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="form-control"
                  id="inputPhoto"
                  accept="image/*"
                  required
                />
                {photo && (
                  <div className="mt-3 text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Product Preview"
                      className="img-preview"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="inputShipping">Shipping</label>
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

              <div className="form-group">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;

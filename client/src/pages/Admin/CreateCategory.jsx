import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import "../../public/createCategory.css"; // Import the CSS file
import Layout from "../../components/Layout/Layout";
import Adminmenu from "../../components/Layout/Adminmenu";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd"; // Properly use Modal from antd

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // For editing
  const [editName, setEditName] = useState(""); // Name for the category being edited

  const API_URL = process.env.REACT_APP_API;

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/category/get-category`
      );
      if (data.success) {
        setCategories(data.data); // Correct property for categories
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/category/create-category`,
        { name }
      );
      if (response.data.success) {
        toast.success("Category created successfully");
        setName("");
        getAllCategory(); // Refresh the category list
      } else {
        toast.error(response.data.message || "Failed to create category");
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditName(category.name); // Set the initial value of the edit form
    setVisible(true);
  };

  const handleUpdate = async () => {
    if (!currentCategory || !editName.trim()) {
      toast.error("Invalid category or name");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/category/update-category/${currentCategory._id}`,
        { name: editName }
      );
      if (response.data.success) {
        toast.success("Category updated successfully");
        setVisible(false);
        getAllCategory(); // Refresh the category list
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/category/delete-category/${id}`
      );
      if (response.data.success) {
        toast.success("Category deleted successfully");
        getAllCategory(); // Refresh the category list
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <Adminmenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div>
              <CategoryForm onCategoryCreated={getAllCategory} />
            </div>
            <div className="mt-5">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => handleEdit(c)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Modal
                title="Edit Category"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                >
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Update
                  </button>
                </form>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;

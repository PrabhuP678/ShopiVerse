import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CategoryForm = ({ onCategoryCreated }) => {
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API;
      const response = await axios.post(
        `${API_URL}/api/v1/category/create-category`,
        { name: value }
      );

      if (response.data.success) {
        toast.success("Category created successfully");
        setValue("");
        if (onCategoryCreated) {
          onCategoryCreated();
        }
      } else {
        throw new Error(response.data.message || "Failed to create category");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;

import React, { useState, useEffect } from "react";
import { Select, Slider, InputNumber, Form, Button } from "antd";
import axios from "axios";

const { Option } = Select;

const FilterComponent = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rating, setRating] = useState([0, 5]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/category/get-category`
        );
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_URL]);

  const handleFilterChange = () => {
    // Provide default values if filters are not applied
    const normalizedPriceRange =
      priceRange[0] === 0 && priceRange[1] === 1000 ? null : priceRange;
    const normalizedRating = rating[0] === 0 && rating[1] === 5 ? null : rating;

    onFilter({
      priceRange: normalizedPriceRange,
      rating: normalizedRating,
      category: selectedCategory,
    });
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setRating([0, 5]);
    setSelectedCategory(null);
    onFilter({ priceRange: null, rating: null, category: null }); // Send null or default to reset filters
  };

  return (
    <div className="filter-component">
      <Form layout="vertical">
        <Form.Item label="Category">
          <Select
            placeholder="Select a category"
            onChange={(value) => setSelectedCategory(value)}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Price Range">
          <Slider
            range
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onChange={(value) => setPriceRange(value)}
            tipFormatter={(value) => `$${value}`}
          />
          <div className="price-range">
            <InputNumber
              min={0}
              max={1000}
              value={priceRange[0]}
              onChange={(value) => setPriceRange([value, priceRange[1]])}
            />
            <span> - </span>
            <InputNumber
              min={0}
              max={1000}
              value={priceRange[1]}
              onChange={(value) => setPriceRange([priceRange[0], value])}
            />
          </div>
        </Form.Item>

        <Form.Item label="Ratings">
          <Slider
            range
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(value) => setRating(value)}
            tipFormatter={(value) => `${value} stars`}
          />
          <div className="rating-range">
            <InputNumber
              min={0}
              max={5}
              step={0.1}
              value={rating[0]}
              onChange={(value) => setRating([value, rating[1]])}
            />
            <span> - </span>
            <InputNumber
              min={0}
              max={5}
              step={0.1}
              value={rating[1]}
              onChange={(value) => setRating([rating[0], value])}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleFilterChange}>
            Apply Filters
          </Button>
          <Button onClick={handleResetFilters} style={{ marginLeft: "10px" }}>
            Reset Filters
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterComponent;

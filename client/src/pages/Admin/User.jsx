import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, message } from "antd";
import CustomLayout from "../../components/Layout/Layout"; // Rename import to avoid conflict

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        const { data } = await axios.get(`${API_URL}/api/v1/user/admin/users`, {
          //   headers: {
          //     Authorization: `Bearer ${token}`, // Assuming your backend requires authentication
          //   },
        });
        console.log("Fetched Users:", data); // Inspect the response data
        if (data.success) {
          setUsers(data.users);
        } else {
          message.error("Failed to fetch users");
        }
      } catch (error) {
        message.error(
          `Error fetching users: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_URL]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (role === 1 ? "Admin" : "User"), // Assuming '1' is for admin
    },
  ];

  return (
    <CustomLayout>
      <div style={{ padding: "20px" }}>
        <h2>All Users</h2>
        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id" // Assuming MongoDB's _id is used as the unique key
            pagination={{ pageSize: 10 }} // Added pagination for better UX
          />
        )}
      </div>
    </CustomLayout>
  );
}

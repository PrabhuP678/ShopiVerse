import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Button, Input, Spin } from "antd";
import "../../public/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/api/v1/user/profile`);
        if (data.success) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
        } else {
          message.error("Failed to fetch user profile");
        }
      } catch (error) {
        message.error(`Error fetching profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [API_URL]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_URL}/api/v1/user/profile`, {
        name,
        email,
        phone,
        address,
      });
      if (data.success) {
        setUser(data.user);
        setEditing(false);
        message.success("Profile updated successfully");
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      message.error(`Error updating profile: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
            placeholder="Name"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
            placeholder="Email"
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
            placeholder="Phone"
          />
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={!editing}
            placeholder="Address"
          />
          <div className="profile-buttons">
            <Button onClick={() => setEditing(!editing)} type="default">
              {editing ? "Cancel" : "Edit"}
            </Button>
            {editing && (
              <Button onClick={handleSave} type="primary">
                Save
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

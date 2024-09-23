import React from "react";
import { NavLink } from "react-router-dom";

const Usermenu = () => {
  return (
    <div className="list-group">
      <h1>Admin Panel</h1>
      <NavLink
        to="/dashboard/user/profile"
        className="list-group-item list-group-item-action active"
        aria-current="true"
      >
        Profile
      </NavLink>
      <NavLink
        to="/dashboard/user/orders"
        className="list-group-item list-group-item-action"
      >
        Order
      </NavLink>
    </div>
  );
};

export default Usermenu;

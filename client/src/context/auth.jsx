import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Ensure the path is correct

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const { clearCart } = useCart(); // Get the clearCart function from the cart context

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = auth?.token
      ? `Bearer ${auth.token}`
      : "";
  }, [auth]);

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, []);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    axios.defaults.headers.common["Authorization"] = "";
    clearCart(); // Clear the cart on logout
  };

  return (
    <AuthContext.Provider value={[auth, setAuth, handleLogout]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };

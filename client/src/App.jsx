import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PagenotFound from "./pages/PagenotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import AdminRoute from "./components/Routes/Admin";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import ProductDetails from "./pages/Details";
import SearchResults from "./pages/SearchResults";
import CartPage from "./pages/Cart";
import CategoryProducts from "./components/Layout/CategoryProduct";
import Profile from "./pages/user/Profile";
import CategoriesPage from "./pages/Category";
import OrderPage from "./pages/user/OrdersPage";
import AllUsers from "./pages/Admin/User";
import CheckoutPage from "./pages/Checkout";
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:slug" element={<CategoryProducts />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/product/:slug" element={<ProductDetails />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />

      {/* User Dashboard Routes */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/dashboard/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="create-category" element={<CreateCategory />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="products" element={<Products />} />
        <Route
          path="update-product/:productId"
          element={<UpdateProduct />}
        />{" "}
        {/* Use productId */}
        <Route path="users" element={<AllUsers />} />
      </Route>

      {/* Catch-all Route for 404 */}
      <Route path="*" element={<PagenotFound />} />
    </Routes>
  );
}

export default App;

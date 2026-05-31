import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Cart from "./pages/Cart";
import Offers from "./pages/Offers";
import Wishlist from "./pages/Wishlist";
import CustomerCare from "./pages/CustomerCare";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import ScrollToTop from "./components/ScrollToTop";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import AdminPanel from "./pages/AdminPanel";
import BrandPage from "./pages/BrandPage"; 
import NotFound from "./pages/NotFound";

function App() {
  return (
  <ToastProvider> 
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <ScrollToTop /> 
          <div style={{ backgroundColor: "var(--beige)", minHeight: "100vh" }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:gender/:category" element={<Products />} />
              <Route path="/support" element={<CustomerCare />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/brand/:brand" element={<BrandPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </ToastProvider>
  );
}

export default App;
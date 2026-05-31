import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { products as localProducts } from "../data/products";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import API_URL from "../api";
import {
  LayoutDashboard, Package, ShoppingBag, Plus,
  Truck, CheckCircle, Clock, X, Edit2, Trash2,
  TrendingUp, Users, IndianRupee, ArrowRight,
  Save, AlertCircle, ChevronDown, Search
} from "lucide-react";

const ADMIN_EMAIL = "admin@stylenest.in";

const STATUS_FLOW = {
  "Processing":       { next: "Confirmed",        color: "bg-yellow-100 text-yellow-700",  icon: Clock         },
  "Confirmed":        { next: "Shipped",           color: "bg-blue-100 text-blue-700",      icon: Package       },
  "Shipped":          { next: "Out for Delivery",  color: "bg-purple-100 text-purple-700",  icon: Truck         },
  "Out for Delivery": { next: "Delivered",         color: "bg-orange-100 text-orange-700",  icon: Truck         },
  "Delivered":        { next: null,                color: "bg-green-100 text-green-700",    icon: CheckCircle   },
  "Cancelled":        { next: null,                color: "bg-red-100 text-red-700",        icon: X             },
};


export default function AdminPanel() {
  const { user, token } = useContext(AuthContext);
  const navigate        = useNavigate();

  const [activeTab,    setActiveTab]    = useState("dashboard");
  const [orders,       setOrders]       = useState([]);
  const [products,     setProducts]     = useState(localProducts);
  const [loading,      setLoading]      = useState(false);
  const [searchOrder,  setSearchOrder]  = useState("");
  const [searchProd,   setSearchProd]   = useState("");
  const [showAddForm,  setShowAddForm]  = useState(false);
  const [editProduct,  setEditProduct]  = useState(null);
  const [toast,        setToast]        = useState(null);

  const [form, setForm] = useState({
    name: "", price: "", originalPrice: "", image: "",
    category: "", gender: "men", rating: "4.0",
    reviews: "0", sizes: "S,M,L,XL", isOffer: false,
  });

  // ── ACCESS CHECK ──
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center gap-4">
        <AlertCircle size={60} className="text-red-400" />
        <h2 className="text-2xl font-black text-[#2F4156]">Login Required</h2>
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-[#2F4156] text-white rounded-full font-semibold">
          Go to Login
        </button>
      </div>
    );
  }



  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center gap-4">
        <AlertCircle size={60} className="text-red-400" />
        <h2 className="text-2xl font-black text-[#2F4156]">Access Denied</h2>
        <p className="text-gray-400">You are not authorized to view this page.</p>
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-[#2F4156] text-white rounded-full font-semibold">
          Go Home
        </button>
      </div>
    );
  }

  // ── FETCH ORDERS ──
const fetchOrders = async () => {
  setLoading(true);
  try {
    const res  = await fetch(`${API_URL}/api/orders/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Response check karo
    if (!res.ok) {
      const err = await res.json();
      console.log("Error:", err.message);
      throw new Error(err.message);
    }

    const data = await res.json();
    setOrders(data.orders || []);

  } catch (err) {
    console.log("Fetch failed:", err.message);
    // Demo data fallback
    setOrders([
      {
        _id: "22A7F010DEMO",
        user: { name: "Akash" },
        items: [{ name: "Formal White Shirt", quantity: 2, image: "/products/formal4.jpg" }],
        finalAmount: 10555,
        discount: 2639,
        status: "Processing",
        createdAt: new Date(),
        address: { city: "Ahmedabad", state: "Gujarat" },
        paymentMethod: "Cash on Delivery",
      },
    ]);
  }
  setLoading(false);
};

  useEffect(() => { fetchOrders(); }, []);

  // ── UPDATE ORDER STATUS ──
 const updateStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`${API_URL}/api/orders/status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const err = await res.json();
      showToastMsg(err.message, "error");
      return;
    }

    // ✅ Frontend bhi update karo
    setOrders((prev) =>
      prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
    );
    showToastMsg(`Order status updated to ${newStatus}!`, "success");

  } catch {
    showToastMsg("Backend error! Status locally updated.", "error");
    // Local update anyway
    setOrders((prev) =>
      prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
    );
  }
};

  // ── PRODUCT FUNCTIONS ──
  const handleAddProduct = () => {
    if (!form.name || !form.price || !form.category || !form.image) {
      showToastMsg("Please fill all required fields!", "error");
      return;
    }
    const newProduct = {
      id:            Date.now(),
      name:          form.name,
      price:         Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      image:         form.image,
      category:      form.category,
      gender:        form.gender,
      rating:        Number(form.rating),
      reviews:       Number(form.reviews),
      sizes:         form.sizes.split(",").map((s) => s.trim()),
      isOffer:       form.isOffer,
    };

    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...newProduct, id: editProduct.id } : p));
      showToastMsg("Product updated successfully!", "success");
      setEditProduct(null);
    } else {
      setProducts((prev) => [newProduct, ...prev]);
      showToastMsg("Product added successfully!", "success");
    }
    setShowAddForm(false);
    resetForm();
  };

  const handleEditProduct = (p) => {
    setForm({
      name:          p.name,
      price:         String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      image:         p.image,
      category:      p.category,
      gender:        p.gender,
      rating:        String(p.rating),
      reviews:       String(p.reviews),
      sizes:         p.sizes?.join(",") || "",
      isOffer:       p.isOffer || false,
    });
    setEditProduct(p);
    setShowAddForm(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToastMsg("Product deleted!", "error");
  };

  const resetForm = () => {
    setForm({ name: "", price: "", originalPrice: "", image: "", category: "", gender: "men", rating: "4.0", reviews: "0", sizes: "S,M,L,XL", isOffer: false });
  };

  // ── TOAST ──
  const showToastMsg = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── STATS ──
  const totalSales    = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
  const totalOrders   = orders.length;
  const delivered     = orders.filter((o) => o.status === "Delivered").length;
  const processing    = orders.filter((o) => o.status === "Processing").length;

  const filteredOrders   = orders.filter((o) =>
    o._id?.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchOrder.toLowerCase())
  );
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProd.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProd.toLowerCase())
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders",    label: "Orders",    icon: ShoppingBag      },
    { id: "products",  label: "Products",  icon: Package          },
  ];

  const categories = ["t-shirts","shirts","jeans","track-pants","formal-wear","hoodies","dresses","tops","skirts","ethnic-wear"];

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* HEADER */}
      <div className="bg-[#2F4156] px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[#c8d9e6] text-xs font-medium uppercase tracking-widest">
            StyleNest
          </p>
          <h1 className="text-white font-black text-2xl">Admin Panel</h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
        >
          View Site <ArrowRight size={14} />
        </button>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-[#e8eef2] px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#2F4156] text-[#2F4156]"
                  : "border-transparent text-gray-400 hover:text-[#3e566e]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

    <div className="px-6 py-8 max-w-7xl mx-auto">

  {loading && <Spinner text="Loading admin panel..." />}

  {!loading && (
    <AnimatePresence mode="wait">
          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* STATS CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Revenue",    value: `₹${totalSales.toLocaleString()}`, icon: IndianRupee, color: "bg-green-50",  iconColor: "text-green-600",  border: "border-green-100" },
                  { label: "Total Orders",     value: totalOrders,                        icon: ShoppingBag, color: "bg-blue-50",   iconColor: "text-blue-600",   border: "border-blue-100"  },
                  { label: "Total Products",   value: products.length,                    icon: Package,     color: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100"},
                  { label: "Processing",       value: processing,                         icon: Clock,       color: "bg-yellow-50", iconColor: "text-yellow-600", border: "border-yellow-100"},
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className={`${stat.color} w-11 h-11 rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon size={20} className={stat.iconColor} />
                    </div>
                    <p className="text-2xl font-black text-[#2F4156]">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* ORDER STATUS BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#e8eef2] shadow-sm">
                  <h3 className="font-black text-[#2F4156] mb-5 flex items-center gap-2">
                    <TrendingUp size={18} /> Order Status
                  </h3>
                  {["Processing", "Shipped", "Delivered", "Cancelled"].map((status) => {
                    const count  = orders.filter((o) => o.status === status).length;
                    const pct    = totalOrders ? Math.round((count / totalOrders) * 100) : 0;
                    const config = STATUS_FLOW[status];
                    return (
                      <div key={status} className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
                            {status}
                          </span>
                          <span className="text-gray-500 font-semibold">{count} orders ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <motion.div
                            className="bg-[#2F4156] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RECENT ORDERS */}
                <div className="bg-white rounded-2xl p-6 border border-[#e8eef2] shadow-sm">
                  <h3 className="font-black text-[#2F4156] mb-5 flex items-center gap-2">
                    <ShoppingBag size={18} /> Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => {
                      const config = STATUS_FLOW[order.status] || STATUS_FLOW["Processing"];
                      return (
                        <div key={order._id} className="flex items-center justify-between py-2 border-b border-[#f0f5f8] last:border-0">
                          <div>
                            <p className="text-sm font-bold text-[#2F4156]">
                              {order.user?.name || "Customer"}
                            </p>
                            <p className="text-xs text-gray-400">
                              #{order._id?.slice(-6).toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-[#2F4156]">
                              ₹{order.finalAmount}
                            </p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.color}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* SEARCH */}
              <div className="flex items-center gap-3 bg-white border border-[#e8eef2] rounded-xl px-4 py-3 mb-6 shadow-sm">
                <Search size={16} className="text-gray-400" />
                <input
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  placeholder="Search by order ID or customer name..."
                  className="flex-1 outline-none text-sm text-[#2F4156]"
                />
              </div>

              {loading ? (
                <div className="text-center py-20 text-gray-400">Loading orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No orders found</div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const config = STATUS_FLOW[order.status] || STATUS_FLOW["Processing"];
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={order._id}
                        className="bg-white rounded-2xl p-5 border border-[#e8eef2] shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                          {/* ORDER INFO */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-black text-[#2F4156] text-sm">
                                #{order._id?.slice(-8).toUpperCase()}
                              </p>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${config.color}`}>
                                <StatusIcon size={11} />
                                {order.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500">
                              <span className="font-semibold text-[#2F4156]">
                                {order.user?.name || "Customer"}
                              </span>
                              {" — "}
                              {order.address?.city}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                            </p>

                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-black text-[#2F4156]">
                                ₹{order.finalAmount}
                              </span>
                              <span className="text-xs text-gray-400">
                                {order.paymentMethod}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                          </div>

                          {/* STATUS BUTTONS */}
                          <div className="flex gap-2 flex-wrap">
                            {config.next && (
                              <motion.button
                                onClick={() => updateStatus(order._id, config.next)}
                                className="flex items-center gap-2 bg-[#2F4156] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#3e566e] transition"
                                whileTap={{ scale: 0.97 }}
                              >
                                <Truck size={13} />
                                Mark as {config.next}
                              </motion.button>
                            )}
                            {order.status !== "Cancelled" && order.status !== "Delivered" && (
                              <motion.button
                                onClick={() => updateStatus(order._id, "Cancelled")}
                                className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                                whileTap={{ scale: 0.97 }}
                              >
                                <X size={13} />
                                Cancel
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── PRODUCTS TAB ── */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* TOP BAR */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex items-center gap-3 bg-white border border-[#e8eef2] rounded-xl px-4 py-3 flex-1 shadow-sm">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={searchProd}
                    onChange={(e) => setSearchProd(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 outline-none text-sm text-[#2F4156]"
                  />
                </div>
                <motion.button
                  onClick={() => { setShowAddForm(true); setEditProduct(null); resetForm(); }}
                  className="flex items-center gap-2 bg-[#2F4156] text-white px-5 py-3 rounded-xl font-bold text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus size={16} /> Add Product
                </motion.button>
              </div>

              {/* ADD/EDIT FORM */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl p-6 border border-[#e8eef2] shadow-sm mb-6"
                  >
                    <h3 className="font-black text-[#2F4156] mb-5 text-lg">
                      {editProduct ? "Edit Product" : "Add New Product"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: "name",          label: "Product Name *",   placeholder: "e.g. Oversized Black T-Shirt", span: 2 },
                        { key: "image",         label: "Image Path *",     placeholder: "/products/tshirt1.png",        span: 2 },
                        { key: "price",         label: "Price (₹) *",      placeholder: "999",                          span: 1 },
                        { key: "originalPrice", label: "Original Price",   placeholder: "1299 (optional)",               span: 1 },
                        { key: "rating",        label: "Rating",           placeholder: "4.5",                           span: 1 },
                        { key: "reviews",       label: "Review Count",     placeholder: "120",                           span: 1 },
                        { key: "sizes",         label: "Sizes",            placeholder: "S,M,L,XL",                      span: 2 },
                      ].map((field) => (
                        <div key={field.key} className={field.span === 2 ? "md:col-span-2" : ""}>
                          <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                            {field.label}
                          </label>
                          <input
                            value={form[field.key]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                          />
                        </div>
                      ))}

                      {/* CATEGORY */}
                      <div>
                        <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                          Category *
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa] cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* GENDER */}
                      <div>
                        <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                          Gender *
                        </label>
                        <div className="flex gap-2">
                          {["men", "women"].map((g) => (
                            <button
                              key={g}
                              onClick={() => setForm({ ...form, gender: g })}
                              className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition ${
                                form.gender === g
                                  ? "bg-[#2F4156] text-white border-[#2F4156]"
                                  : "border-[#e8eef2] text-[#3e566e] hover:bg-[#f0f5f8]"
                              }`}
                            >
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* IS OFFER */}
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setForm({ ...form, isOffer: !form.isOffer })}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition ${
                            form.isOffer ? "bg-[#2F4156] border-[#2F4156]" : "border-[#c8d9e6]"
                          }`}
                        >
                          {form.isOffer && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <label className="text-sm font-semibold text-[#3e566e]">
                          Mark as Offer Product
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <motion.button
                        onClick={handleAddProduct}
                        className="flex-1 py-3 bg-[#2F4156] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#3e566e] transition"
                        whileTap={{ scale: 0.97 }}
                      >
                        <Save size={16} />
                        {editProduct ? "Update Product" : "Add Product"}
                      </motion.button>
                      <button
                        onClick={() => { setShowAddForm(false); setEditProduct(null); resetForm(); }}
                        className="px-6 py-3 border border-[#c8d9e6] text-[#3e566e] rounded-xl font-bold text-sm hover:bg-[#f0f5f8] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PRODUCTS TABLE */}
              <div className="bg-white rounded-2xl border border-[#e8eef2] shadow-sm overflow-hidden">
                <div className="bg-[#f0f5f8] px-5 py-3 grid grid-cols-12 gap-3 text-xs font-bold text-[#3e566e] uppercase tracking-wider">
                  <span className="col-span-1">Img</span>
                  <span className="col-span-4">Name</span>
                  <span className="col-span-2">Category</span>
                  <span className="col-span-1">Gender</span>
                  <span className="col-span-2">Price</span>
                  <span className="col-span-2">Actions</span>
                </div>

                <div className="divide-y divide-[#f0f5f8] max-h-[500px] overflow-y-auto">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="px-5 py-3 grid grid-cols-12 gap-3 items-center hover:bg-[#fafafa] transition">
                      <div className="col-span-1">
                        <img
                          src={p.image}
                          className="w-10 h-10 object-contain bg-[#f0f5f8] rounded-lg p-0.5"
                        />
                      </div>
                      <div className="col-span-4">
                        <p className="text-sm font-semibold text-[#2F4156] line-clamp-1">{p.name}</p>
                        {p.isOffer && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                            OFFER
                          </span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs bg-[#f0f5f8] text-[#3e566e] px-2 py-1 rounded-full font-medium">
                          {p.category}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-xs text-gray-500 font-medium capitalize">{p.gender}</span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-black text-[#2F4156]">₹{p.price}</p>
                        {p.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">₹{p.originalPrice}</p>
                        )}
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  )}
      </div>

      {/* INLINE TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border text-sm font-semibold ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success"
              ? <CheckCircle size={16} />
              : <AlertCircle size={16} />
            }
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
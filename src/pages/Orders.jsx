import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import {
  Package, ShoppingBag, ChevronDown, ChevronUp,
  MapPin, CreditCard, Tag, X, CheckCircle,
  Truck, Clock, AlertCircle
} from "lucide-react";
import Footer from "../components/Footer";

const STATUS_STEPS = ["Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

const STATUS_COLOR = {
  Processing:        "bg-yellow-100 text-yellow-700 border-yellow-200",
  Confirmed:         "bg-blue-100 text-blue-700 border-blue-200",
  Shipped:           "bg-purple-100 text-purple-700 border-purple-200",
  "Out for Delivery":"bg-orange-100 text-orange-700 border-orange-200",
  Delivered:         "bg-green-100 text-green-700 border-green-200",
  Cancelled:         "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICON = {
  Processing:        Clock,
  Confirmed:         CheckCircle,
  Shipped:           Truck,
  "Out for Delivery":Truck,
  Delivered:         CheckCircle,
  Cancelled:         AlertCircle,
};

export default function Orders() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [expandedId, setExpandedId]   = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrders();
  }, [user]);

 const fetchOrders = async () => {
  try {
    const res  = await fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    // ✅ 401 — token expired, login page pe bhejo
    if (res.status === 401) {
      navigate("/login");
      return;
    }

    // ✅ Array check — galat data aaye toh empty array
    if (res.ok) {
      setOrders(Array.isArray(data) ? data : []);
    } else {
      setOrders([]);
    }

  } catch (err) {
    console.error(err);
    setOrders([]); // ✅ Error pe bhi crash nahi hoga
  }
  setLoading(false);
};

  const cancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => o._id === orderId ? { ...o, status: "Cancelled" } : o)
        );
      }
    } catch (err) {
      console.error(err);
    }
    setCancellingId(null);
    setConfirmCancel(null);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  // ── LOADING ──
 if (loading) return <Spinner text="Loading your orders..." />;

  // ── EMPTY ──
  if (orders.length === 0) {
    return (
      <motion.div
        className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center gap-5 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <ShoppingBag size={72} className="text-[#c8d9e6]" strokeWidth={1.2} />
        </motion.div>
        <h1 className="text-2xl font-bold text-[#2F4156]">No orders yet!</h1>
        <p className="text-gray-400 text-sm text-center">
          You haven't placed any orders. Start shopping!
        </p>
        <motion.button
          onClick={() => navigate("/")}
          className="px-7 py-3 bg-[#2F4156] text-white rounded-full text-sm font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Shop Now
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
    <motion.div
      className="min-h-screen bg-[#f5efeb] px-4 md:px-10 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADING */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium mb-1">
          Track your purchases
        </p>
        <h1 className="text-3xl font-bold text-[#2F4156]">
          My Orders
          <span className="ml-3 text-base font-normal text-gray-400">
            ({orders.length} {orders.length === 1 ? "order" : "orders"})
          </span>
        </h1>
      </motion.div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {orders.map((order, i) => {
          const StatusIcon = STATUS_ICON[order.status] || Clock;
          const isExpanded = expandedId === order._id;
          const stepIndex = STATUS_STEPS.indexOf(order.status);

          return (
            <motion.div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-[#e8eef2] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              {/* ORDER HEADER */}
              <div
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : order._id)}
              >
                <div className="flex items-center gap-4">
                  {/* FIRST ITEM IMAGE */}
                  <div className="bg-[#f0f5f8] rounded-xl h-16 w-16 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={order.items[0]?.image}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-[#2F4156] text-sm">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* AMOUNT */}
                  <div className="text-right">
                    <p className="font-bold text-[#2F4156] text-lg">₹{order.finalAmount}</p>
                    {order.discount > 0 && (
                      <p className="text-xs text-green-600">Saved ₹{order.discount}</p>
                    )}
                  </div>

                  {/* STATUS BADGE */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${STATUS_COLOR[order.status]}`}>
                    <StatusIcon size={12} />
                    {order.status}
                  </div>

                  {/* EXPAND ICON */}
                  {isExpanded
                    ? <ChevronUp size={18} className="text-gray-400" />
                    : <ChevronDown size={18} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-[#e8eef2]"
                  >
                    <div className="p-5 space-y-6">

                      {/* PROGRESS BAR */}
                      {order.status !== "Cancelled" && (
                        <div>
                          <p className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-3">
                            Order Progress
                          </p>
                          <div className="flex items-center gap-1">
                            {STATUS_STEPS.map((step, idx) => (
                              <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                    idx <= stepIndex
                                      ? "bg-[#2F4156] border-[#2F4156] text-white"
                                      : "bg-white border-gray-200 text-gray-300"
                                  }`}>
                                    {idx < stepIndex ? "✓" : idx + 1}
                                  </div>
                                  <p className={`text-[9px] mt-1 text-center font-medium ${
                                    idx <= stepIndex ? "text-[#2F4156]" : "text-gray-300"
                                  }`}>
                                    {step}
                                  </p>
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                  <div className={`h-0.5 flex-1 mb-4 ${
                                    idx < stepIndex ? "bg-[#2F4156]" : "bg-gray-200"
                                  }`} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ITEMS LIST */}
                      <div>
                        <p className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-3">
                          Items Ordered
                        </p>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-[#f8fafc] rounded-xl p-3">
                              <div className="bg-white rounded-lg h-14 w-14 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                <img src={item.image} className="h-full w-full object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[#2F4156] text-sm truncate">{item.name}</p>
                                {item.selectedSize && (
                                  <span className="text-[10px] bg-[#e8eef2] text-[#3e566e] px-2 py-0.5 rounded-full font-medium">
                                    Size: {item.selectedSize}
                                  </span>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-400">× {item.quantity}</p>
                                <p className="font-bold text-[#2F4156] text-sm">₹{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BOTTOM ROW — Address + Payment + Cancel */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* ADDRESS */}
                        <div className="bg-[#f8fafc] rounded-xl p-4">
                          <p className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-2 flex items-center gap-1">
                            <MapPin size={11} /> Delivery Address
                          </p>
                          <p className="font-bold text-[#2F4156] text-sm">{order.address?.name}</p>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {order.address?.street}, {order.address?.city}<br />
                            {order.address?.state} — {order.address?.pincode}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">📞 {order.address?.phone}</p>
                        </div>

                        {/* PAYMENT */}
                        <div className="bg-[#f8fafc] rounded-xl p-4">
                          <p className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CreditCard size={11} /> Payment
                          </p>
                          <p className="font-bold text-[#2F4156] text-sm">{order.paymentMethod}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Subtotal</span>
                              <span>₹{order.totalAmount}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-xs text-green-600">
                                <span>Discount</span>
                                <span>− ₹{order.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm font-bold text-[#2F4156] border-t border-gray-100 pt-1 mt-1">
                              <span>Total</span>
                              <span>₹{order.finalAmount}</span>
                            </div>
                          </div>
                          {order.couponUsed && (
                            <div className="flex items-center gap-1 mt-2 bg-green-50 px-2 py-1 rounded-lg">
                              <Tag size={10} className="text-green-600" />
                              <span className="text-xs text-green-600 font-semibold">{order.couponUsed} applied</span>
                            </div>
                          )}
                        </div>

                        {/* CANCEL */}
                        <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-2">
                              Actions
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {order.status === "Delivered"
                                ? "Order delivered successfully!"
                                : order.status === "Cancelled"
                                ? "This order has been cancelled."
                                : "You can cancel this order if not shipped yet."}
                            </p>
                          </div>

                          {order.status !== "Delivered" && order.status !== "Cancelled" && (
                            <motion.button
                              onClick={() => setConfirmCancel(order._id)}
                              className="mt-3 w-full py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold"
                              whileHover={{ backgroundColor: "#fecaca" }}
                              whileTap={{ scale: 0.97 }}
                            >
                              Cancel Order
                            </motion.button>
                          )}

                          {order.status === "Delivered" && (
                            <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-semibold">
                              <CheckCircle size={16} /> Delivered!
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* CANCEL CONFIRMATION POPUP */}
      <AnimatePresence>
        {confirmCancel && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmCancel(null)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-[88%] max-w-sm overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-gradient-to-r from-[#2F4156] to-[#3e566e] h-1.5 w-full" />
              <div className="p-6 text-center">
                <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X size={22} className="text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-[#2F4156]">Cancel Order?</h2>
                <p className="text-sm text-gray-400 mt-2 mb-5">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setConfirmCancel(null)}
                    className="flex-1 py-2.5 border-2 border-[#c8d9e6] text-[#3e566e] rounded-xl text-sm font-bold"
                    whileTap={{ scale: 0.97 }}
                  >
                    Keep Order
                  </motion.button>
                  <motion.button
                    onClick={() => cancelOrder(confirmCancel)}
                    disabled={cancellingId === confirmCancel}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.97 }}
                  >
                    {cancellingId === confirmCancel ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    ) : (
                      "Yes, Cancel"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
     
    </motion.div>
    <Footer />
    </>
  );
}
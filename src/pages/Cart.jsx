import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Heart, ShoppingBag, Plus, Minus,
  ArrowRight, Tag, X, CheckCircle, Ticket,
  ShoppingCart, Percent
} from "lucide-react";

export default function Cart() {
  const {
    cart, increaseQty, decreaseQty, removeItem, moveToWishlist,
    subtotal, discount, totalPrice,
    applyCoupon, removeCoupon, appliedCoupon,
  } = useContext(CartContext);

  const navigate  = useNavigate();
  const { showToast } = useToast();

  const [confirmItem, setConfirmItem] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg,   setCouponMsg]   = useState(null);
  const [hoveredId,   setHoveredId]   = useState(null);

  const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.success) {
      setCouponMsg({ type: "success", text: `"${couponInput.toUpperCase()}" applied — ${result.label}!` });
      showToast(`Coupon applied! ${result.label}`, "success");
    } else {
      setCouponMsg({ type: "error", text: result.msg });
    }
    setTimeout(() => setCouponMsg(null), 3000);
    setCouponInput("");
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center bg-[#f5efeb] gap-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="relative"
        >
          <div className="bg-white w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg border border-[#e8eef2]">
            <ShoppingCart size={52} className="text-[#c8d9e6]" strokeWidth={1.2} />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#2F4156] text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">
            0
          </div>
        </motion.div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#2F4156]">Your cart is empty!</h1>
          <p className="text-gray-400 text-sm mt-2">Looks like you haven't added anything yet.</p>
        </div>
        <motion.button
          onClick={() => navigate("/")}
          className="mt-2 px-8 py-3.5 bg-[#2F4156] text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Shopping <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* ── TOP BANNER ── */}
      <div className="bg-[#2F4156] text-center py-2.5">
        <p className="text-[#c8d9e6] text-xs font-semibold">
          🎉 Free delivery on orders above ₹999 — Use code{" "}
          <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded-full">
            NEST20
          </span>{" "}
          for 20% off!
        </p>
      </div>

      <div className="px-4 md:px-10 py-8">

        {/* HEADING */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium mb-1">
            Review your order
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-[#2F4156] flex items-center gap-3">
            My Cart
            <span className="bg-[#2F4156] text-white text-sm px-3 py-1 rounded-full font-bold">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── CART ITEMS ── */}
          <div className="w-full flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="bg-white rounded-3xl shadow-sm border border-[#e8eef2] overflow-hidden"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ boxShadow: "0 8px 30px rgba(47,65,86,0.12)" }}
                >
                  <div className="flex gap-0">

                    {/* IMAGE */}
                    <div className="bg-[#f0f5f8] w-32 md:w-40 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-l-3xl">
                      <motion.img
                        src={item.image}
                        className="h-full w-full object-contain p-3"
                        animate={{ scale: hoveredId === item.id ? 1.08 : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 p-4 md:p-5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h2
                            className="font-bold text-[#2F4156] text-sm md:text-base leading-snug cursor-pointer hover:underline line-clamp-2"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h2>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {item.selectedSize && (
                              <span className="text-[11px] bg-[#f0f5f8] text-[#3e566e] px-2.5 py-1 rounded-full font-semibold">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.brand && (
                              <span className="text-[11px] bg-[#f0f5f8] text-[#3e566e] px-2.5 py-1 rounded-full font-semibold capitalize">
                                {item.brand}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-[#2F4156] text-lg">
                            ₹{item.price * item.quantity}
                          </p>
                          <p className="text-xs text-gray-400">₹{item.price} each</p>
                        </div>
                      </div>

                      {/* QTY + ACTIONS */}
                      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">

                        {/* QUANTITY */}
                        <div className="flex items-center gap-1 bg-[#f0f5f8] rounded-xl p-1">
                          <motion.button
                            onClick={() => decreaseQty(item.id)}
                            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2F4156] shadow-sm hover:bg-[#c8d9e6] transition"
                            whileTap={{ scale: 0.85 }}
                          >
                            <Minus size={12} />
                          </motion.button>
                          <span className="text-sm font-black text-[#2F4156] w-8 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() => increaseQty(item.id)}
                            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2F4156] shadow-sm hover:bg-[#c8d9e6] transition"
                            whileTap={{ scale: 0.85 }}
                          >
                            <Plus size={12} />
                          </motion.button>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => {
                              moveToWishlist(item);
                              showToast(`${item.name} moved to wishlist! ❤️`, "wishlist");
                            }}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-[#c8d9e6] text-[#3e566e] rounded-xl hover:bg-[#f0f5f8] transition font-semibold"
                            whileTap={{ scale: 0.95 }}
                          >
                            <Heart size={13} /> Save
                          </motion.button>
                          <motion.button
                            onClick={() => setConfirmItem(item)}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition font-semibold"
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={13} /> Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* CONTINUE SHOPPING */}
            <motion.button
              onClick={() => navigate("/products/all/all")}
              className="w-full py-3.5 border-2 border-dashed border-[#c8d9e6] text-[#3e566e] rounded-2xl text-sm font-bold hover:bg-white transition flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
            >
              <ShoppingBag size={16} /> Continue Shopping
            </motion.button>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <motion.div
            className="w-full lg:w-96 lg:sticky lg:top-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-white rounded-3xl shadow-sm border border-[#e8eef2] overflow-hidden">

              {/* HEADER */}
              <div className="bg-[#2F4156] px-6 py-5">
                <h2 className="text-white font-black text-lg flex items-center gap-2">
                  <Tag size={18} /> Order Summary
                </h2>
                <p className="text-[#c8d9e6] text-xs mt-1">
                  {itemCount} items · Free delivery
                </p>
              </div>

              <div className="px-6 py-5 space-y-4">

                {/* ITEMS */}
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-500 truncate max-w-[180px]">
                        {item.name}
                        <span className="text-gray-400 text-xs"> ×{item.quantity}</span>
                      </span>
                      <span className="font-bold text-[#2F4156] ml-2 flex-shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-[#f0f5f8]" />

                {/* COUPON */}
                <div>
                  <p className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Percent size={12} /> Apply Coupon
                  </p>

                  <AnimatePresence>
                    {appliedCoupon ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <div>
                            <p className="text-xs font-black text-green-700">{appliedCoupon.code}</p>
                            <p className="text-[10px] text-green-600">{appliedCoupon.label} applied!</p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-500 hover:text-red-500 transition"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                      >
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="Enter coupon code"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8eef2] text-xs outline-none focus:border-[#3e566e] transition bg-[#fafafa] uppercase font-semibold"
                        />
                        <motion.button
                          onClick={handleApplyCoupon}
                          className="px-4 py-2.5 bg-[#2F4156] text-white rounded-xl text-xs font-black"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Apply
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {couponMsg && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-xs mt-2 font-semibold px-3 py-2 rounded-xl ${
                          couponMsg.type === "success"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {couponMsg.type === "success" ? "✅" : "❌"} {couponMsg.text}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {!appliedCoupon && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {["STYLE10", "NEST20", "FIRST50"].map((code) => (
                        <button
                          key={code}
                          onClick={() => { setCouponInput(code); }}
                          className="text-[10px] bg-[#f0f5f8] text-[#3e566e] px-2.5 py-1 rounded-full font-bold hover:bg-[#c8d9e6] transition"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="border-[#f0f5f8]" />

                {/* PRICE BREAKDOWN */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-[#2F4156]">₹{subtotal}</span>
                  </div>

                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-green-600 flex items-center gap-1">
                          <Percent size={12} /> Coupon Discount
                        </span>
                        <span className="text-green-600 font-bold">− ₹{discount}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-green-600 font-bold">FREE 🎉</span>
                  </div>
                </div>

                <hr className="border-[#f0f5f8]" />

                {/* TOTAL */}
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#2F4156] text-lg">Total</span>
                  <div className="text-right">
                    {discount > 0 && (
                      <p className="text-xs text-gray-400 line-through">₹{subtotal}</p>
                    )}
                    <span className="font-black text-[#2F4156] text-2xl">₹{totalPrice}</span>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 text-center">
                    <p className="text-green-600 text-sm font-bold">
                      🎉 You're saving ₹{discount} on this order!
                    </p>
                  </div>
                )}

                {/* CHECKOUT BUTTON */}
                <motion.button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 bg-[#2F4156] text-white rounded-2xl font-black flex items-center justify-center gap-2 text-sm shadow-lg"
                  whileHover={{ backgroundColor: "#3e566e", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </motion.button>

                {/* SAFE CHECKOUT */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  {["🔒 Secure", "✅ Verified", "🚀 Fast"].map((item) => (
                    <span key={item} className="text-[10px] text-gray-400 font-semibold">
                      {item}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── REMOVE POPUP ── */}
      <AnimatePresence>
        {confirmItem && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmItem(null)}
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
                <div className="bg-[#f0f5f8] rounded-2xl p-3 w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                  <img src={confirmItem.image} className="h-full w-full object-contain" />
                </div>
                <div className="bg-red-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <h2 className="text-base font-black text-[#2F4156]">Remove Item?</h2>
                <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
                  Remove{" "}
                  <span className="font-bold text-[#2F4156]">{confirmItem.name}</span>{" "}
                  from your cart?
                </p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setConfirmItem(null)}
                    className="flex-1 py-2.5 border-2 border-[#c8d9e6] text-[#3e566e] rounded-xl text-sm font-bold"
                    whileTap={{ scale: 0.97 }}
                  >
                    Keep It
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      removeItem(confirmItem.id);
                      showToast(`${confirmItem.name} removed from cart`, "info");
                      setConfirmItem(null);
                    }}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                    whileTap={{ scale: 0.97 }}
                  >
                    <Trash2 size={13} /> Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
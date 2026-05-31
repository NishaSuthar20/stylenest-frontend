import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { products } from "../data/products";
import { useToast } from "../context/ToastContext";
import {
  ShoppingCart, Heart, Star, Copy, CheckCheck,
  Tag, ArrowRight, Flame, Gift, Zap
} from "lucide-react";
import Footer from "../components/Footer";

const coupons = [
  {
    code: "STYLE10",
    discount: "10% OFF",
    desc: "On all orders",
    min: "No minimum",
    bg: "bg-[#2F4156]",
    badge: "Most Popular",
    badgeColor: "bg-[#c8d9e6] text-[#2F4156]",
  },
  {
    code: "NEST20",
    discount: "20% OFF",
    desc: "Minimum order ₹999",
    min: "Min. ₹999",
    bg: "bg-[#3e566e]",
    badge: "Best Deal",
    badgeColor: "bg-white text-[#3e566e]",
  },
  {
    code: "FIRST50",
    discount: "₹50 OFF",
    desc: "On your first order",
    min: "No minimum",
    bg: "bg-[#1e2f3f]",
    badge: "New Users",
    badgeColor: "bg-[#c8d9e6] text-[#1e2f3f]",
  },
  {
    code: "FREESHIP",
    discount: "FREE",
    desc: "Free delivery",
    min: "Any order",
    bg: "bg-[#2F4156]",
    badge: "Free Ship",
    badgeColor: "bg-white text-[#2F4156]",
  },
];

// ✅ FIX 2: Each product ka alag selling percentage
const getSoldPercent = (id) => ((id * 13) % 45) + 40;

export default function Offers() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } =
    useContext(CartContext);

  const [copiedCode, setCopiedCode] = useState(null);
  const [addedIds, setAddedIds]     = useState([]);
  const [hoveredId, setHoveredId]   = useState(null);
  const [activeTab, setActiveTab]   = useState("all");

  // ✅ FIX 1: Sirf offer products — jinke paas originalPrice hai
  const offerProducts = products.filter((p) => p.isOffer === true);
  const filtered =
    activeTab === "all"
      ? offerProducts
      : offerProducts.filter((p) => p.gender === activeTab);

  const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddToCart = (p) => {
    addToCart({ ...p, selectedSize: p.sizes?.[0] });
    showToast(`${p.name} added to cart!`, "cart");
    setAddedIds((prev) => [...prev, p.id]);
    setTimeout(
      () => setAddedIds((prev) => prev.filter((id) => id !== p.id)),
      1500
    );
  };

   const toggleWishlist = (p) => {
    if (wishlist.find((i) => i.id === p.id)) {
      removeFromWishlist(p.id);
      showToast(`${p.name} removed from wishlist`, "info");  // ✅
    } else {
      addToWishlist(p);
      showToast(`${p.name} added to wishlist! ❤️`, "wishlist");  // ✅
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* HERO BANNER */}
      <div className="relative bg-[#2F4156] overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-10 right-[20%] w-32 h-32 bg-[#c8d9e6]/10 rounded-full" />

        <div className="relative z-10 px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-300 text-xs px-4 py-2 rounded-full mb-6 font-semibold"
          >
            <Flame size={13} className="animate-pulse" />
            LIMITED TIME DEALS — DON'T MISS OUT!
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight"
          >
            MEGA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c8d9e6] to-white">
              SALE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#c8d9e6] mt-3 text-lg"
          >
            Upto{" "}
            <span className="text-white font-black text-2xl">50% OFF</span>{" "}
            on premium fashion
          </motion.p>

          <motion.button
            onClick={() =>
              document
                .getElementById("offers-section")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 px-8 py-4 bg-[#c8d9e6] text-[#2F4156] rounded-full font-black text-sm flex items-center gap-2 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Shop Deals Now <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* COUPON CODES */}
      <div className="px-6 py-12 bg-white">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f8] px-4 py-2 rounded-full mb-3">
            <Gift size={14} className="text-[#3e566e]" />
            <span className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider">
              Exclusive Coupon Codes
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2F4156]">
            Copy & Save Instantly!
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Apply at checkout to get instant discount
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {coupons.map((c, i) => (
            <motion.div
              key={i}
              className={`${c.bg} rounded-2xl p-5 relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-white/5 rounded-full" />
              <div className="absolute bottom-[-30px] left-[-10px] w-20 h-20 bg-white/5 rounded-full" />

              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${c.badgeColor}`}>
                {c.badge}
              </span>

              <Tag size={18} className="text-white/50 mt-3 mb-2" />
              <p className="text-white/70 text-xs">{c.desc}</p>
              <p className="text-white font-black text-3xl mt-1">{c.discount}</p>
              <p className="text-white/50 text-[11px] mt-1">{c.min}</p>

              <div className="border-t border-dashed border-white/20 my-3" />

              <motion.button
                onClick={() => handleCopy(c.code)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-2.5 flex items-center justify-center gap-2 text-white font-bold text-sm transition"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {copiedCode === c.code ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-green-300"
                    >
                      <CheckCheck size={14} /> Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy size={14} /> {c.code}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLASH SALE STRIP */}
      <div className="mx-6 rounded-3xl overflow-hidden bg-[#1e2f3f] border border-[#3e566e] px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#c8d9e6]/20 p-2 rounded-xl">
            <Zap size={22} className="text-[#c8d9e6]" fill="#c8d9e6" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-tight">
              ⚡ Flash Sale — Extra 10% OFF
            </p>
            <p className="text-white/60 text-sm">
              Use code{" "}
              <span className="font-black bg-[#c8d9e6]/20 text-[#c8d9e6] px-2 py-0.5 rounded-lg">
                STYLE10
              </span>{" "}
              at checkout
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => navigate("/products/all/all")}
          className="bg-[#c8d9e6] text-[#2F4156] px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Shop Now <ArrowRight size={15} />
        </motion.button>
      </div>

      {/* COUPON REMINDER STRIP */}
      <motion.div
        className="mx-6 mt-6 bg-white border border-[#c8d9e6] rounded-2xl px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-[#f0f5f8] p-2.5 rounded-xl">
            <Gift size={18} className="text-[#2F4156]" />
          </div>
          <div>
            <p className="text-[#2F4156] font-bold text-sm">
              🎁 Exclusive Coupons Available!
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Save upto 20% — Use codes{" "}
              <span className="font-bold text-[#2F4156] bg-[#f0f5f8] px-1.5 py-0.5 rounded">
                NEST20
              </span>{" "}
              or{" "}
              <span className="font-bold text-[#2F4156] bg-[#f0f5f8] px-1.5 py-0.5 rounded">
                STYLE10
              </span>{" "}
              at checkout
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 bg-[#2F4156] text-white text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          View All Coupons ↑
        </motion.button>
      </motion.div>

      {/* OFFER PRODUCTS */}
      <div id="offers-section" className="px-6 py-12">

        {/* HEADING + TABS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium mb-1">
              Best Deals
            </p>
            <h2 className="text-3xl font-black text-[#2F4156]">
              Today's Offers
              <span className="ml-3 text-base font-normal text-gray-400">
                ({filtered.length} products)
              </span>
            </h2>
          </div>

          <div className="flex gap-2 bg-white border border-[#e8eef2] rounded-full p-1 shadow-sm">
            {["all", "men", "women"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#2F4156] text-white shadow"
                    : "text-[#3e566e] hover:bg-[#f0f5f8]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Tag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No offers in this category right now!</p>
            <p className="text-sm mt-1">Check back soon 🎁</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8eef2] relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: i < 8 ? i * 0.05 : 0 }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(47,65,86,0.15)" }}
              >
                {/* IMAGE */}
                <div
                  className="relative bg-[#f0f5f8] overflow-hidden h-56 cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img
                    src={p.image}
                    className={`w-full h-full object-contain p-3 transition-transform duration-300 ${
                      hoveredId === p.id ? "scale-110" : "scale-100"
                    }`}
                  />

                  {/* ✅ FIX 1: Discount % alag alag — calculated from originalPrice */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    {discount(p.originalPrice, p.price)}% OFF
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md"
                  >
                    <Heart
                      size={15}
                      className={
                        wishlist.find((i) => i.id === p.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-300"
                      }
                    />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Save ₹{p.originalPrice - p.price}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <h3
                    className="font-semibold text-[#2F4156] text-sm leading-snug cursor-pointer hover:underline"
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    {p.name}
                  </h3>

                  {p.rating && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={11}
                          className={
                            idx < Math.floor(p.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                      <span className="text-[11px] text-gray-400 ml-1">
                        ({p.reviews})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="font-black text-[#2F4156] text-lg">
                      ₹{p.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{p.originalPrice}
                    </span>
                  </div>

                  {/* ✅ FIX 2: Har product ka alag selling % */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Selling Fast!</span>
                      <span>{getSoldPercent(p.id)}% sold</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <motion.div
                        className="bg-red-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${getSoldPercent(p.id)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      addedIds.includes(p.id)
                        ? "bg-green-500 text-white"
                        : "bg-[#2F4156] text-white hover:bg-[#3e566e]"
                    }`}
                  >
                    {addedIds.includes(p.id) ? (
                      <>✓ Added to Cart!</>
                    ) : (
                      <>
                        <ShoppingCart size={14} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM BANNER */}
      <div className="mx-6 mb-12 rounded-3xl bg-[#2F4156] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/5 rounded-full" />
        <div>
          <p className="text-[#c8d9e6] text-sm font-medium mb-2">
            Don't miss out!
          </p>
          <h2 className="text-white font-black text-3xl md:text-4xl">
            More Styles.
            <br />
            <span className="text-[#c8d9e6]">Better Prices.</span>
          </h2>
          <p className="text-white/60 text-sm mt-3 max-w-md">
            Shop from 500+ premium products with exclusive discounts.
          </p>
        </div>
        <motion.button
          onClick={() => navigate("/products/all/all")}
          className="bg-[#c8d9e6] text-[#2F4156] px-8 py-4 rounded-full font-black text-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Shop All Products <ArrowRight size={16} />
        </motion.button>
      </div>

      <Footer />
    </div>
  );
}
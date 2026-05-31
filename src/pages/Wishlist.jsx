import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, Eye, Star, Trash2, X,
} from "lucide-react";
import Footer from "../components/Footer";

export default function Wishlist() {
  const { wishlist, moveToCart, removeFromWishlist } = useContext(CartContext);
  const { showToast } = useToast(); // ✅ FIX 1: yahan add karo
  const navigate = useNavigate();

  const [hoveredId, setHoveredId] = useState(null);
  const [quickView, setQuickView] = useState(null);

  const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5efeb]">
        <Heart size={60} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-[#2F4156]">Wishlist is Empty</h1>
        <p className="text-gray-400 mt-2">Save your favourite products here ❤️</p>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[#f5efeb] px-4 md:px-8 py-8">

      {/* HEADING */}
      <div className="mb-8">
        <p className="uppercase tracking-[4px] text-xs text-[#3e566e] font-medium">
          Your favourites
        </p>
        <h1 className="text-3xl font-bold text-[#2F4156] mt-1">
          My Wishlist
          <span className="text-gray-400 text-lg ml-2">
            ({wishlist.length} items)
          </span>
        </h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {wishlist.map((item, i) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#e8eef2] shadow-sm relative group"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5, boxShadow: "0 18px 40px rgba(47,65,86,0.15)" }}
            onHoverStart={() => setHoveredId(item.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            {/* IMAGE */}
            <div
              className="relative bg-[#f0f5f8] h-56 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <motion.img
                src={item.image}
                className="w-full h-full object-contain p-4"
                animate={{ scale: hoveredId === item.id ? 1.07 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {item.originalPrice && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-full">
                  {discount(item.originalPrice, item.price)}% OFF
                </div>
              )}

              {/* REMOVE */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(item.id);
                  showToast(`${item.name} removed from wishlist`, "info");
                }}
                whileTap={{ scale: 0.8 }}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
              >
                <Trash2 size={14} className="text-red-500" />
              </motion.button>

              {/* QUICK VIEW */}
              <AnimatePresence>
                {hoveredId === item.id && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => { e.stopPropagation(); setQuickView(item); }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#2F4156] text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                  >
                    <Eye size={13} />
                    Quick View
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* DETAILS */}
            <div className="p-4">
              <h2
                className="font-semibold text-[#2F4156] text-sm leading-snug cursor-pointer hover:underline"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.name}
              </h2>

              {item.rating && (
                <div className="flex items-center gap-1 mt-1.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={11}
                      className={
                        idx < Math.floor(item.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">({item.reviews})</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="font-bold text-[#2F4156] text-lg">₹{item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                )}
                {item.originalPrice && (
                  <span className="text-xs text-green-600 font-semibold">
                    Save ₹{item.originalPrice - item.price}
                  </span>
                )}
              </div>

              {item.selectedSize && (
                <div className="mt-3">
                  <span className="text-xs bg-[#f0f5f8] text-[#3e566e] px-2 py-1 rounded-full">
                    Size: {item.selectedSize}
                  </span>
                </div>
              )}

              {/* ADD TO CART */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  onClick={() => {
                    moveToCart(item);
                    showToast(`${item.name} added to cart!`, "cart"); // ✅
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-[#2F4156] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#3e566e] transition"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickView && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickView(null)}
            />

            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl overflow-hidden shadow-2xl z-50 w-[90%] max-w-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* ✅ FIX 2: Close button sirf close kare */}
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="bg-[#f0f5f8] md:w-1/2 flex items-center justify-center p-8">
                  <img src={quickView.image} className="h-64 object-contain" />
                </div>

                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                  <div>
                    {quickView.originalPrice && (
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                        {discount(quickView.originalPrice, quickView.price)}% OFF
                      </span>
                    )}

                    <h2 className="text-2xl font-bold text-[#2F4156] mt-4">
                      {quickView.name}
                    </h2>

                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className={
                            idx < Math.floor(quickView.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        ({quickView.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-3xl font-bold text-[#2F4156]">
                        ₹{quickView.price}
                      </span>
                      {quickView.originalPrice && (
                        <span className="text-gray-400 line-through">
                          ₹{quickView.originalPrice}
                        </span>
                      )}
                    </div>

                    {quickView.originalPrice && (
                      <p className="text-green-600 font-semibold mt-2 text-sm">
                        You save ₹{quickView.originalPrice - quickView.price}
                      </p>
                    )}

                    {quickView.selectedSize && (
                      <div className="mt-4">
                        <span className="bg-[#f0f5f8] text-[#3e566e] px-3 py-1 rounded-full text-sm">
                          Size: {quickView.selectedSize}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8">
                    {/* ✅ ADD TO CART with toast */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        moveToCart(quickView);
                        showToast(`${quickView.name} added to cart!`, "cart");
                        setQuickView(null);
                      }}
                      className="flex-1 bg-[#2F4156] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3e566e] transition"
                    >
                      <ShoppingCart size={15} />
                      Add to Cart
                    </motion.button>

                    {/* ✅ FIX 3: quickView use karo, item nahi */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        removeFromWishlist(quickView.id);
                        showToast(`${quickView.name} removed from wishlist`, "info");
                        setQuickView(null);
                      }}
                      className="p-3 border rounded-xl hover:bg-red-50 transition"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    <Footer/>
    </>
  );
}
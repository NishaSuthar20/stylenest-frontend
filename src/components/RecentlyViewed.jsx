import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ShoppingCart, Heart } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function RecentlyViewed({ currentProductId }) {
  const navigate  = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);
  const { showToast } = useToast();

  // localStorage se recently viewed lo
  const all     = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  // Current product ko hata do aur max 6 dikhao
  const recent  = all
    .filter((p) => p.id !== currentProductId)
    .slice(0, 6);

  if (recent.length === 0) return null;

  const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">

      {/* HEADING */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2F4156] p-2 rounded-xl">
          <Clock size={18} className="text-white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium">
            Your History
          </p>
          <h2 className="text-2xl font-black text-[#2F4156]">
            Recently Viewed
          </h2>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recent.map((p, i) => (
          <motion.div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#e8eef2] shadow-sm group cursor-pointer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(47,65,86,0.15)" }}
          >
            {/* IMAGE */}
            <div
              className="relative bg-[#f0f5f8] h-40 overflow-hidden"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <img
                src={p.image}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />

              {p.originalPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {discount(p.originalPrice, p.price)}% OFF
                </div>
              )}

              {/* WISHLIST */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (wishlist.find((w) => w.id === p.id)) {
                    removeFromWishlist(p.id);
                    showToast(`${p.name} removed from wishlist`, "info");
                  } else {
                    addToWishlist(p);
                    showToast(`${p.name} added to wishlist! ❤️`, "wishlist");
                  }
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  size={12}
                  className={
                    wishlist.find((w) => w.id === p.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* DETAILS */}
            <div className="p-3">
              <h3
                className="font-semibold text-[#2F4156] text-xs leading-snug line-clamp-1 cursor-pointer hover:underline"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                {p.name}
              </h3>

              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-black text-[#2F4156] text-sm">₹{p.price}</span>
                {p.originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through">₹{p.originalPrice}</span>
                )}
              </div>

              <button
                onClick={() => {
                  addToCart({ ...p, selectedSize: p.sizes?.[0] });
                  showToast(`${p.name} added to cart!`, "cart");
                }}
                className="mt-2 w-full py-1.5 bg-[#2F4156] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#3e566e] transition"
              >
                <ShoppingCart size={11} />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
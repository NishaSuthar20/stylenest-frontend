import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product: p }) {
  const isOutOfStock = p.stock === 0;
  const navigate     = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);
  const { showToast } = useToast();

  const [added,   setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selSize, setSelSize] = useState(p.sizes?.[0] || "");

  const isWishlisted = wishlist.find((w) => w.id === p.id);
  const discount     = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ ...p, selectedSize: selSize });
    showToast(`${p.name} added to cart!`, "cart");
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(p.id);
      showToast(`${p.name} removed from wishlist`, "info");
    } else {
      addToWishlist(p);
      showToast(`${p.name} added to wishlist! ❤️`, "wishlist");
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8eef2] group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(47,65,86,0.15)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div
        className="relative bg-[#f0f5f8] overflow-hidden h-56 cursor-pointer"
        onClick={() => navigate(`/product/${p.id}`)}
      >
        <img
          src={p.image}
          alt={p.name}
          className={`w-full h-full object-contain p-3 transition-transform duration-300 ${
            hovered && !isOutOfStock ? "scale-110" : "scale-100"
          } ${isOutOfStock ? "opacity-50" : ""}`}
        />

        {/* DISCOUNT BADGE */}
        {discount && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            {discount}% OFF
          </div>
        )}

        {/* ✅ OUT OF STOCK OVERLAY */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#2F4156] text-xs font-black px-4 py-2 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* ✅ LOW STOCK BADGE */}
        {!isOutOfStock && p.stock > 0 && p.stock <= 5 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
            Only {p.stock} left!
          </div>
        )}

        {/* WISHLIST */}
        <motion.button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md"
          whileTap={{ scale: 0.8 }}
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"}
          />
        </motion.button>

        {/* QUICK VIEW */}
        {hovered && !isOutOfStock && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#2F4156] text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap"
          >
            <Eye size={13} /> Quick View
          </motion.button>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4">
        <h3
          className="font-semibold text-[#2F4156] text-sm leading-snug cursor-pointer hover:underline"
          onClick={() => navigate(`/product/${p.id}`)}
        >
          {p.name}
        </h3>

        {/* RATING */}
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
            <span className="text-[11px] text-gray-400 ml-1">({p.reviews})</span>
          </div>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`font-bold text-base ${isOutOfStock ? "text-gray-400" : "text-[#2F4156]"}`}>
            ₹{p.price}
          </span>
          {p.originalPrice && !isOutOfStock && (
            <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
          )}
          {p.originalPrice && !isOutOfStock && (
            <span className="text-xs text-green-600 font-semibold">
              Save ₹{p.originalPrice - p.price}
            </span>
          )}
        </div>

        {/* SIZES — out of stock pe disable */}
        {p.sizes && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {p.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) setSelSize(size); }}
                disabled={isOutOfStock}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium transition-all duration-200 ${
                  isOutOfStock
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                    : selSize === size
                    ? "bg-[#2F4156] text-white border-[#2F4156] scale-105"
                    : "bg-white text-[#2F4156] border-[#c8d9e6] hover:border-[#2F4156]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* ✅ LOW STOCK WARNING TEXT */}
        {!isOutOfStock && p.stock > 0 && p.stock <= 5 && (
          <p className="text-orange-500 text-xs font-semibold mt-2">
            ⚠️ Only {p.stock} left!
          </p>
        )}

        {/* ADD TO CART */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : added
              ? "bg-green-500 text-white"
              : "bg-[#2F4156] text-white hover:bg-[#3e566e]"
          }`}
          whileTap={{ scale: isOutOfStock ? 1 : 0.97 }}
        >
          {isOutOfStock
            ? "Out of Stock"
            : added
            ? <>✓ Added to Cart!</>
            : <><ShoppingCart size={14} /> Add to Cart</>
          }
        </motion.button>
      </div>
    </motion.div>
  );
}
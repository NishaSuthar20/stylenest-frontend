import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, SlidersHorizontal, Eye, Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";

export default function Products() {
  const { showToast } = useToast();
  const { gender, category } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);

  const [sortBy, setSortBy] = useState("default");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedIds, setAddedIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [quickView, setQuickView] = useState(null);

  // ✅ FIXED: all ho toh koi filter nahi
  let filteredProducts = products.filter((p) => {
    const genderMatch = gender === "all" ? true : p.gender === gender;
    const categoryMatch = category === "all" ? true : p.category === category;
    return genderMatch && categoryMatch;
  });

  if (sortBy === "low")    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  if (sortBy === "high")   filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);

  // ✅ Related products
  const relatedProducts = products
    .filter((p) => {
      const sameGender = gender === "all" ? true : p.gender === gender;
      const diffCategory = category === "all" ? true : p.category !== category;
      return sameGender && diffCategory;
    })
    .slice(0, 4);

    const toggleWishlist = (p) => {
    if (wishlist.find((i) => i.id === p.id)) {
      removeFromWishlist(p.id);
      showToast(`${p.name} removed from wishlist`, "info");  // ✅
    } else {
      addToWishlist(p);
      showToast(`${p.name} added to wishlist! ❤️`, "wishlist");  // ✅
    }
  };

  const handleAddToCart = (p) => {
    addToCart({ ...p, selectedSize: selectedSizes[p.id] || p.sizes?.[0] });
    showToast(`${p.name} added to cart!`, "cart"); 
    setAddedIds((prev) => [...prev, p.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== p.id)), 1500);
  };

  const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

  const categoryLabel =
    category === "all"
      ? gender === "all"
        ? "All Products"
        : gender.charAt(0).toUpperCase() + gender.slice(1) + "'s Collection"
      : category
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  const genderLabel =
    gender === "all" ? "All" : gender.charAt(0).toUpperCase() + gender.slice(1);

  const features = [
    { icon: Truck,       title: "Free Delivery",  desc: "On orders above ₹999", color: "bg-blue-50",   iconColor: "text-blue-500"   },
    { icon: RefreshCcw,  title: "Easy Returns",   desc: "7 days return policy", color: "bg-green-50",  iconColor: "text-green-500"  },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% safe checkout",   color: "bg-purple-50", iconColor: "text-purple-500" },
    { icon: Headphones,  title: "24/7 Support",   desc: "We are here to help",  color: "bg-orange-50", iconColor: "text-orange-500" },
  ];

  return (
    <motion.div
      className="min-h-screen"
      style={{ background: "var(--beige, #f5efeb)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="px-6 py-8">

        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#3e566e] mb-1 font-medium">
              {genderLabel}'s Collection
            </p>
            <h1 className="text-3xl font-bold text-[#2F4156] tracking-tight">
              {categoryLabel}
              <span className="ml-3 text-base font-normal text-gray-400">
                ({filteredProducts.length} items)
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#c8d9e6] rounded-full px-4 py-2 shadow-sm">
            <SlidersHorizontal size={15} className="text-[#3e566e]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm text-[#2F4156] outline-none bg-transparent cursor-pointer font-medium"
            >
              <option value="default">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* ── PRODUCTS GRID ── */}
        {filteredProducts.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-32 text-lg"
          >
            No products found 😕
          </motion.p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8eef2] relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i < 8 ? i * 0.06 : 0 }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(47,65,86,0.15)" }}
              >

                {/* ✅ IMAGE SECTION — click pe product detail page */}
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

                  {p.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      {discount(p.originalPrice, p.price)}% OFF
                    </div>
                  )}

                  {/* ✅ OUT OF STOCK OVERLAY */}
{p.stock === 0 && (
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
    <span className="bg-white text-[#2F4156] text-xs font-black px-4 py-2 rounded-full">
      Out of Stock
    </span>
  </div>
)}

{/* ✅ Low stock warning */}
{p.stock > 0 && p.stock <= 5 && (
  <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
    Only {p.stock} left!
  </div>
)}

                  {/* ✅ stopPropagation — heart click pe product page na khule */}
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md"
                    whileTap={{ scale: 0.8 }}
                  >
                    <Heart
                      size={15}
                      className={wishlist.find((i) => i.id === p.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-300"}
                    />
                  </motion.button>

                  {/* ✅ stopPropagation — Quick View click pe product page na khule */}
                  <AnimatePresence>
                    {hoveredId === p.id && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => { e.stopPropagation(); setQuickView(p); }}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#2F4156] text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                      >
                        <Eye size={13} />
                        Quick View
                      </motion.button>
                    )}
                  </AnimatePresence>
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
                        <Star key={idx} size={11}
                          className={idx < Math.floor(p.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200 fill-gray-200"}
                        />
                      ))}
                      <span className="text-[11px] text-gray-400 ml-1">({p.reviews})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-[#2F4156] text-base">₹{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                    )}
                    {p.originalPrice && (
                      <span className="text-xs text-green-600 font-semibold">
                        Save ₹{p.originalPrice - p.price}
                      </span>
                    )}
                  </div>

                  {p.sizes && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {p.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [p.id]: size }))}
                          className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium transition-all duration-200 ${
                            (selectedSizes[p.id] || p.sizes[0]) === size
                              ? "bg-[#2F4156] text-white border-[#2F4156] scale-105"
                              : "bg-white text-[#2F4156] border-[#c8d9e6] hover:border-[#2F4156]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

   <motion.button
  onClick={(e) => {
    e.stopPropagation();
    handleAddToCart(p);
  }}
  disabled={p.stock === 0}
  className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
    p.stock === 0
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : addedIds.includes(p.id)
      ? "bg-green-500 text-white"
      : "bg-[#2F4156] text-white hover:bg-[#3e566e]"
  }`}
  whileTap={{ scale: p.stock === 0 ? 1 : 0.97 }}
>
  {p.stock === 0 ? (
    "Out of Stock"
  ) : addedIds.includes(p.id) ? (
    <>✓ Added!</>
  ) : (
    <>
      <ShoppingCart size={13} />
      Add to Cart
    </>
  )}
</motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── YOU MAY ALSO LIKE ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 bg-[#2F4156] rounded-full" />
              <div>
                <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium">
                  Explore More
                </p>
                <h2 className="text-2xl font-bold text-[#2F4156]">You May Also Like</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8eef2] group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(47,65,86,0.15)" }}
                  onMouseEnter={() => setHoveredId(`rel-${p.id}`)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* ✅ Related product image bhi clickable */}
                  <div
                    className="relative bg-[#f0f5f8] overflow-hidden h-52 cursor-pointer"
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    <img
                      src={p.image}
                      className={`w-full h-full object-contain p-3 transition-transform duration-300 ${
                        hoveredId === `rel-${p.id}` ? "scale-110" : "scale-100"
                      }`}
                    />
                    {p.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {discount(p.originalPrice, p.price)}% OFF
                      </div>
                    )}
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                      className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md"
                      whileTap={{ scale: 0.8 }}
                    >
                      <Heart
                        size={15}
                        className={wishlist.find((i) => i.id === p.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-300"}
                      />
                    </motion.button>
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-semibold text-[#2F4156] text-sm cursor-pointer hover:underline"
                      onClick={() => navigate(`/product/${p.id}`)}
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[#2F4156]">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
               <motion.button
  onClick={(e) => {
    e.stopPropagation();
    handleAddToCart(p);
  }}
  disabled={p.stock === 0}
  className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
    p.stock === 0
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : addedIds.includes(p.id)
      ? "bg-green-500 text-white"
      : "bg-[#2F4156] text-white hover:bg-[#3e566e]"
  }`}
  whileTap={{ scale: p.stock === 0 ? 1 : 0.97 }}
>
  {p.stock === 0 ? (
    "Out of Stock"
  ) : addedIds.includes(p.id) ? (
    <>✓ Added!</>
  ) : (
    <>
      <ShoppingCart size={13} />
      Add to Cart
    </>
  )}
</motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── FEATURES STRIP ── */}
        <div className="mt-16 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8eef2] flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(47,65,86,0.1)" }}
              >
                <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                  <item.icon size={26} className={item.iconColor} />
                </div>
                <h3 className="font-bold text-[#2F4156] text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ── QUICK VIEW MODAL ── */}
      <AnimatePresence>
        {quickView && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQuickView(null)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-[90%] max-w-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-[#f0f5f8] md:w-1/2 flex items-center justify-center p-8 min-h-[280px]">
                  <img src={quickView.image} className="h-56 object-contain" />
                </div>

                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                  <div>
                    {quickView.originalPrice && (
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                        {discount(quickView.originalPrice, quickView.price)}% OFF
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-[#2F4156] mt-3">{quickView.name}</h2>

                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={13}
                          className={idx < Math.floor(quickView.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200 fill-gray-200"}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">({quickView.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-2xl font-bold text-[#2F4156]">₹{quickView.price}</span>
                      {quickView.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{quickView.originalPrice}</span>
                      )}
                    </div>

                    {quickView.sizes && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Select Size</p>
                        <div className="flex gap-2 flex-wrap">
                          {quickView.sizes.map((size) => (
                            <button
                              key={size}
                             onClick={(e) => {
  e.stopPropagation();
  setSelectedSizes((prev) => ({
    ...prev,
    [quickView.id]: size,
  }));
}}
                              className={`text-sm px-3 py-1 rounded-lg border font-medium transition-all ${
                                (selectedSizes[quickView.id] || quickView.sizes[0]) === size
                                  ? "bg-[#2F4156] text-white border-[#2F4156]"
                                  : "bg-white text-[#2F4156] border-gray-200 hover:border-[#2F4156]"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      onClick={() => { handleAddToCart(quickView); setQuickView(null); }}
                      className="flex-1 py-3 bg-[#2F4156] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3e566e] transition"
                      whileTap={{ scale: 0.97 }}
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </motion.button>
                    <motion.button
                      onClick={() => toggleWishlist(quickView)}
                      className="p-3 border border-[#c8d9e6] rounded-xl hover:bg-[#f0f5f8] transition"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        size={18}
                        className={wishlist.find((i) => i.id === quickView.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <Footer />

    </motion.div>
  );
}
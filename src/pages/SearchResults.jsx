import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import {
  Search, ShoppingCart, Heart, Star,
  SlidersHorizontal, X, ArrowLeft
} from "lucide-react";
import Footer from "../components/Footer";

export default function SearchResults() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);
  const [searching, setSearching] = useState(false);

  const query = new URLSearchParams(location.search).get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [sortBy,      setSortBy]      = useState("default");
  const [addedIds,    setAddedIds]    = useState([]);
  const [hoveredId,   setHoveredId]   = useState(null);
  const [filterGender, setFilterGender] = useState("all");

  // Update input when URL changes
useEffect(() => {
  setSearchInput(query);
}, [query]);

// SEARCH LOADING EFFECT
useEffect(() => {
  if (query) {
    setSearching(true);

    const timer = setTimeout(() => {
      setSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }
}, [query]);

  // Filter products
 let results = !query.trim()
  ? []
  : products.filter((p) => {
      const q = query.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.gender?.toLowerCase().includes(q)
      );
    });

  if (filterGender !== "all") {
    results = results.filter((p) => p.gender === filterGender);
  }

  if (sortBy === "low")    results = [...results].sort((a, b) => a.price - b.price);
  if (sortBy === "high")   results = [...results].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);

  const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      navigate(`/search?q=${searchInput.trim()}`);
    }
  };

  const handleAddToCart = (p) => {
    addToCart({ ...p, selectedSize: p.sizes?.[0] });
    setAddedIds((prev) => [...prev, p.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== p.id)), 1500);
  };

  const toggleWishlist = (p) => {
    wishlist.find((i) => i.id === p.id)
      ? removeFromWishlist(p.id)
      : addToWishlist(p);
  };

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* SEARCH HEADER */}
      <div className="bg-[#2F4156] px-6 py-10">
        <div className="max-w-3xl mx-auto">

          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#c8d9e6] text-sm font-semibold mb-5 hover:text-white transition"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={16} /> Back
          </motion.button>

          {/* SEARCH BAR */}
          <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-lg">
            <Search size={18} className="text-gray-400 ml-4 flex-shrink-0" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products, brands, categories..."
              className="flex-1 px-4 py-4 outline-none text-sm text-[#2F4156]"
              autoFocus
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  navigate("/search?q=");
                }}
                className="p-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => searchInput.trim() && navigate(`/search?q=${searchInput.trim()}`)}
              className="bg-[#2F4156] text-white px-6 py-4 font-semibold text-sm hover:bg-[#3e566e] transition"
            >
              Search
            </button>
          </div>

          {/* RESULT COUNT */}
          {query && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#c8d9e6] text-sm mt-4"
            >
              {results.length > 0
                ? `Found ${results.length} result${results.length > 1 ? "s" : ""} for `
                : "No results found for "
              }
              <span className="text-white font-bold">"{query}"</span>
            </motion.p>
          )}
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* FILTERS + SORT */}
       {/* RESULTS GRID */}
{searching && (
  <div className="py-20">
    <Spinner text="Searching..." />
  </div>
)}
{!searching && query && results.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

            {/* GENDER FILTER */}
            <div className="flex gap-2 bg-white border border-[#e8eef2] rounded-full p-1 shadow-sm">
              {["all", "men", "women"].map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGender(g)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    filterGender === g
                      ? "bg-[#2F4156] text-white shadow"
                      : "text-[#3e566e] hover:bg-[#f0f5f8]"
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
            

            {/* SORT */}
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
        )}

        {/* NO QUERY STATE */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center shadow-sm border border-[#e8eef2] mb-5">
              <Search size={36} className="text-[#c8d9e6]" />
            </div>
            <h2 className="text-2xl font-black text-[#2F4156]">Search StyleNest</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Search for products, brands or categories
            </p>
          </motion.div>
        )}

        {/* NO RESULTS STATE */}
        {query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center shadow-sm border border-[#e8eef2] mb-5">
              <Search size={36} className="text-[#c8d9e6]" />
            </div>
            <h2 className="text-2xl font-black text-[#2F4156]">No results found</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Try searching with different keywords
            </p>

            {/* SUGGESTIONS */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-[#3e566e] font-semibold mb-3">
                Try searching for
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {["T-Shirts", "Dresses", "Jeans", "Hoodies", "Formal", "Ethnic"].map((s) => (
                  <button
                    key={s}
                    onClick={() => navigate(`/search?q=${s}`)}
                    className="px-4 py-2 bg-white border border-[#c8d9e6] rounded-full text-sm text-[#3e566e] font-semibold hover:bg-[#2F4156] hover:text-white hover:border-[#2F4156] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS GRID */}
        {query && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {results.map((p, i) => (
              <motion.div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8eef2] relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i < 8 ? i * 0.05 : 0 }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(47,65,86,0.15)" }}
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

                  {p.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      {discount(p.originalPrice, p.price)}% OFF
                    </div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md"
                  >
                    <Heart
                      size={15}
                      className={wishlist.find((i) => i.id === p.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-300"}
                    />
                  </button>
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
                        <span
                          key={size}
                          className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#c8d9e6] text-[#2F4156] font-medium"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      addedIds.includes(p.id)
                        ? "bg-green-500 text-white"
                        : "bg-[#2F4156] text-white hover:bg-[#3e566e]"
                    }`}
                  >
                    {addedIds.includes(p.id)
                      ? <>✓ Added to Cart!</>
                      : <><ShoppingCart size={14} /> Add to Cart</>
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
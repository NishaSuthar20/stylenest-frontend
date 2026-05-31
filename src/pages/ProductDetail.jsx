import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import RecentlyViewed from "../components/RecentlyViewed";
import {
  ShoppingCart, Heart, Star, ArrowLeft,
  Truck, RefreshCcw, ShieldCheck, ChevronDown,
  ChevronUp, Share2, Check
} from "lucide-react";
import Footer from "../components/Footer";

const allReviews = [
  { name: "Rahul S.",  rating: 5, date: "12 Apr 2026", comment: "Absolutely love it! Quality is top-notch and fits perfectly. Will buy again.",         avatar: "R" },
  { name: "Priya M.",  rating: 4, date: "8 Apr 2026",  comment: "Great product, very comfortable. Delivery was fast too. Highly recommend!",            avatar: "P" },
  { name: "Arjun K.",  rating: 5, date: "1 Apr 2026",  comment: "Exceeded my expectations. The fabric is premium and looks exactly like the photos.",    avatar: "A" },
  { name: "Sneha R.",  rating: 4, date: "28 Mar 2026", comment: "Good quality and nice fit. Packaging was excellent. Size chart was accurate.",          avatar: "S" },
  { name: "Vikram T.", rating: 3, date: "20 Mar 2026", comment: "Decent product for the price. Color is slightly different from the photo but okay.",    avatar: "V" },
  { name: "Ananya D.", rating: 5, date: "15 Mar 2026", comment: "Perfect! I've ordered 3 times from StyleNest and never disappointed. Love this brand!", avatar: "A" },
];

const sizeGuide = [
  { size: "XS",  chest: "34\"", waist: "28\"", hip: "36\"" },
  { size: "S",   chest: "36\"", waist: "30\"", hip: "38\"" },
  { size: "M",   chest: "38\"", waist: "32\"", hip: "40\"" },
  { size: "L",   chest: "40\"", waist: "34\"", hip: "42\"" },
  { size: "XL",  chest: "42\"", waist: "36\"", hip: "44\"" },
  { size: "XXL", chest: "44\"", waist: "38\"", hip: "46\"" },
];

export default function ProductDetail() {
  const { showToast } = useToast();
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);

  const product = products.find((p) => p.id === Number(id));
  const [sizeGuideTab,   setSizeGuideTab]   = useState("image"); 
  const isOutOfStock = product.stock === 0;

  const [selectedSize,   setSelectedSize]   = useState(product?.sizes?.[0] || "");
  const [added,          setAdded]          = useState(false);
  const [showSizeGuide,  setShowSizeGuide]  = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [copied,         setCopied]         = useState(false);
  const [reviewForm,     setReviewForm]     = useState({ name: "", comment: "", rating: 5 });
  const [hoverStar,      setHoverStar]      = useState(0);
  const [userReviews, setUserReviews] = useState(() => {
  const saved = localStorage.getItem(`userReviews-${id}`);
  return saved ? JSON.parse(saved) : [];
});
  const [reviewSuccess,  setReviewSuccess]  = useState(false);
  const [reviews,        setReviews]        = useState(() => {
    const saved = localStorage.getItem(`reviews-${id}`);
    return saved ? JSON.parse(saved) : allReviews;
  });

  useEffect(() => {
    if (!product) return;
    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((p) => p.id !== product.id);
    const updated  = [product, ...filtered].slice(0, 10);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product]);

  useEffect(() => {
    localStorage.setItem(`reviews-${id}`, JSON.stringify(reviews));
  }, [reviews, id]);

  // ✅ User reviews bhi save karo
useEffect(() => {
  localStorage.setItem(`userReviews-${id}`, JSON.stringify(userReviews));
}, [userReviews, id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5efeb]">
        <p className="text-2xl font-bold text-[#2F4156]">Product not found 😕</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-3 bg-[#2F4156] text-white rounded-full font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.find((i) => i.id === product.id);
  const discount     = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const avgRating      = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize });
    showToast(`${product.name} added to cart!`, "cart");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 const handleReviewSubmit = () => {
  if (!reviewForm.name || !reviewForm.comment) return;
  const newReview = {
    name:    reviewForm.name,
    rating:  reviewForm.rating,
    comment: reviewForm.comment,
    date:    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    avatar:  reviewForm.name.charAt(0).toUpperCase(),
    isNew:   true, // ✅ NEW flag
  };
  setUserReviews((prev) => [newReview, ...prev]);
  setReviewForm({ name: "", comment: "", rating: 5 });
  setReviewSuccess(true);
  setTimeout(() => setReviewSuccess(false), 3000);

  // ✅ 4 second baad green hata do
  setTimeout(() => {
    setUserReviews((prev) =>
      prev.map((r, i) => i === 0 ? { ...r, isNew: false } : r)
    );
  }, 4000);
};

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* BACK BUTTON */}
      <div className="px-6 pt-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#3e566e] font-semibold text-sm hover:text-[#2F4156] transition"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
      </div>

      {/* MAIN SECTION */}
      <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">

        {/* LEFT — IMAGE */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8eef2] h-[480px] flex items-center justify-center">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-8" />
            {discount && (
              <div className="absolute top-5 left-5 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
                {discount}% OFF
              </div>
            )}

{isOutOfStock && (
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl">
    <span className="bg-white text-[#2F4156] font-black px-6 py-3 rounded-full text-sm shadow-lg">
      Out of Stock
    </span>
  </div>
)}

{/* Stock badge */}
{!isOutOfStock && product.stock <= 5 && (
  <div className="bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
    ⚠️ Only {product.stock} items left — Order soon!
  </div>
)}

            <motion.button
              onClick={handleShare}
              className="absolute top-5 right-5 bg-white border border-[#e8eef2] p-2.5 rounded-full shadow-md"
              whileTap={{ scale: 0.9 }}
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} className="text-[#3e566e]" />}
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT — DETAILS */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-5">

          <div>
            {product.brand && (
              <p className="text-xs uppercase tracking-widest text-[#3e566e] font-semibold mb-1">{product.brand}</p>
            )}
            <h1 className="text-3xl font-black text-[#2F4156] leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} size={16}
                  className={idx < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#2F4156]">{avgRating}</span>
            <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-[#2F4156]">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="bg-green-100 text-green-700 text-sm font-black px-3 py-1 rounded-full">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed">
            {product.description || `Premium quality ${product.name} crafted for comfort and style. Perfect for everyday wear with a modern fit that flatters all body types. Made with high-quality fabric that's breathable and durable.`}
          </p>

          {product.sizes && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-[#2F4156] uppercase tracking-wider">
                  Select Size
                  {selectedSize && <span className="ml-2 text-[#3e566e] normal-case tracking-normal font-semibold">— {selectedSize}</span>}
                </p>
                <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="text-xs text-[#3e566e] font-semibold underline underline-offset-2">
                  Size Guide
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-[#2F4156] text-white border-[#2F4156] scale-110 shadow-lg"
                        : "bg-white text-[#2F4156] border-[#c8d9e6] hover:border-[#2F4156]"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {sizeGuideTab === "image" && (
  <div className="p-4">
    <svg viewBox="0 0 400 300" className="w-full max-h-72" xmlns="http://www.w3.org/2000/svg">
      {/* BODY OUTLINE */}
      <ellipse cx="200" cy="60" rx="30" ry="35" fill="#c8d9e6" stroke="#2F4156" strokeWidth="2"/>
      <rect x="160" y="90" width="80" height="100" rx="10" fill="#c8d9e6" stroke="#2F4156" strokeWidth="2"/>
      <rect x="120" y="92" width="38" height="80" rx="8" fill="#c8d9e6" stroke="#2F4156" strokeWidth="2"/>
      <rect x="242" y="92" width="38" height="80" rx="8" fill="#c8d9e6" stroke="#2F4156" strokeWidth="2"/>
      <rect x="163" y="188" width="32" height="90" rx="8" fill="#c8d9e6" stroke="#2F4156" strokeWidth="2"/>
      <rect x="205" y="188" width="32" height="90" rx="8" fill="#c8d9e6" stroke="#2F4156" strokeWidth="2"/>

      {/* CHEST LINE */}
      <line x1="90" y1="105" x2="155" y2="105" stroke="#e74c3c" strokeWidth="1.5" strokeDasharray="4"/>
      <line x1="245" y1="105" x2="310" y2="105" stroke="#e74c3c" strokeWidth="1.5" strokeDasharray="4"/>
      <text x="75" y="102" fontSize="10" fill="#e74c3c" fontWeight="bold">Chest</text>
      <text x="312" y="102" fontSize="10" fill="#e74c3c">←→</text>

      {/* WAIST LINE */}
      <line x1="95" y1="145" x2="158" y2="145" stroke="#3498db" strokeWidth="1.5" strokeDasharray="4"/>
      <line x1="242" y1="145" x2="305" y2="145" stroke="#3498db" strokeWidth="1.5" strokeDasharray="4"/>
      <text x="75" y="142" fontSize="10" fill="#3498db" fontWeight="bold">Waist</text>
      <text x="307" y="142" fontSize="10" fill="#3498db">←→</text>

      {/* HIP LINE */}
      <line x1="90" y1="185" x2="158" y2="185" stroke="#27ae60" strokeWidth="1.5" strokeDasharray="4"/>
      <line x1="242" y1="185" x2="310" y2="185" stroke="#27ae60" strokeWidth="1.5" strokeDasharray="4"/>
      <text x="78" y="182" fontSize="10" fill="#27ae60" fontWeight="bold">Hip</text>
      <text x="312" y="182" fontSize="10" fill="#27ae60">←→</text>

      {/* SIZE TABLE */}
      <rect x="20" y="230" width="360" height="60" rx="8" fill="#f0f5f8" stroke="#c8d9e6" strokeWidth="1"/>
      <text x="35"  y="248" fontSize="10" fill="#2F4156" fontWeight="bold">SIZE</text>
      <text x="95"  y="248" fontSize="10" fill="#2F4156" fontWeight="bold">XS</text>
      <text x="140" y="248" fontSize="10" fill="#2F4156" fontWeight="bold">S</text>
      <text x="185" y="248" fontSize="10" fill="#2F4156" fontWeight="bold">M</text>
      <text x="230" y="248" fontSize="10" fill="#2F4156" fontWeight="bold">L</text>
      <text x="275" y="248" fontSize="10" fill="#2F4156" fontWeight="bold">XL</text>
      <text x="315" y="248" fontSize="10" fill="#2F4156" fontWeight="bold">XXL</text>

      <text x="35"  y="265" fontSize="9" fill="#e74c3c">Chest</text>
      <text x="90"  y="265" fontSize="9" fill="#555">34"</text>
      <text x="135" y="265" fontSize="9" fill="#555">36"</text>
      <text x="180" y="265" fontSize="9" fill="#555">38"</text>
      <text x="225" y="265" fontSize="9" fill="#555">40"</text>
      <text x="270" y="265" fontSize="9" fill="#555">42"</text>
      <text x="310" y="265" fontSize="9" fill="#555">44"</text>

      <text x="35"  y="280" fontSize="9" fill="#3498db">Waist</text>
      <text x="90"  y="280" fontSize="9" fill="#555">28"</text>
      <text x="135" y="280" fontSize="9" fill="#555">30"</text>
      <text x="180" y="280" fontSize="9" fill="#555">32"</text>
      <text x="225" y="280" fontSize="9" fill="#555">34"</text>
      <text x="270" y="280" fontSize="9" fill="#555">36"</text>
      <text x="310" y="280" fontSize="9" fill="#555">38"</text>
    </svg>
  </div>
)}
                 
              
              </AnimatePresence>
            </div>
          )}

          <div className="flex gap-3">
        {/* Add to Cart button */}
<motion.button
  onClick={isOutOfStock ? undefined : handleAddToCart}
  disabled={isOutOfStock}
  className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
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
    ? <><Check size={18} /> Added to Cart!</>
    : <><ShoppingCart size={18} /> Add to Cart</>
  }
</motion.button>

            <motion.button
              onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                isWishlisted ? "bg-red-50 border-red-200" : "bg-white border-[#c8d9e6] hover:border-red-300"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck,       label: "Free Delivery", sub: "Above ₹999"    },
              { icon: RefreshCcw,  label: "Easy Returns",  sub: "7 days policy" },
              { icon: ShieldCheck, label: "Secure Pay",    sub: "100% safe"     },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 text-center border border-[#e8eef2] shadow-sm">
                <item.icon size={18} className="text-[#3e566e] mx-auto mb-1.5" />
                <p className="text-[#2F4156] font-bold text-xs">{item.label}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── REVIEWS SECTION ── */}
      <div className="px-6 py-10 max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium mb-1">Customer Feedback</p>
            <h2 className="text-2xl font-black text-[#2F4156]">Reviews & Ratings</h2>
          </div>
          <div className="bg-white rounded-2xl px-6 py-4 text-center border border-[#e8eef2] shadow-sm">
            <p className="text-4xl font-black text-[#2F4156]">{avgRating}</p>
            <div className="flex justify-center gap-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13}
                  className={i < Math.floor(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            <p className="text-gray-400 text-xs">{reviews.length + userReviews.length} reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* WRITE REVIEW FORM */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-[#e8eef2] shadow-sm sticky top-24">
              <h3 className="font-black text-[#2F4156] text-lg mb-5">Write a Review</h3>

              <div className="mb-4">
                <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-2 block">Your Name</label>
                <input
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-2 block">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        size={28}
                        className={star <= (hoverStar || reviewForm.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-[#2F4156] self-center">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoverStar || reviewForm.rating]}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-2 block">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa] resize-none"
                />
              </div>

              <AnimatePresence>
                {reviewSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
                  >
                    <Check size={16} /> Review submitted successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleReviewSubmit}
                disabled={!reviewForm.name || !reviewForm.comment}
                className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                  reviewForm.name && reviewForm.comment
                    ? "bg-[#2F4156] text-white hover:bg-[#3e566e]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                whileTap={{ scale: reviewForm.name && reviewForm.comment ? 0.97 : 1 }}
              >
                Submit Review
              </motion.button>
            </div>
          </div>

          {/* REVIEW CARDS */}
          <div className="lg:col-span-2">

            {/* USER NEW REVIEWS */}
            {userReviews.map((review, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4 }}
    className={`rounded-2xl p-5 border shadow-sm mb-4 transition-all duration-1000 ${
      review.isNew
        ? "bg-[#f0fff4] border-green-200"      // ✅ Green jab naya ho
        : "bg-white border-[#e8eef2]"           // ✅ Normal baad mein
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 transition-all duration-1000 ${
        review.isNew ? "bg-green-500" : "bg-[#2F4156]"
      }`}>
        {review.avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-[#2F4156] text-sm">{review.name}</p>
          {/* ✅ NEW badge sirf green hone tak dikhega */}
          {review.isNew && (
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold"
            >
              NEW
            </motion.span>
          )}
        </div>
        <p className="text-gray-400 text-xs">{review.date}</p>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, idx) => (
          <Star key={idx} size={12}
            className={idx < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    <div className="mt-3 flex items-center gap-1.5">
      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
        <Check size={10} className="text-green-600" />
      </div>
      <span className="text-green-600 text-[11px] font-semibold">Verified Purchase</span>
    </div>
  </motion.div>
))}

            {/* EXISTING REVIEWS */}
            <div className="grid grid-cols-1 gap-4">
              {visibleReviews.map((review, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-[#e8eef2] shadow-sm"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#2F4156] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#2F4156] text-sm">{review.name}</p>
                      <p className="text-gray-400 text-xs">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={12}
                          className={idx < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                      <Check size={10} className="text-green-600" />
                    </div>
                    <span className="text-green-600 text-[11px] font-semibold">Verified Purchase</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="text-center mt-4">
                <motion.button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-white border border-[#c8d9e6] rounded-full text-sm font-bold text-[#2F4156] hover:bg-[#f0f5f8] transition"
                  whileHover={{ scale: 1.02 }}
                >
                  {showAllReviews
                    ? <><ChevronUp size={16} /> Show Less</>
                    : <><ChevronDown size={16} /> View All {reviews.length} Reviews</>
                  }
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="px-6 pb-12 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-[#2F4156] rounded-full" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium">More Like This</p>
              <h2 className="text-2xl font-black text-[#2F4156]">Related Products</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => (
              <motion.div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-[#e8eef2] shadow-sm cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(47,65,86,0.15)" }}
              >
                <div className="bg-[#f0f5f8] h-48 overflow-hidden flex items-center justify-center">
                  <img
                    src={p.image}
                    className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#2F4156] text-sm">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-[#2F4156]">₹{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <RecentlyViewed currentProductId={product.id} />
      <Footer />
    </div>
  );
}
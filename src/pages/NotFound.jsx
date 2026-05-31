import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center px-4 text-center">

      {/* ANIMATED 404 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <h1 className="text-[120px] md:text-[160px] font-black text-[#c8d9e6] leading-none select-none">
          404
        </h1>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ShoppingBag
            size={64}
            className="text-[#2F4156]"
            strokeWidth={1.5}
          />
        </motion.div>
      </motion.div>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-black text-[#2F4156] mb-3">
          Page Not Found!
        </h2>
       <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
  Oops! The page you're looking for doesn't exist. The link might be
  broken or the page may have been removed.
</p>
      </motion.div>

      {/* BUTTONS */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-7 py-3 bg-[#2F4156] text-white rounded-full font-bold text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Home size={16} /> Go to Home
        </motion.button>

        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-7 py-3 border-2 border-[#c8d9e6] text-[#3e566e] rounded-full font-bold text-sm hover:bg-[#f0f5f8] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={16} /> Go Back
        </motion.button>

        <motion.button
          onClick={() => navigate("/products/all/all")}
          className="flex items-center gap-2 px-7 py-3 border-2 border-[#c8d9e6] text-[#3e566e] rounded-full font-bold text-sm hover:bg-[#f0f5f8] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingBag size={16} /> Shop Now
        </motion.button>
      </motion.div>

      {/* QUICK LINKS */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
          Quick Links
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: "Men's Fashion",   path: "/products/men/t-shirts"    },
            { label: "Women's Fashion", path: "/products/women/dresses"   },
            { label: "Offers",          path: "/offers"                   },
            { label: "Wishlist",        path: "/wishlist"                 },
            { label: "My Orders",       path: "/orders"                   },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="px-4 py-1.5 bg-white border border-[#e8eef2] text-[#3e566e] rounded-full text-xs font-semibold hover:bg-[#2F4156] hover:text-white hover:border-[#2F4156] transition"
            >
              {link.label}
            </button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

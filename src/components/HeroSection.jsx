import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[88vh] overflow-hidden">

      <img
        src="heroimage.png"
        alt="fashion"
        className="w-full h-full object-cover object-top scale-105"
        style={{ animation: "zoomOut 8s ease forwards" }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="ml-10 md:ml-24 max-w-xl space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-4 py-2 rounded-full"
          >
            <ShoppingBag size={12} />
            New Collection 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight"
          >
            Upgrade Your
            <span className="block text-[#c8d9e6]">Style with</span>
            StyleNest
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-base md:text-lg"
          >
            Discover premium fashion clothing for every occasion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 flex-wrap"
          >
            {/* ✅ FIXED - ab saare products aayenge */}
            <motion.button
              onClick={() => navigate("/products/all/all")}
              className="bg-[#c8d9e6] text-[#2F4156] px-7 py-3 rounded-full font-bold text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Now <ArrowRight size={16} />
            </motion.button>

            {/* ✅ FIXED - ab saari women products aayengi */}
            <motion.button
              onClick={() => navigate("/products/women/all")}
              className="border-2 border-white/40 text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Women's Collection
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-8 pt-2"
          >
            {[["500+", "Products"], ["10k+", "Customers"], ["50+", "Brands"]].map(([num, label]) => (
              <div key={label}>
                <p className="text-white font-bold text-xl">{num}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>

    </div>
  );
}

export default HeroSection;
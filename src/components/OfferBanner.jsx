import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag, ArrowRight } from "lucide-react";
import { products } from "../data/products"; // ✅ Import products

export default function OfferBanner() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    // ✅ Sirf offer products filter karke pass karo
    const offerProducts = products.filter(product => product.isOffer === true);
    navigate("/offers", { 
      state: { filteredProducts: offerProducts, fromOffer: true } 
    });
  };

  return (
    <div className="mt-16 mx-6">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* IMAGE */}
        <img
          src="/banner/sale.png"
          className="w-full h-80 object-cover"
        />

        {/* GRADIENT OVERLAY — theme se match karta hai */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2F4156]/90 via-[#2F4156]/60 to-transparent" />

        {/* CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-center pl-10 md:pl-16">

          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full w-fit mb-4"
          >
            <Tag size={11} />
            Limited Time Offer
          </motion.div>

          {/* HEADING */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Summer Sale
            <span className="block text-[#c8d9e6]">Upto 50% OFF</span>
          </motion.h2>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mt-2 text-sm md:text-base"
          >
            Upgrade your wardrobe with StyleNest
          </motion.p>

          {/* BUTTON */}
          <motion.button
            onClick={handleShopNow}  // ✅ Fixed onClick
            className="mt-5 w-fit px-7 py-3 bg-[#c8d9e6] text-[#2F4156] rounded-full font-bold text-sm flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Shop Now <ArrowRight size={15} />
          </motion.button>

        </div>

        {/* COUPON TAG — right side */}
        <motion.div
          className="absolute top-6 right-6 bg-white rounded-2xl px-5 py-4 text-center shadow-xl hidden md:block"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <p className="text-xs text-gray-400 font-medium">Use Code</p>
          <p className="text-2xl font-black text-[#2F4156] tracking-widest">NEST20</p>
          <p className="text-xs text-green-600 font-semibold mt-1">Save 20% instantly!</p>
        </motion.div>

      </motion.div>
    </div>
  );
}
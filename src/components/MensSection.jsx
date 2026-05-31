import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function MensSection() {
  const navigate = useNavigate();

  const items = [
    { name: "T-Shirts",    image: "/mens/t-shirt.jpg",     category: "t-shirts"   },
    { name: "Shirts",      image: "/mens/shirt.jpg",       category: "shirts"     },
    { name: "Track Pants", image: "/mens/track-pant.jpg",  category: "track-pants"},
    { name: "Formal Wear", image: "/mens/formal-wear.jpg", category: "formal-wear"},
    { name: "Hoodies",     image: "/mens/hoodie.jpg",      category: "hoodies"    },
    { name: "Jeans",       image: "/mens/jeans.jpg",       category: "jeans"      },
  ];

  return (
    <div className="mt-16 px-6">

      {/* HEADING */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium mb-1">
            Shop by Category
          </p>
          <h2 className="text-3xl font-bold text-[#2F4156]">Men's Style</h2>
        </div>
        <motion.button
          onClick={() => navigate("/products/men/t-shirts")}
          className="hidden md:flex items-center gap-2 text-sm text-[#3e566e] font-semibold border border-[#c8d9e6] px-4 py-2 rounded-full hover:bg-[#c8d9e6] transition"
          whileHover={{ scale: 1.03 }}
        >
          View All <ArrowRight size={14} />
        </motion.button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {items.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(`/products/men/${item.category}`)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(47,65,86,0.2)" }}
          >
            {/* IMAGE */}
            <div className="bg-[#c8d9e6] h-64 overflow-hidden">
              <motion.img
                src={item.image}
                className="h-full w-full object-contain p-2"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* HOVER OVERLAY */}
            <div className="absolute inset-0 bg-[#2F4156]/0 group-hover:bg-[#2F4156]/20 transition-all duration-300" />

            {/* BOTTOM */}
            <div className="bg-white px-3 py-3 text-center">
              <h3 className="font-bold text-[#2F4156] text-sm">{item.name}</h3>
              <p className="text-xs text-[#3e566e] mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                Shop Now →
              </p>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
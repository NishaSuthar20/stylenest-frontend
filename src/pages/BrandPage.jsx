import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";  // ✅ FIXED
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";

export default function BrandPage() {
  const { brand }  = useParams();
  const navigate   = useNavigate();

  // ✅ Brand name display ke liye
  const brandName  = brand.charAt(0).toUpperCase() + brand.slice(1);

  // ✅ Brand se match karo — naam mein bhi dhundo
  const filtered = products.filter((p) =>
    p.brand?.toLowerCase() === brand.toLowerCase() ||
    p.name.toLowerCase().includes(brand.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* HEADER */}
      <div className="bg-[#2F4156] px-6 py-10">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#c8d9e6] text-sm font-semibold mb-4 hover:text-white transition"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={16} /> Back
        </motion.button>
        <h1 className="text-3xl font-black text-white">{brandName}</h1>
        <p className="text-[#c8d9e6] text-sm mt-1">
          {filtered.length} products found
        </p>
      </div>

      <div className="px-6 py-8">
        {filtered.length === 0 ? (
          // ✅ Empty state
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <p className="text-6xl mb-4">🏷️</p>
            <h2 className="text-2xl font-black text-[#2F4156]">
              No products found for {brandName}
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Browse our other collections!
            </p>
            <motion.button
              onClick={() => navigate("/products/all/all")}
              className="mt-6 px-6 py-3 bg-[#2F4156] text-white rounded-full font-bold text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Browse All Products
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
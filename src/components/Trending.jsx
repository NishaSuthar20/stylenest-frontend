import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Trending() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const products = [
    { id: 101, name: "Oversized T-Shirt", price: 999,  image: "/products/tshirt.jpg",  category: "t-shirts",   gender: "men"   },
    { id: 102, name: "Casual Shirt",      price: 1499, image: "/products/shirt.jpg",   category: "shirts",     gender: "men"   },
    { id: 103, name: "Track Pant",        price: 1199, image: "/products/track.jpg",   category: "track-pants",gender: "men"   },
    { id: 104, name: "Formal Suit",       price: 2999, image: "/products/formal.jpg",  category: "formal-wear",gender: "men"   },
  ];

  return (
    <div className="mt-16 px-6 py-12 bg-[#f0f5f8] rounded-3xl">

      {/* HEADING */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#2F4156] p-2 rounded-xl">
          <TrendingUp size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium">
            What's Hot
          </p>
          <h2 className="text-3xl font-bold text-[#2F4156]">Trending Now</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((p, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8eef2] group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(47,65,86,0.15)" }}
          >
            {/* IMAGE */}
            <div
              className="bg-[#f0f5f8] overflow-hidden h-52 flex items-center justify-center cursor-pointer"
              onClick={() => navigate(`/product/${p.id}`)}
              onClick={() => navigate(`/products/${p.gender}/${p.category}`)}
            >
              <motion.img
                src={p.image}
                className="h-full w-full object-contain p-3"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* DETAILS */}
            <div className="p-4">
              <h3 className="font-bold text-[#2F4156] text-sm">{p.name}</h3>
              <p className="font-bold text-[#3e566e] text-base mt-1">₹{p.price}</p>

              <motion.button
                onClick={() => {
  addToCart(p);
  showToast(`${p.name} added to cart!`, "cart");
}}
                className="mt-3 w-full py-2 bg-[#2F4156] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                whileHover={{ backgroundColor: "#3e566e" }}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart size={13} />
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
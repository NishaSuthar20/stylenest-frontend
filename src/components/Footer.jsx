import { Mail, Phone, MapPin, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 bg-[#1e2f3f] text-white">

      {/* TOP SECTION */}
      <div className="px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shirt size={22} className="text-[#c8d9e6]" />
            <h2 className="text-xl font-bold">
              <span className="text-white">Style</span>
              <span className="text-[#c8d9e6]">Nest</span>
            </h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Elevate your fashion with modern styles. Premium clothing for every occasion.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3 mt-5">
            {[
              { label: "Email",   icon: "✉️" },
              { label: "YouTube", icon: "▶️" },
              { label: "Chat",    icon: "💬" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#c8d9e6]/20 transition text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-bold text-base mb-4 text-[#c8d9e6]">Quick Links</h3>
          <div className="space-y-2">
            {[
              { label: "Home",         path: "/"                       },
              { label: "Men's Shop",   path: "/products/men/t-shirts"  },
              { label: "Women's Shop", path: "/products/women/dresses" },
              { label: "Cart",         path: "/cart"                   },
              { label: "Wishlist",     path: "/wishlist"               },
            ].map((link) => (
              <p
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-sm text-gray-400 hover:text-[#c8d9e6] transition cursor-pointer hover:translate-x-1 transform duration-200"
              >
                → {link.label}
              </p>
            ))}
          </div>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h3 className="font-bold text-base mb-4 text-[#c8d9e6]">Customer Care</h3>
          <div className="space-y-2">
            {[
              "Contact Us",
              "Returns & Refunds",
              "Shipping Policy",
              "Size Guide",
              "FAQs",
            ].map((item) => (
              <p
                key={item}
                onClick={() => navigate("/support")}
                className="text-sm text-gray-400 hover:text-[#c8d9e6] transition cursor-pointer hover:translate-x-1 transform duration-200"
              >
                → {item}
              </p>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-bold text-base mb-4 text-[#c8d9e6]">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Mail size={14} className="text-[#c8d9e6]" />
              </div>
              <p className="text-sm text-gray-400">support@stylenest.in</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Phone size={14} className="text-[#c8d9e6]" />
              </div>
              <p className="text-sm text-gray-400">+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <MapPin size={14} className="text-[#c8d9e6]" />
              </div>
              <p className="text-sm text-gray-400">Mumbai, Maharashtra</p>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-gray-500">© 2026 StyleNest. All rights reserved.</p>
        <div className="flex gap-4">
          <p className="text-xs text-gray-500 hover:text-[#c8d9e6] cursor-pointer transition">
            Privacy Policy
          </p>
          <p className="text-xs text-gray-500 hover:text-[#c8d9e6] cursor-pointer transition">
            Terms of Service
          </p>
        </div>
      </div>

    </footer>
  );
}
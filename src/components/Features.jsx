import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const data = [
    {
      icon: Truck,
      title: "Free Delivery",
      desc: "On all orders above ₹999",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-100",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      desc: "7 days return policy",
      color: "bg-green-50",
      iconColor: "text-green-500",
      borderColor: "border-green-100",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "100% safe checkout",
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      borderColor: "border-purple-100",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "We are here to help",
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      borderColor: "border-orange-100",
    },
  ];

  return (
    <div className="mt-16 px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, i) => (
          <motion.div
            key={i}
            className={`bg-white rounded-2xl p-5 shadow-sm border ${item.borderColor} flex flex-col items-center text-center`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(47,65,86,0.1)" }}
          >
            {/* ICON */}
            <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
              <item.icon size={26} className={item.iconColor} />
            </div>

            <h3 className="font-bold text-[#2F4156] text-sm">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
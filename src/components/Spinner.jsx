import { motion } from "framer-motion";

export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center gap-4">

      {/* SPINNER */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#c8d9e6]"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2F4156]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#2F4156] rounded-full" />
        </div>
      </div>

      {/* TEXT */}
      <motion.p
        className="text-[#3e566e] text-sm font-semibold"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {text}
      </motion.p>

    </div>
  );
}
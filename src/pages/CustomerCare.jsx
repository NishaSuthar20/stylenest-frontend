import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MessageCircle, ChevronDown,
  Clock, MapPin, Send, Headphones, CheckCircle
} from "lucide-react";

const faqs = [
  { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also check your order status under 'My Orders' in your profile." },
  { q: "What is the return policy?", a: "We offer a 30-day easy return policy. Items must be unused, unwashed, and in original packaging. Simply raise a return request from your orders page." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available at checkout for select pincodes." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 24 hours of placing. After that, the order enters processing and cannot be changed." },
  { q: "Are the sizes true to fit?", a: "We recommend checking our size guide on each product page. If you're between sizes, we suggest going one size up for a comfortable fit." },
  { q: "How do I apply a coupon code?", a: "On the checkout page, you'll find a 'Apply Coupon' field. Enter your code and click apply to see the discount reflected in your total." },
];

const contactCards = [
  { icon: Phone,         label: "Call Us",   value: "+91 98765 43210",      sub: "Mon–Sat, 9AM–7PM",   color: "bg-blue-50",   iconColor: "text-blue-500"   },
  { icon: Mail,          label: "Email Us",  value: "support@stylenest.in", sub: "Reply within 24hrs", color: "bg-purple-50", iconColor: "text-purple-500" },
  { icon: MessageCircle, label: "Live Chat", value: "Chat with us",         sub: "Available 24/7",     color: "bg-green-50",  iconColor: "text-green-500"  },
];

export default function CustomerCare() {
  const [openFaq, setOpenFaq]     = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm]           = useState({ name: "", email: "", message: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all details before sending!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f5efeb]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      {/* ── HERO ── */}
      <div className="bg-[#2F4156] text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-[-60px] left-[-60px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-white/5 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Headphones size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">How can we help you?</h1>
          <p className="text-[#c8d9e6] text-sm md:text-base max-w-md mx-auto">
            We're here for you 24/7. Reach out to us anytime — we'd love to hear from you.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* ── CONTACT CARDS ── */}
        <div>
          <motion.h2
            className="text-xl font-bold text-[#2F4156] mb-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Get In Touch
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactCards.map((card, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8eef2] text-center cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(47,65,86,0.12)" }}
              >
                <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <card.icon size={22} className={card.iconColor} />
                </div>
                <h3 className="font-bold text-[#2F4156] text-sm">{card.label}</h3>
                <p className="text-[#3e566e] font-semibold text-sm mt-1">{card.value}</p>
                <p className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
                  <Clock size={10} /> {card.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ + FORM ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-[#2F4156] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8eef2] shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-[#2F4156] text-sm pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={18} className="text-[#3e566e]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-[#f0f5f8] pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-[#2F4156] mb-5">Send Us a Message</h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8eef2] space-y-4">

              <div>
                <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                  Your Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                  Email Address
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa] resize-none"
                />
              </div>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl text-center"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* BUTTON */}
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full py-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Message sent! We'll reply within 24hrs.
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    onClick={handleSubmit}
                    className="w-full py-3 bg-[#2F4156] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    whileHover={{ backgroundColor: "#3e566e", scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Send size={15} />
                    Send Message
                  </motion.button>
                )}
              </AnimatePresence>

            </div>

            {/* STORE INFO */}
            <motion.div
              className="bg-[#2F4156] rounded-2xl p-5 mt-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/10 p-2 rounded-xl flex-shrink-0">
                <MapPin size={18} className="text-[#c8d9e6]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">StyleNest HQ</p>
                <p className="text-[#c8d9e6] text-xs mt-0.5 leading-relaxed">
                  12, Fashion Street, Bandra West<br />
                  Mumbai, Maharashtra — 400050
                </p>
                <p className="text-[#c8d9e6] text-xs mt-2 flex items-center gap-1">
                  <Clock size={11} /> Mon–Sat: 10AM – 7PM
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
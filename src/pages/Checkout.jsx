import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../api";
import {
  MapPin, CreditCard, ShoppingBag,
  CheckCircle, ChevronDown, ChevronUp, Truck
} from "lucide-react";

const COUNTRIES = [
  { code: "+91",  flag: "🇮🇳", name: "India"          },
  { code: "+1",   flag: "🇺🇸", name: "USA"            },
  { code: "+44",  flag: "🇬🇧", name: "UK"             },
  { code: "+61",  flag: "🇦🇺", name: "Australia"      },
  { code: "+971", flag: "🇦🇪", name: "UAE"            },
  { code: "+65",  flag: "🇸🇬", name: "Singapore"      },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia"       },
  { code: "+1",   flag: "🇨🇦", name: "Canada"         },
  { code: "+49",  flag: "🇩🇪", name: "Germany"        },
  { code: "+33",  flag: "🇫🇷", name: "France"         },
  { code: "+81",  flag: "🇯🇵", name: "Japan"          },
  { code: "+86",  flag: "🇨🇳", name: "China"          },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan"       },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh"     },
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka"      },
  { code: "+977", flag: "🇳🇵", name: "Nepal"          },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

export default function Checkout() {
  const { cart, subtotal, discount, totalPrice, appliedCoupon, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

const [address, setAddress] = useState(() => {
  const saved = localStorage.getItem("lastAddress");
  if (saved) return JSON.parse(saved);
  return {
    name:    user?.name || "",
    phone:   "",
    street:  "",
    city:    "",
    state:   "",
    pincode: "",
  };
});

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 15) {
      setAddress({ ...address, phone: val });
    }
  };

  const validateAddress = () => {
    if (!address.name || !address.phone || !address.street ||
        !address.city || !address.state || !address.pincode) {
      setError("Please fill in all address fields!");
      setTimeout(() => setError(""), 3000);
      return false;
    }
    if (address.phone.length < 7) {
      setError("Please enter a valid phone number!");
      setTimeout(() => setError(""), 3000);
      return false;
    }
    if (address.pincode.length < 4) {
      setError("Please enter a valid pincode!");
      setTimeout(() => setError(""), 3000);
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
  if (!user) { navigate("/login"); return; }
  setLoading(true);

  try {
    // ── CASH ON DELIVERY ──
    if (paymentMethod === "Cash on Delivery") {
      const res  = await fetch(`${API_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items, totalAmount: subtotal, discount,
          finalAmount: totalPrice, couponUsed: appliedCoupon?.code || "",
          address, paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("lastAddress", JSON.stringify(address));
        clearCart();
        setStep(3);
      } else {
        setError(data.message);
        setTimeout(() => setError(""), 3000);
      }
      setLoading(false);
      return;
    }

    // ── ONLINE PAYMENT (UPI / Card / Net Banking) ──

    // Step 1: Backend se Razorpay order banao
    const orderRes  = await fetch(`${API_URL}/api/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: totalPrice }),
    });
    const orderData = await orderRes.json();

    if (!orderData.success) {
      setError("Payment initialization failed!");
      setLoading(false);
      return;
    }

    // Step 2: Razorpay checkout kholo
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:      orderData.order.amount,
      currency:    "INR",
      name:        "StyleNest",
      description: "Fashion Purchase",
      order_id:    orderData.order.id,

      handler: async (response) => {
        // Step 3: Payment verify karo
        const verifyRes  = await fetch(`${API_URL}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          // Step 4: Order place karo
          const placeRes  = await fetch(`${API_URL}/api/orders/place`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: cart,
              totalAmount:  subtotal,
              discount,
              finalAmount:  totalPrice,
              couponUsed:   appliedCoupon?.code || "",
              address,
              paymentMethod,
              paymentId:    response.razorpay_payment_id, // ✅ Payment ID save
            }),
          });

          if (placeRes.ok) {
            localStorage.setItem("lastAddress", JSON.stringify(address));
            clearCart();
            setStep(3);
          }
        } else {
          setError("Payment verification failed!");
          setTimeout(() => setError(""), 3000);
        }
      },

      prefill: {
        name:    user?.name  || "",
        contact: address.phone ? `+91${address.phone}` : "",
      },

      theme: { color: "#2F4156" }, // ✅ StyleNest color

      modal: {
        ondismiss: () => {
          setError("Payment cancelled!");
          setTimeout(() => setError(""), 3000);
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    setError("Server error! Make sure backend is running.");
    setTimeout(() => setError(""), 3000);
  }
  setLoading(false);
};

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={64} className="text-[#c8d9e6]" strokeWidth={1.2} />
        <h2 className="text-xl font-bold text-[#2F4156]">Your cart is empty!</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#2F4156] text-white rounded-full text-sm font-semibold"
        >
          Shop Now
        </button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <motion.div
        className="min-h-screen bg-[#f5efeb] flex flex-col items-center justify-center gap-5 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center"
        >
          <CheckCircle size={52} className="text-green-500" />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-[#2F4156]">Order Placed! 🎉</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Thank you {user?.name}! Your order has been placed successfully.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            You'll receive a confirmation shortly.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-sm border border-[#e8eef2]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Payment</span>
            <span className="font-semibold text-[#2F4156]">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Delivery to</span>
            <span className="font-semibold text-[#2F4156]">{address.city}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
            <span className="text-[#2F4156]">Total Paid</span>
            <span className="text-[#2F4156]">₹{totalPrice}</span>
          </div>
        </motion.div>

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 bg-[#2F4156] text-white rounded-full text-sm font-semibold"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-[#c8d9e6] text-[#3e566e] rounded-full text-sm font-semibold"
          >
            Continue Shopping
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#f5efeb] px-4 md:px-10 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#3e566e] font-medium mb-1">
          Almost there!
        </p>
        <h1 className="text-3xl font-bold text-[#2F4156]">Checkout</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {["Address", "Payment"].map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step > idx + 1
                ? "bg-green-500 text-white"
                : step === idx + 1
                ? "bg-[#2F4156] text-white"
                : "bg-gray-200 text-gray-400"
            }`}>
              {step > idx + 1 ? "✓" : idx + 1}
            </div>
            <span className={`text-sm font-medium ${step === idx + 1 ? "text-[#2F4156]" : "text-gray-400"}`}>
              {s}
            </span>
            {idx < 1 && <div className={`w-12 h-0.5 ${step > 1 ? "bg-green-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full">

          {step === 1 && (
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8eef2]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-bold text-[#2F4156] text-lg flex items-center gap-2 mb-5">
                <MapPin size={18} /> Delivery Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* NAME */}
                <div>
                  <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                  />
                </div>

                {/* PHONE WITH COUNTRY SELECTOR */}
               {/* PHONE WITH +91 FIXED */}
<div>
  <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
    Phone Number
  </label>
  <div className="flex items-center border border-[#e8eef2] rounded-xl overflow-hidden focus-within:border-[#3e566e] transition bg-[#fafafa]">
    <span className="px-3 py-3 bg-[#f0f5f8] border-r border-[#e8eef2] text-sm font-bold text-[#2F4156] flex items-center gap-1.5 flex-shrink-0">
      🇮🇳 +91
    </span>
    <input
      type="tel"
      value={address.phone}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, "");
        if (val.length <= 10) setAddress({ ...address, phone: val });
      }}
      placeholder="10 digit number"
      maxLength={10}
      className="flex-1 px-3 py-3 outline-none text-sm bg-transparent text-[#2F4156]"
    />
  </div>
  {address.phone.length > 0 && !/^[6-9]/.test(address.phone) && (
    <p className="text-red-500 text-xs mt-1">
      ⚠️ Number must start with 6, 7, 8 or 9!
    </p>
  )}
  {address.phone.length > 0 && /^[6-9]/.test(address.phone) && address.phone.length < 10 && (
    <p className="text-orange-400 text-xs mt-1">
      {10 - address.phone.length} more digits required
    </p>
  )}
  {address.phone.length === 10 && /^[6-9]/.test(address.phone) && (
    <p className="text-green-500 text-xs mt-1">✓ Valid mobile number</p>
  )}
</div>

                {/* STREET */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                    Street Address
                  </label>
                  <input
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="House no, Street..."
                    className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                  />
                </div>

                {/* CITY */}
                <div>
                  <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                    City
                  </label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                  />
                </div>

                {/* STATE DROPDOWN */}
                <div>
                  <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                    State
                  </label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa] text-[#2F4156] cursor-pointer"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* PINCODE */}
                <div>
                  <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                    Pincode
                  </label>
                  <input
                    value={address.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 6) setAddress({ ...address, pincode: val });
                    }}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8eef2] text-sm outline-none focus:border-[#3e566e] transition bg-[#fafafa]"
                  />
                  {address.pincode.length > 0 && address.pincode.length < 6 && (
                    <p className="text-orange-400 text-xs mt-1">
                      {6 - address.pincode.length} more digits required
                    </p>
                  )}
                </div>

              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl text-center mt-4"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => { if (validateAddress()) setStep(2); }}
                className="mt-5 w-full py-3 bg-[#2F4156] text-white rounded-xl font-semibold text-sm"
                whileHover={{ backgroundColor: "#3e566e", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue to Payment →
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8eef2]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-bold text-[#2F4156] text-lg flex items-center gap-2 mb-5">
                <CreditCard size={18} /> Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  { label: "Cash on Delivery",    desc: "Pay when your order arrives", icon: "💵" },
                  { label: "UPI",                 desc: "GPay, PhonePe, Paytm",        icon: "📱" },
                  { label: "Credit / Debit Card", desc: "Visa, Mastercard etc.",       icon: "💳" },
                  { label: "Net Banking",         desc: "All major banks supported",   icon: "🏦" },
                ].map((method) => (
                  <motion.div
                    key={method.label}
                    onClick={() => setPaymentMethod(method.label)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.label
                        ? "border-[#2F4156] bg-[#f0f5f8]"
                        : "border-[#e8eef2] hover:border-[#c8d9e6]"
                    }`}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#2F4156] text-sm">{method.label}</p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.label
                        ? "border-[#2F4156] bg-[#2F4156]"
                        : "border-gray-300"
                    }`}>
                      {paymentMethod === method.label && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 bg-[#f0f5f8] rounded-xl p-4 flex items-center gap-3">
                <Truck size={18} className="text-[#3e566e]" />
                <div>
                  <p className="text-sm font-semibold text-[#2F4156]">Free Delivery</p>
                  <p className="text-xs text-gray-400">Expected in 3-5 business days</p>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl text-center mt-4"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-[#c8d9e6] text-[#3e566e] rounded-xl text-sm font-semibold"
                >
                  ← Back
                </button>
                <motion.button
                  onClick={placeOrder}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#2F4156] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  whileHover={{ backgroundColor: "#3e566e", scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  ) : (
                    "Place Order 🎉"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <motion.div
          className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-[#e8eef2] overflow-hidden lg:sticky lg:top-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-[#2F4156] px-5 py-4">
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <ShoppingBag size={16} /> Order Summary
            </h2>
          </div>

          <div className="px-5 py-4 space-y-3">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full flex items-center justify-between text-sm font-semibold text-[#2F4156]"
            >
              <span>{cart.length} item{cart.length > 1 ? "s" : ""}</span>
              {showSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <img src={item.image} className="h-10 w-10 object-contain bg-[#f0f5f8] rounded-lg p-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#2F4156] truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">× {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-[#2F4156]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <hr className="border-[#e8eef2]" />

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-semibold text-[#2F4156]">₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600 font-semibold">− ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery</span>
              <span className="text-green-600 font-semibold">Free 🎉</span>
            </div>

            <hr className="border-[#e8eef2]" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-[#2F4156]">Total</span>
              <span className="font-bold text-[#2F4156] text-xl">₹{totalPrice}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
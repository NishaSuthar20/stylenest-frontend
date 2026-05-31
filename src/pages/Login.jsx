import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import API_URL from "../api";
export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setTimeout(() => setError(""), 3000);
      } else {
        login(data.user, data.token);
        navigate("/");
      }
    } catch (err) {
      setError("Server error! Make sure backend is running.");
      setTimeout(() => setError(""), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5efeb] flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-3xl shadow-lg w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* TOP BAR */}
        <div className="bg-[#2F4156] px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
          <p className="text-[#c8d9e6] text-sm mt-1">Login to your StyleNest account</p>
        </div>

        <div className="px-8 py-7 space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
              Email Address
            </label>
            <div className="flex items-center border border-[#e8eef2] rounded-xl px-4 py-3 gap-3 focus-within:border-[#3e566e] transition bg-[#fafafa]">
              <Mail size={16} className="text-[#3e566e]" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-semibold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <div className="flex items-center border border-[#e8eef2] rounded-xl px-4 py-3 gap-3 focus-within:border-[#3e566e] transition bg-[#fafafa]">
              <Lock size={16} className="text-[#3e566e]" />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="flex-1 outline-none text-sm bg-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button onClick={() => setShowPass(!showPass)}>
                {showPass
                  ? <EyeOff size={16} className="text-gray-400" />
                  : <Eye size={16} className="text-gray-400" />
                }
              </button>
            </div>
          </div>

          {/* ERROR */}
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

          {/* LOGIN BUTTON */}
          <motion.button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-[#2F4156] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            whileHover={{ backgroundColor: "#3e566e", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            ) : (
              <>
                <LogIn size={15} />
                Login
              </>
            )}
          </motion.button>

          {/* SIGNUP LINK */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#3e566e] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../api";
import {
  User, Mail, MapPin,
  Plus, Trash2, Check, ArrowLeft, Edit2,
  Phone, Home, Building2, Save
} from "lucide-react";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  // ── PROFILE EDIT ──
  const [profileForm, setProfileForm]       = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError,   setProfileError]   = useState("");

  // ── ADDRESSES ──
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Home",
      name: user?.name || "",
      phone: "9876543210",
      line1: "12, Green Park Colony",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrSuccess, setAddrSuccess] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "Home", name: "", phone: "",
    line1: "", city: "", state: "", pincode: "", isDefault: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5efeb] gap-4">
        <User size={60} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-[#2F4156]">Please login first!</h2>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-[#2F4156] text-white rounded-full font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ── PROFILE SAVE ──
  const handleProfileSave = async () => {
    if (!profileForm.name || !profileForm.email) {
      setProfileError("Name aur email required hai!");
      setTimeout(() => setProfileError(""), 3000);
      return;
    }
    setProfileLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok) {
        login({ ...user, name: profileForm.name, email: profileForm.email }, token);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError(data.message || "Update failed!");
        setTimeout(() => setProfileError(""), 3000);
      }
    } catch {
      login({ ...user, name: profileForm.name, email: profileForm.email }, token);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setProfileLoading(false);
  };

  // ── ADDRESS FUNCTIONS ──
  const handleAddressSave = () => {
    if (!newAddr.name || !newAddr.phone || !newAddr.line1 || !newAddr.city || !newAddr.pincode) {
      return;
    }
    if (editingAddr !== null) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddr ? { ...newAddr, id: editingAddr } : a))
      );
      setEditingAddr(null);
    } else {
      const id = Date.now();
      if (newAddr.isDefault) {
        setAddresses((prev) => [
          ...prev.map((a) => ({ ...a, isDefault: false })),
          { ...newAddr, id },
        ]);
      } else {
        setAddresses((prev) => [...prev, { ...newAddr, id }]);
      }
    }
    setNewAddr({
      label: "Home", name: "", phone: "",
      line1: "", city: "", state: "", pincode: "", isDefault: false,
    });
    setShowAddForm(false);
    setAddrSuccess(true);
    setTimeout(() => setAddrSuccess(false), 2000);
  };

  const handleEditAddress = (addr) => {
    setNewAddr(addr);
    setEditingAddr(addr.id);
    setShowAddForm(true);
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const tabs = [
    { id: "profile",   label: "My Profile", icon: User   },
    { id: "addresses", label: "Addresses",  icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#f5efeb]">

      {/* ── BACK ── */}
      <div className="px-6 pt-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#3e566e] font-semibold text-sm hover:text-[#2F4156] transition"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── PROFILE HEADER ── */}
        <motion.div
          className="bg-[#2F4156] rounded-3xl p-8 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative z-10 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#c8d9e6] flex items-center justify-center text-[#2F4156] text-3xl font-black shadow-lg flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <p className="text-[#c8d9e6] text-sm mt-1">{user.email}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">
                  StyleNest Member
                </span>
                <span className="bg-[#c8d9e6]/20 text-[#c8d9e6] text-xs px-3 py-1 rounded-full font-medium">
                  ✓ Verified
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <div className="flex gap-2 bg-white border border-[#e8eef2] rounded-2xl p-2 mb-8 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#2F4156] text-white shadow-md"
                  : "text-[#3e566e] hover:bg-[#f0f5f8]"
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl p-8 border border-[#e8eef2] shadow-sm"
            >
              <h2 className="text-xl font-black text-[#2F4156] mb-6">Edit Profile</h2>

              <div className="space-y-5">

                {/* NAME */}
                <div>
                  <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-2 block">
                    Full Name
                  </label>
                  <div className="flex items-center border border-[#e8eef2] rounded-xl px-4 py-3 gap-3 focus-within:border-[#3e566e] transition bg-[#fafafa]">
                    <User size={16} className="text-[#3e566e] flex-shrink-0" />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="flex-1 outline-none text-sm bg-transparent text-[#2F4156]"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="flex items-center border border-[#e8eef2] rounded-xl px-4 py-3 gap-3 focus-within:border-[#3e566e] transition bg-[#fafafa]">
                    <Mail size={16} className="text-[#3e566e] flex-shrink-0" />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="flex-1 outline-none text-sm bg-transparent text-[#2F4156]"
                    />
                  </div>
                </div>

                {/* ERROR / SUCCESS */}
                <AnimatePresence>
                  {profileError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-center"
                    >
                      ⚠️ {profileError}
                    </motion.p>
                  )}
                  {profileSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-green-600 text-xs font-medium bg-green-50 border border-green-100 px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Profile successfully updated!
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* SAVE BUTTON */}
                <motion.button
                  onClick={handleProfileSave}
                  disabled={profileLoading}
                  className="w-full py-4 bg-[#2F4156] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#3e566e] transition"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {profileLoading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  ) : (
                    <><Save size={16} /> Save Changes</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── ADDRESSES TAB ── */}
          {activeTab === "addresses" && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >

              <AnimatePresence>
                {addrSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-green-50 border border-green-100 text-green-600 text-sm font-semibold px-5 py-3 rounded-2xl mb-4 flex items-center gap-2"
                  >
                    <Check size={16} /> Address saved successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SAVED ADDRESSES */}
              <div className="space-y-4 mb-4">
                {addresses.map((addr, i) => (
                  <motion.div
                    key={addr.id}
                    className="bg-white rounded-3xl p-6 border border-[#e8eef2] shadow-sm relative"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 bg-[#2F4156] text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                        DEFAULT
                      </span>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="bg-[#f0f5f8] p-3 rounded-xl flex-shrink-0">
                        {addr.label === "Home"
                          ? <Home      size={18} className="text-[#2F4156]" />
                          : <Building2 size={18} className="text-[#2F4156]" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#2F4156] text-sm">{addr.label}</p>
                        <p className="font-semibold text-[#2F4156] text-sm">{addr.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                          <Phone size={10} /> {addr.phone}
                        </p>
                        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                          {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs font-semibold text-[#3e566e] border border-[#c8d9e6] px-3 py-1.5 rounded-full hover:bg-[#f0f5f8] transition"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditAddress(addr)}
                        className="text-xs font-semibold text-[#3e566e] border border-[#c8d9e6] px-3 py-1.5 rounded-full hover:bg-[#f0f5f8] transition flex items-center gap-1"
                      >
                        <Edit2 size={11} /> Edit
                      </button>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs font-semibold text-red-500 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-50 transition flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ADD NEW BUTTON */}
              {!showAddForm && (
                <motion.button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingAddr(null);
                    setNewAddr({ label: "Home", name: "", phone: "", line1: "", city: "", state: "", pincode: "", isDefault: false });
                  }}
                  className="w-full py-4 border-2 border-dashed border-[#c8d9e6] rounded-3xl text-[#3e566e] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#f0f5f8] transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <Plus size={18} /> Add New Address
                </motion.button>
              )}

              {/* ADD / EDIT FORM */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl p-6 border border-[#e8eef2] shadow-sm mt-4"
                  >
                    <h3 className="font-black text-[#2F4156] mb-5">
                      {editingAddr ? "Edit Address" : "Add New Address"}
                    </h3>

                    {/* LABEL TABS */}
                    <div className="flex gap-2 mb-5">
                      {["Home", "Work", "Other"].map((l) => (
                        <button
                          key={l}
                          onClick={() => setNewAddr({ ...newAddr, label: l })}
                          className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                            newAddr.label === l
                              ? "bg-[#2F4156] text-white border-[#2F4156]"
                              : "text-[#3e566e] border-[#c8d9e6] hover:bg-[#f0f5f8]"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "name",    label: "Full Name",    placeholder: "Your name",        icon: User   },
                        { key: "phone",   label: "Phone Number", placeholder: "10 digit number",  icon: Phone  },
                        { key: "line1",   label: "Address",      placeholder: "House no, Street", icon: Home   },
                        { key: "city",    label: "City",         placeholder: "City name",        icon: MapPin },
                        { key: "state",   label: "State",        placeholder: "State name",       icon: MapPin },
                        { key: "pincode", label: "Pincode",      placeholder: "6 digit pincode",  icon: MapPin },
                      ].map((field) => (
                        <div key={field.key} className={field.key === "line1" ? "md:col-span-2" : ""}>
                          <label className="text-xs font-bold text-[#3e566e] uppercase tracking-wider mb-1.5 block">
                            {field.label}
                          </label>
                          <div className="flex items-center border border-[#e8eef2] rounded-xl px-3 py-2.5 gap-2 focus-within:border-[#3e566e] transition bg-[#fafafa]">
                            <field.icon size={14} className="text-[#3e566e] flex-shrink-0" />
                            <input
                              type="text"
                              value={newAddr[field.key]}
                              onChange={(e) => setNewAddr({ ...newAddr, [field.key]: e.target.value })}
                              placeholder={field.placeholder}
                              className="flex-1 outline-none text-sm bg-transparent text-[#2F4156]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* DEFAULT CHECKBOX */}
                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                      <div
                        onClick={() => setNewAddr({ ...newAddr, isDefault: !newAddr.isDefault })}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                          newAddr.isDefault
                            ? "bg-[#2F4156] border-[#2F4156]"
                            : "border-[#c8d9e6]"
                        }`}
                      >
                        {newAddr.isDefault && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm text-[#3e566e] font-medium">
                        Set as default address
                      </span>
                    </label>

                    {/* FORM BUTTONS */}
                    <div className="flex gap-3 mt-6">
                      <motion.button
                        onClick={handleAddressSave}
                        className="flex-1 py-3 bg-[#2F4156] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#3e566e] transition"
                        whileTap={{ scale: 0.97 }}
                      >
                        <Save size={15} />
                        {editingAddr ? "Update Address" : "Save Address"}
                      </motion.button>
                      <button
                        onClick={() => { setShowAddForm(false); setEditingAddr(null); }}
                        className="px-5 py-3 border border-[#c8d9e6] text-[#3e566e] rounded-2xl font-bold text-sm hover:bg-[#f0f5f8] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
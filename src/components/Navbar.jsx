import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { products } from "../data/products";
import { Heart, Search, ShoppingCart, Menu, X, User, Shirt, LogOut, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const [searchOpen,  setSearchOpen]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query,       setQuery]       = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef  = useRef();
  const activeRef  = useRef();

  // ✅ Products filtered by name
  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ FIXED: sirf category name se match — product name nahi
  const categoryMatches = [
    ...new Map(
      products
        .filter((p) =>
          p.category.toLowerCase().replace(/-/g, " ").includes(query.toLowerCase())
        )
        .map((p) => [
          p.category + p.gender,
          {
            category: p.category,
            gender: p.gender,
            label:
              p.category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") +
              " for " +
              p.gender.charAt(0).toUpperCase() + p.gender.slice(1),
            count: products.filter(
              (x) => x.category === p.category && x.gender === p.gender
            ).length,
          },
        ])
    ).values(),
  ].slice(0, 4);

  const productSuggestions = filtered.slice(0, 3);
  const totalItems = categoryMatches.length + productSuggestions.length;

  // ✅ Arrow key scroll into view
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FIXED: Arrow key navigation
  const handleKeyDown = (e) => {
    if (!query) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < categoryMatches.length) {
        // Category selected
        const cat = categoryMatches[activeIndex];
        navigate(`/products/${cat.gender}/${cat.category}`);
      } else if (activeIndex >= categoryMatches.length && productSuggestions[activeIndex - categoryMatches.length]) {
        // Product selected
        const item = productSuggestions[activeIndex - categoryMatches.length];
        navigate(`/product/${item.id}`);
      } else {
        // Normal search
        if (query.trim()) {
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
      }
      setSearchOpen(false);
      setQuery("");
      setActiveIndex(-1);
    }

    if (e.key === "Escape") {
      setSearchOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <nav className="bg-[#c8d9e6] sticky top-0 z-50 shadow-md px-6 py-4 flex items-center justify-between relative">

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-400 opacity-40" />

      {/* LEFT */}
      <div className="hidden md:flex gap-8 font-medium text-gray-800">
        <span onClick={() => navigate("/")} className="relative cursor-pointer group">
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full" />
        </span>
        <span onClick={() => navigate("/support")} className="relative cursor-pointer group">
          Customer Care
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full" />
        </span>
      </div>

      {/* LOGO */}
      <div className="flex items-center gap-2 text-xl font-semibold cursor-pointer" onClick={() => navigate("/")}>
        <Shirt className="text-gray-700" />
        <span>
          <span className="text-gray-800">Style</span>
          <span className="text-gray-500">Nest</span>
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex items-center relative" ref={searchRef}>
          <div className="flex items-center bg-white rounded-md overflow-visible relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  key="searchInput"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  autoFocus
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="px-3 py-1.5 outline-none text-sm"
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => { setSearchOpen(!searchOpen); setQuery(""); setActiveIndex(-1); }}
              className="p-2"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>

          {/* ✅ DROPDOWN */}
          <AnimatePresence>
            {searchOpen && query && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 w-72 bg-white shadow-xl rounded-2xl z-50 overflow-hidden border border-[#e8eef2]"
              >

                {/* SEARCH ALL BUTTON */}
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-[#f0f5f8] hover:bg-[#c8d9e6] cursor-pointer border-b border-[#e8eef2] transition"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                    setSearchOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                  }}
                >
                  <Search size={15} className="text-[#3e566e]" />
                  <span className="text-sm font-bold text-[#2F4156]">
                    Search "{query}"
                  </span>
                </div>

                {/* CATEGORIES */}
                {categoryMatches.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      Categories
                    </p>
                    {categoryMatches.map((cat, i) => (
                      <div
                        key={i}
                        ref={i === activeIndex ? activeRef : null}
                        className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition ${
                          i === activeIndex ? "bg-[#c8d9e6]" : "hover:bg-[#f0f5f8]"
                        }`}
                        onClick={() => {
                          navigate(`/products/${cat.gender}/${cat.category}`);
                          setSearchOpen(false);
                          setQuery("");
                          setActiveIndex(-1);
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-[#e8eef2] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Search size={12} className="text-[#3e566e]" />
                          </div>
                          <span className="text-sm text-[#2F4156] font-medium">
                            {cat.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {cat.count} items
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* PRODUCTS */}
                {productSuggestions.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-t border-[#f0f5f8]">
                      Products
                    </p>
                    {productSuggestions.map((item, i) => {
                      const idx = categoryMatches.length + i;
                      return (
                        <div
                          key={item.id}
                          ref={idx === activeIndex ? activeRef : null}
                          className={`px-4 py-2 cursor-pointer flex items-center gap-3 transition ${
                            idx === activeIndex ? "bg-[#c8d9e6]" : "hover:bg-[#f0f5f8]"
                          }`}
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setSearchOpen(false);
                            setQuery("");
                            setActiveIndex(-1);
                          }}
                        >
                          <img
                            src={item.image}
                            className="h-10 w-10 rounded-xl object-contain bg-[#f0f5f8] flex-shrink-0 p-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#2F4156] font-medium truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">₹{item.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {categoryMatches.length === 0 && filtered.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-400">No results found</p>
                    <p className="text-xs text-gray-300 mt-1">Try different keywords</p>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden relative" ref={searchRef}>
          <button
            onClick={() => { setSearchOpen(!searchOpen); setQuery(""); }}
            className="bg-white p-2 rounded-md"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          {searchOpen && (
            <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-50 px-4 py-3 border-b border-[#e8eef2]">
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 border border-[#e8eef2] rounded-xl outline-none text-sm focus:border-[#3e566e] transition"
              />

              {query && (
                <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-[#e8eef2]">
                  <div
                    className="p-3 flex items-center gap-2 cursor-pointer bg-[#f0f5f8] hover:bg-[#c8d9e6] transition"
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                      setQuery("");
                      setSearchOpen(false);
                    }}
                  >
                    <Search size={14} className="text-[#3e566e]" />
                    <span className="text-sm font-bold text-[#2F4156]">
                      Search "{query}"
                    </span>
                  </div>

                  {categoryMatches.map((cat, i) => (
                    <div
                      key={i}
                      className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#f0f5f8] border-t border-[#f0f5f8] transition"
                      onClick={() => {
                        navigate(`/products/${cat.gender}/${cat.category}`);
                        setQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <span className="text-sm text-[#2F4156] font-medium">{cat.label}</span>
                      <span className="text-xs text-gray-400">{cat.count} items</span>
                    </div>
                  ))}

                  {productSuggestions.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 px-3 flex items-center gap-3 cursor-pointer hover:bg-[#f0f5f8] border-t border-[#f0f5f8] transition"
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                        setQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <img
                        src={item.image}
                        className="h-9 w-9 rounded-lg object-contain bg-[#f0f5f8]"
                      />
                      <div>
                        <p className="text-sm text-[#2F4156] font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div
          className="relative"
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          <div className="cursor-pointer">
            {user ? (
              <div className="bg-[#2F4156] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="cursor-pointer" />
            )}
          </div>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl p-3 flex flex-col gap-1 min-w-[180px] z-50"
              >
                {user ? (
                  <>
                    <div className="px-2 py-2 border-b border-gray-100 mb-1">
                      <p className="font-bold text-[#2F4156] text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <span
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-sky-50 text-sm flex items-center gap-2 text-gray-700"
                    >
                      <User size={14} /> My Profile
                    </span>
                    <span
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-sky-50 text-sm flex items-center gap-2 text-gray-700"
                    >
                      <Package size={14} /> My Orders
                    </span>
                    <span
                      onClick={() => { logout(); navigate("/"); }}
                      className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-red-50 text-sm flex items-center gap-2 text-red-500 font-medium"
                    >
                      <LogOut size={14} /> Logout
                    </span>
                  </>
                ) : (
                  <>
                    <span onClick={() => navigate("/login")} className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-sky-50 text-sm text-gray-700">
                      Login
                    </span>
                    <span onClick={() => navigate("/signup")} className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-sky-50 text-sm text-gray-700">
                      Signup
                    </span>
                    <span onClick={() => navigate("/orders")} className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-sky-50 text-sm text-gray-700">
                      My Orders
                    </span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* WISHLIST */}
        <div className="relative cursor-pointer hover:scale-110 transition" onClick={() => navigate("/wishlist")}>
          <Heart />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#2F4156] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
        </div>

        {/* CART */}
        <div className="relative cursor-pointer hover:scale-110 transition" onClick={() => navigate("/cart")}>
          <ShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#2F4156] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* MOBILE MENU */}
        <Menu className="md:hidden cursor-pointer" onClick={() => setMenuOpen(true)} />
      </div>

      {/* MOBILE SIDE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-[70%] h-full bg-[#f5efeb] z-50 p-6 flex flex-col gap-6"
            >
              <X onClick={() => setMenuOpen(false)} className="cursor-pointer" />
              <span onClick={() => { navigate("/"); setMenuOpen(false); }} className="cursor-pointer font-medium">Home</span>
              <span onClick={() => { navigate("/support"); setMenuOpen(false); }} className="cursor-pointer font-medium">Customer Care</span>

              {user ? (
                <>
                  <div className="border-t pt-4">
                    <p className="font-bold text-[#2F4156]">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <span onClick={() => { navigate("/profile"); setMenuOpen(false); }} className="cursor-pointer font-medium flex items-center gap-2">
                    <User size={16} /> My Profile
                  </span>
                  <span onClick={() => { navigate("/orders"); setMenuOpen(false); }} className="cursor-pointer font-medium flex items-center gap-2">
                    <Package size={16} /> My Orders
                  </span>
                  <span onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} className="cursor-pointer font-medium text-red-500 flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </span>
                </>
              ) : (
                <>
                  <span onClick={() => { navigate("/login"); setMenuOpen(false); }} className="cursor-pointer font-medium">Login</span>
                  <span onClick={() => { navigate("/signup"); setMenuOpen(false); }} className="cursor-pointer font-medium">Signup</span>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
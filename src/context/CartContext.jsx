import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

// ✅ COUPON CODES
const COUPONS = {
  STYLE10:  { type: "percent", value: 10,  label: "10% Off"     },
  NEST20:   { type: "percent", value: 20,  label: "20% Off"     },
  FIRST50:  { type: "flat",    value: 50,  label: "₹50 Off"     },
  FREESHIP: { type: "flat",    value: 0,   label: "Free Delivery"},
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // ✅ COUPON STATE
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ✅ ADD TO CART
  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const moveToWishlist = (item) => {
    const alreadyExist = wishlist.find((w) => w.id === item.id);
    if (!alreadyExist) setWishlist([...wishlist, item]);
    removeItem(item.id);
  };

  const addToWishlist = (item) => {
    const alreadyExist = wishlist.find((w) => w.id === item.id);
    if (!alreadyExist) setWishlist([...wishlist, item]);
  };

  const moveToCart = (item) => {
    addToCart(item);
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};


// ✅ BACKEND SE VALIDATE KARO
const applyCoupon = async (code) => {
  try {
    const token = localStorage.getItem("token");

    const res  = await fetch("http://localhost:5000/api/coupon/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, subtotal }),
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, msg: data.message };
    }

    setAppliedCoupon({
      code:     data.code,
      label:    data.label,
      discount: data.discount,
    });

    return { success: true, label: data.label };

  } catch {
    // ✅ Backend nahi chal raha toh frontend se validate karo
    const COUPONS = {
      STYLE10:  { type: "percent", value: 10,  label: "10% Off"      },
      NEST20:   { type: "percent", value: 20,  label: "20% Off"      },
      FIRST50:  { type: "flat",    value: 50,  label: "₹50 Off"      },
      FREESHIP: { type: "flat",    value: 0,   label: "Free Delivery" },
    };
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon) return { success: false, msg: "Invalid coupon code!" };
    setAppliedCoupon({ code: code.toUpperCase(), ...coupon });
    return { success: true, label: coupon.label };
  }
};

  const removeCoupon = () => setAppliedCoupon(null);

  // ✅ TOTALS
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const discount = appliedCoupon?.discount || 0;

  const totalPrice = subtotal - discount;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const cartCount     = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart, wishlist,
        addToCart, addToWishlist,
        increaseQty, decreaseQty,
        removeItem, moveToWishlist,
        moveToCart, removeFromWishlist,
        applyCoupon, removeCoupon,clearCart,
        appliedCoupon,
        subtotal, discount, totalPrice,
        cartCount, wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
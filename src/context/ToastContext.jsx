import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X, ShoppingCart, Heart } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const icons = {
  success: CheckCircle,
  error:   XCircle,
  info:    Info,
  cart:    ShoppingCart,
  wishlist: Heart,
};

const colors = {
  success:  { bg: "bg-green-50",  border: "border-green-200",  icon: "text-green-500",  text: "text-green-800"  },
  error:    { bg: "bg-red-50",    border: "border-red-200",    icon: "text-red-500",    text: "text-red-800"    },
  info:     { bg: "bg-blue-50",   border: "border-blue-200",   icon: "text-blue-500",   text: "text-blue-800"   },
  cart:     { bg: "bg-[#f0f5f8]", border: "border-[#c8d9e6]", icon: "text-[#2F4156]",  text: "text-[#2F4156]"  },
  wishlist: { bg: "bg-red-50",    border: "border-red-200",    icon: "text-red-500",    text: "text-red-700"    },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST CONTAINER — bottom right corner */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon   = icons[toast.type]   || CheckCircle;
            const color  = colors[toast.type]  || colors.success;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0,   scale: 1   }}
                exit={{    opacity: 0, x: 100,  scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`
                  pointer-events-auto
                  flex items-center gap-3
                  px-4 py-3
                  rounded-2xl
                  border shadow-lg
                  min-w-[220px] max-w-[320px]
                  ${color.bg} ${color.border}
                `}
              >
                <Icon size={20} className={`flex-shrink-0 ${color.icon}`} />
                <p className={`text-sm font-semibold flex-1 ${color.text}`}>
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 opacity-40 hover:opacity-100 transition"
                >
                  <X size={14} className={color.text} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
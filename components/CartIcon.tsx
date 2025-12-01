"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { cartService } from "@/lib/cartService";

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadCartCount();

    // Debounce timer
    let debounceTimer: NodeJS.Timeout | null = null;

    // Listen for cart updates (custom event)
    const handleCartUpdate = () => {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Debounce to prevent rapid fetching
      debounceTimer = setTimeout(() => {
        loadCartCount();
      }, 300); // Wait 300ms after last event
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  const loadCartCount = async () => {
    try {
 
      const count = await cartService.getItemCount();
      setItemCount(count);
      setIsVisible(count > 0);
    } catch (error) {
      console.error("Failed to load cart count:", error);
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    router.push("/cart");
  };

  // Don't show on cart page
  if (pathname === "/cart") {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0, opacity: 0, x: 100 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="fixed left-6 bottom-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300"
            aria-label="View Cart"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-60 animate-pulse"></div>

            {/* Cart Icon */}
            <div className="relative">
              <FaShoppingCart className="w-6 h-6" />

              {/* Item count badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Ripple effect on new item */}
            <motion.div
              key={`ripple-${itemCount}`}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-white"
            />
          </motion.button>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {itemCount} مورد در سبد خرید
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

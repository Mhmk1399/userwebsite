"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FaHome, FaShopify } from "react-icons/fa";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorCode?: string;
  properties?: { name: string; value: string }[];
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [formErrors, setFormErrors] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      loadCartItems();
    }
  }, []);

  const loadCartItems = async () => {
    const db = await openDB();
    const transaction = (db as IDBDatabase).transaction("cart", "readonly");
    const store = transaction.objectStore("cart");
    const request = store.getAll();
    request.onsuccess = () => {
      setCartItems(request.result as CartItem[]);
      setLoading(false);
    };
    request.onerror = () => {
      console.log("Failed to load cart items");
      setLoading(false);
    };
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, change: number) => {
    const db = await openDB();
    const transaction = (db as IDBDatabase).transaction("cart", "readwrite");
    const store = transaction.objectStore("cart");

    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + change);

    if (newQuantity === 0) {
      await store.delete(itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      const updatedItem = { ...item, quantity: newQuantity };
      await store.put(updatedItem);
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * 1000 * item.quantity, 0);

  const initiatePayment = async () => {
    setPaymentLoading(true);

    // Check if we're on client side
    if (typeof window === "undefined") {
      setPaymentLoading(false);
      return;
    }

    const token = localStorage.getItem("tokenUser");

    if (!token) {
      toast.error("لطفا ابتدا وارد شوید");
      setPaymentLoading(false);
      return;
    }

    try {
      // Use new checkout endpoint for vendor dashboard payment flow
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            ...(item.colorCode && { colorCode: item.colorCode }),
            ...(item.properties &&
              item.properties.length > 0 && { properties: item.properties }),
          })),
          shippingAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.message || `HTTP error! status: ${response.status}`);
        toast.error(result.message || "درخواست پرداخت ناموفق بود");
        return;
      }
      console.log("Payment response:", result);

      if (result.success && result.paymentUrl) {
        if (typeof window !== "undefined") {
          // Store order ID for later reference
          localStorage.setItem("pendingOrderId", result.orderId);
          console.log("Redirecting to vendor dashboard:", result.paymentUrl);
          // Redirect to vendor dashboard for payment
          window.location.href = result.paymentUrl;
        }
      } else {
        console.log("Payment failed:", result);
        toast.error(result.message || "درخواست پرداخت ناموفق بود");
      }
    } catch (error) {
      console.log("Payment initiation error:", error);
      toast.error(
        error instanceof Error ? error.message : "خطا در ایجاد درخواست پرداخت"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    };

    if (!shippingAddress.street.trim()) {
      errors.street = "آدرس خیابان الزامی است";
    } else if (shippingAddress.street.trim().length < 10) {
      errors.street = "آدرس باید حداقل ۱۰ کاراکتر باشد";
    }

    if (!shippingAddress.city.trim()) {
      errors.city = "نام شهر الزامی است";
    } else if (shippingAddress.city.trim().length < 2) {
      errors.city = "نام شهر باید حداقل ۲ کاراکتر باشد";
    }

    if (!shippingAddress.state.trim()) {
      errors.state = "نام استان الزامی است";
    } else if (shippingAddress.state.trim().length < 2) {
      errors.state = "نام استان باید حداقل ۲ کاراکتر باشد";
    }

    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = "کد پستی الزامی است";
    } else if (!/^\d{10}$/.test(shippingAddress.postalCode.trim())) {
      errors.postalCode = "کد پستی باید ۱۰ رقم باشد";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const submitOrder = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }

    if (!validateForm()) {
      toast.error("لطفا خطاهای فرم را برطرف کنید");
      return;
    }

    initiatePayment();
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-3 sm:px-6 lg:px-8 pt-4   lg:pt-4 pb-10 relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-indigo-600 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-white/50 text-sm sm:text-base"
          >
            <FaHome />
            <span className="font-semibold">بازگشت</span>
          </Link>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl py-2 font-black  bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-sm px-2">
            سبد خرید
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-transparent to-purple-400 rounded-full"></div>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-l from-transparent to-purple-400 rounded-full"></div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-purple-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium animate-pulse text-sm sm:text-base">
              در حال بارگذاری...
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 sm:py-16 bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/50"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 sm:h-40 sm:w-40 mx-auto text-purple-500 relative"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-6 sm:mt-8 mb-2 sm:mb-3">
              سبد خرید شما خالی است!
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8">
              محصولات مورد علاقه خود را به سبد خرید اضافه کنید
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <FaShopify />
              شروع خرید
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Items Count Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/50 shadow-lg"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-base sm:text-lg">
                        {cartItems.length}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-bold text-sm sm:text-lg">
                        محصول در سبد خرید
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        عدد
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-500 text-xs sm:text-sm">جمع کل</p>
                    <p className="text-purple-600 font-bold text-lg sm:text-xl">
                      {calculateTotal().toLocaleString()} تومان
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Cart Items List */}
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: 50,
                      scale: 0.9,
                      transition: { duration: 0.3 },
                    }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    layout
                    className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 border border-white/50 group relative overflow-hidden"
                  >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>

                    {/* Mobile Layout (column) / Desktop Layout (row) */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
                      {/* Product Image */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md bg-white p-2 w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-pink-200/20"></div>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="object-cover rounded-lg sm:rounded-xl transform group-hover:scale-110 transition-transform duration-500 mx-auto"
                        />
                      </motion.div>

                      {/* Product Info - Full width on mobile */}
                      <div className="flex-1 w-full text-center sm:text-right">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
                          <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg sm:rounded-xl">
                            <p className="text-purple-700 font-bold text-base sm:text-lg">
                              {item.price.toLocaleString()} تومان
                            </p>
                          </div>
                          <div className="px-3 py-1 bg-gray-100 rounded-lg">
                            <p className="text-gray-600 text-xs sm:text-sm">
                              جمع:{" "}
                              <span className="font-bold text-gray-800">
                                {(item.price * 1000 * item.quantity).toLocaleString()}{" "}
                                تومان
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls - Optimized for Mobile */}
                      <div className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-2 sm:p-2 shadow-inner w-full sm:w-auto">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-white hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 text-gray-700 hover:text-white flex items-center justify-center shadow-md hover:shadow-lg active:shadow-inner transition-all duration-300 font-bold text-xl border-2 border-gray-200 touch-manipulation"
                        >
                          {item.quantity === 1 ? (
                            <svg
                              className="w-5 h-5 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          ) : (
                            "-"
                          )}
                        </motion.button>

                        <div className="w-16 sm:w-16 h-12 sm:h-11 flex items-center justify-center bg-white rounded-xl shadow-sm border-2 border-purple-100">
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.5, color: "#9333ea" }}
                            animate={{ scale: 1, color: "#1f2937" }}
                            className="font-bold text-xl sm:text-lg"
                          >
                            {item.quantity}
                          </motion.span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 text-gray-700 hover:text-white flex items-center justify-center shadow-md hover:shadow-lg active:shadow-inner transition-all duration-300 font-bold text-xl border-2 border-gray-200 touch-manipulation"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Shipping Address Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8 border border-white/50 mt-6 sm:mt-8"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      آدرس تحویل سفارش
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      لطفا آدرس کامل خود را وارد کنید
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2 text-xs sm:text-sm">
                      آدرس خیابان
                    </label>
                    <input
                      type="text"
                      placeholder="خیابان، کوچه، پلاک..."
                      className={`w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base ${
                        formErrors.street
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-purple-200 focus:border-purple-400 hover:border-purple-300"
                      }`}
                      value={shippingAddress.street}
                      onChange={(e) => {
                        setShippingAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }));
                        if (formErrors.street) {
                          setFormErrors((prev) => ({ ...prev, street: "" }));
                        }
                      }}
                    />
                    {formErrors.street && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.street}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-xs sm:text-sm">
                      شهر
                    </label>
                    <input
                      type="text"
                      placeholder="نام شهر"
                      className={`w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base ${
                        formErrors.city
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-purple-200 focus:border-purple-400 hover:border-purple-300"
                      }`}
                      value={shippingAddress.city}
                      onChange={(e) => {
                        setShippingAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }));
                        if (formErrors.city) {
                          setFormErrors((prev) => ({ ...prev, city: "" }));
                        }
                      }}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-xs sm:text-sm">
                      استان
                    </label>
                    <input
                      type="text"
                      placeholder="نام استان"
                      className={`w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base ${
                        formErrors.state
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-purple-200 focus:border-purple-400 hover:border-purple-300"
                      }`}
                      value={shippingAddress.state}
                      onChange={(e) => {
                        setShippingAddress((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }));
                        if (formErrors.state) {
                          setFormErrors((prev) => ({ ...prev, state: "" }));
                        }
                      }}
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.state}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2 text-xs sm:text-sm">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      placeholder="کد پستی ده رقمی"
                      maxLength={10}
                      className={`w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base ${
                        formErrors.postalCode
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-200 focus:ring-purple-200 focus:border-purple-400 hover:border-purple-300"
                      }`}
                      value={shippingAddress.postalCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setShippingAddress((prev) => ({
                          ...prev,
                          postalCode: value,
                        }));
                        if (formErrors.postalCode) {
                          setFormErrors((prev) => ({
                            ...prev,
                            postalCode: "",
                          }));
                        }
                      }}
                    />
                    {formErrors.postalCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 sticky top-24 border border-white/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    خلاصه سفارش
                  </h2>
                </div>

                <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      جمع کل
                    </span>
                    <span className="text-gray-800 font-bold text-base sm:text-lg">
                      {calculateTotal().toLocaleString()} تومان
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">
                        هزینه ارسال
                      </span>
                    </div>
                    <span className="text-green-600 font-bold text-base sm:text-lg">
                      رایگان
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-gray-400">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 rounded-xl sm:rounded-2xl shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-bold text-base sm:text-lg">
                        مبلغ قابل پرداخت
                      </span>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          {calculateTotal().toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 font-semibold">
                          تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: paymentLoading ? 1 : 1.02 }}
                  whileTap={{ scale: paymentLoading ? 1 : 0.97 }}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group touch-manipulation"
                  onClick={submitOrder}
                  disabled={paymentLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-3 border-b-3 border-white"></div>
                        <span className="text-sm sm:text-base">
                          در حال ایجاد درخواست...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="text-sm sm:text-base">
                          پرداخت و ثبت سفارش
                        </span>
                        <svg
                          className="w-4 h-4 rotate-180 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform hidden sm:block"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t-2 border-dashed border-gray-200">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-blue-600 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-700">
                        پرداخت امن
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-green-600 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-700">
                        تضمین اصالت
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-purple-600 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-700">
                        ارسال سریع
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Better touch targets for mobile */
        @media (max-width: 640px) {
          .touch-manipulation {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            user-select: none;
          }
        }
      `}</style>
    </div>
  );
}

async function openDB() {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("CartDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" });
      }
    };
  });
}

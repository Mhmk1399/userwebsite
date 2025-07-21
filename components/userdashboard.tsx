"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt, FaCog, FaEdit, FaTimes } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import Jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";

interface DecodedToken extends JwtPayload {
  userId: string;
  phone: string;
  role: string;
}

interface Order {
  _id: string;
  userId: string;
  date: string;
  status: string;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}
interface UserInfo {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSection, setActiveSection] = useState("profile"); // Track active section
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(loading);
      try {
        // Get the user ID from localStorage token
        const token = localStorage.getItem("tokenUser");
        const decoded = Jwt.decode(token as string) as DecodedToken;
        const userId = decoded.userId;

        const response = await fetch(`/api/auth/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setLoading(false);
          const userData = await response.json();
          console.log("User Data:", userData);
          setUserInfo(userData); // Note the .user since the API returns {user: {...}}
          setFormData({
            name: userData.user.name,
            phone: userData.user.phone,
          });
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [loading]);

  useEffect(() => {
    const checkOrders = async () => {
      try {
        const token = localStorage.getItem("tokenUser");
        if (!token) {
          router.replace("/login");
          return;
        }
        const ordersResponse = await fetch("/api/orders", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await ordersResponse.json();
        console.log("Orders data:", data); // Debug log

        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.log("Error fetching orders:", error);
        toast.error("Error loading orders");
      }
    };

    checkOrders();
  }, [router]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", phone: "" };

    if (!formData.name) {
      newErrors.name = "نام نمی‌تواند خالی باشد";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "شماره تماس نمی‌تواند خالی باشد";
      toast.error("شماره تماس نمی‌تواند خالی باشد");
      valid = false;
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      toast.error("شماره تماس معتبر نیست");
      newErrors.phone = "شماره تماس معتبر نیست";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const handleUpdateUser = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/auth/${userInfo?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          password: "placeholder", // Required by backend
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("اطلاعات با موفقیت به‌روز شد");

        setUserInfo((prev) => (prev ? { ...prev, ...formData } : null));
        setIsEditing(false);
      } else {
        toast.error(result.message || "خطا در به‌روزرسانی اطلاعات");

        console.log(result.message || "خطا در به‌روزرسانی اطلاعات");
      }
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error("خطای سرور");

      console.log("خطای سرور");
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    localStorage.removeItem("token");
    e.preventDefault();
  };

  const Sidebar = () => (
    <motion.aside
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 right-0 w-64 bg-gradient-to-b from-blue-800 to-blue-900 h-screen p-6 text-white z-50 shadow-2xl
                 lg:relative lg:translate-x-0 lg:shadow-none
                 md:w-72 sm:w-64"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl lg:text-2xl font-bold truncate">
          داشبورد - {userInfo?.name}
        </h2>
        {/* Close button for mobile */}
        <button className="lg:hidden text-white hover:text-gray-300">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="space-y-3">
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 text-right
            ${
              activeSection === "profile"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-blue-700/50"
            }`}
        >
          <FaUser className="text-lg" />
          <span className="font-medium">پروفایل</span>
        </button>

        <button
          onClick={() => setActiveSection("orders")}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 text-right
            ${
              activeSection === "orders"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-blue-700/50"
            }`}
        >
          <BsCartCheckFill className="text-lg" />
          <span className="font-medium">سفارشات</span>
        </button>

        <button
          onClick={() => setActiveSection("settings")}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 text-right
            ${
              activeSection === "settings"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-blue-700/50"
            }`}
        >
          <FaCog className="text-lg" />
          <span className="font-medium">پیگیری سفارش</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 p-3 w-full rounded-xl text-red-300 hover:bg-red-600/20 hover:text-red-200 transition-all duration-200 text-right mt-8"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">خروج</span>
        </button>
        <button className="flex-shrink-0 px-4 py-3 text-base font-medium border-b-2 text-right border-transparent text-white hover:text-gray-200 transition-colors whitespace-nowrap">
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </button>
      </nav>
    </motion.aside>
  );

  const ProfileSection = () => {
    if (isEditing) {
      return (
        <motion.div
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 lg:p-8 rounded-2xl mx-4 lg:mx-10 shadow-2xl space-y-6"
          dir="rtl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              ویرایش اطلاعات کاربری
            </h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleUpdateUser}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
              >
                <FaEdit className="text-lg" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(false)}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-white block mb-3 font-semibold text-lg">
                نام
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full text-gray-800 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300
                  ${
                    errors.name
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-white focus:border-blue-400"
                  }`}
                placeholder="نام خود را وارد کنید"
              />
              {errors.name && (
                <p className="text-red-200 text-sm mt-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-white block mb-3 font-semibold text-lg">
                شماره تماس
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={`w-full text-gray-800 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300
                  ${
                    errors.phone
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-white focus:border-blue-400"
                  }`}
                placeholder="شماره تماس خود را وارد کنید"
              />
              {errors.phone && (
                <p className="text-red-200 text-sm mt-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl rounded-2xl mx-4 lg:mx-10 p-6 lg:p-10 space-y-6"
        dir="rtl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl lg:text-3xl font-bold text-orange-400 flex items-center gap-3">
            <FaUser className="text-2xl" />
            <span>اطلاعات کاربری</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
          >
            <FaEdit className="text-lg" />
          </motion.button>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6">
            <p className="text-white text-lg lg:text-xl">
              <strong className="font-bold text-yellow-400 text-lg lg:text-xl ml-2">
                نام:
              </strong>
              {userInfo?.name}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6">
            <p className="text-white text-lg lg:text-xl">
              <strong className="font-bold text-yellow-400 text-lg lg:text-xl ml-2">
                شماره تماس:
              </strong>
              {userInfo?.phone}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6">
            <p className="text-white text-lg lg:text-xl">
              <strong className="font-bold text-yellow-400 text-lg lg:text-xl ml-2">
                تاریخ ایجاد اکانت:
              </strong>
              {new Date(userInfo?.createdAt || "").toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
      </motion.section>
    );
  };

  const OrdersSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 lg:p-10 shadow-2xl rounded-2xl mx-4 lg:mx-10 text-white"
      dir="rtl"
    >
      <h3 className="text-2xl lg:text-3xl font-bold mb-6 pb-4 border-b border-white/20 flex items-center gap-3">
        <BsCartCheckFill className="text-2xl" />
        سفارشات من
      </h3>

      {orders.length > 0 ? (
        <div className="space-y-4 lg:space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 lg:p-6 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-sm lg:text-base">
                    <strong className="text-yellow-400 font-semibold">
                      شماره سفارش:{" "}
                    </strong>
                    <span className="font-mono text-xs lg:text-sm">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-sm lg:text-base">
                    <strong className="text-yellow-400 font-semibold">
                      وضعیت:{" "}
                    </strong>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs lg:text-sm">
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm lg:text-base">
                    <strong className="text-yellow-400 font-semibold">
                      مجموع:{" "}
                    </strong>
                    <span className="text-green-300 font-bold">
                      {order.totalAmount.toLocaleString()} تومان
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm lg:text-base">
                    <strong className="text-yellow-400 font-semibold">
                      آدرس تحویل:
                    </strong>
                  </p>
                  <div className="bg-white/5 rounded-lg p-3 text-xs lg:text-sm leading-relaxed">
                    {order.shippingAddress.city} - {order.shippingAddress.state}
                    <br />
                    {order.shippingAddress.street}
                    <br />
                    <span className="text-gray-300">
                      کد پستی: {order.shippingAddress.postalCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <BsCartCheckFill className="text-6xl text-white/30 mx-auto" />
          </div>
          <p className="text-lg lg:text-xl text-white/80">
            شما هنوز سفارشی ندارید.
          </p>
        </div>
      )}
    </motion.div>
  );

  const SettingsSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 lg:p-10 shadow-2xl rounded-2xl mx-4 lg:mx-10"
      dir="rtl"
    >
      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 pb-4 border-b border-white/20 flex items-center gap-3">
        <FaCog className="text-2xl" />
        پیگیری سفارشات
      </h3>

      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6">
          <p className="mb-4 text-white text-base lg:text-lg leading-relaxed">
            لطفا شماره سفارش خود را وارد کنید تا اطلاعات سفارش را دریافت کنید.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="شماره سفارش"
                className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-white/40 transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              پیگیری سفارش
            </motion.button>
          </div>
        </div>

     
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Toaster
        position="top-right"
        containerStyle={{ top: 10, fontSize: "14px", fontWeight: "bold" }}
      />

      {/* Mobile Header */}
      <div
        className="lg:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between"
        dir="rtl"
      >
        <h1 className="text-lg font-bold text-gray-800">داشبورد کاربری</h1>
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white border-b">
          <div className="flex overflow-x-auto scrollbar-hide" dir="rtl">
            <button
              onClick={() => setActiveSection("profile")}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeSection === "profile"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              پروفایل
            </button>
            <button
              onClick={() => setActiveSection("orders")}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeSection === "orders"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              سفارشات
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeSection === "settings"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              پیگیری سفارش
            </button>
            <button className="flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 border-transparent text-blue-500 hover:text-blue-700 transition-colors whitespace-nowrap">
              <Link href="/">بازگشت به صفحه اصلی</Link>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 border-transparent text-red-500 hover:text-red-700 transition-colors whitespace-nowrap"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:mr-64 bg-gray-50 min-h-screen">
          <div className="py-4 lg:py-8">
            {activeSection === "profile" && <ProfileSection />}
            {activeSection === "orders" && <OrdersSection />}
            {activeSection === "settings" && <SettingsSection />}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md"
            dir="rtl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignOutAlt className="text-2xl text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                تایید خروج
              </h2>
              <p className="text-gray-600">
                آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
              >
                انصراف
              </button>
              <button
                onClick={(e) => {
                  setIsModalOpen(false);
                  handleDeleteAccount(e);
                }}
                className="flex-1 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium transition-colors duration-200"
              >
                خروج از حساب
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

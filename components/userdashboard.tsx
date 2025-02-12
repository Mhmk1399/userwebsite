"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { FaUser, FaSignOutAlt, FaCog, FaEdit, FaTimes } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import Jwt, { JwtPayload } from "jsonwebtoken";

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
      console.log(loading)
      try {
        // Get the user ID from localStorage token
        const token = localStorage.getItem("token");
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
          toast.success("اطلاعات کاربری با موفقیت دریافت شد");
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
        toast.error("خطا در دریافت اطلاعات کاربری");
        
      }
    };
    fetchUserData();
  }, [loading]);

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
  useEffect(() => {
    const checkOrders = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const Sidebar = () => (
    <motion.aside
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-blue-800 h-screen p-6 text-white fixed"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-6">داشبورد - {userInfo?.name} </h2>
      <nav className="space-y-4">
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex items-center gap-2 p-2 w-full rounded-lg ${
            activeSection === "profile" ? "bg-blue-600" : ""
          }`}
        >
          <FaUser /> پروفایل
        </button>
        <button
          onClick={() => setActiveSection("orders")}
          className={`flex items-center gap-2 p-2 w-full rounded-lg ${
            activeSection === "orders" ? "bg-blue-600" : ""
          }`}
        >
          <BsCartCheckFill /> سفارشات
        </button>
        <button
          onClick={() => setActiveSection("settings")}
          className={`flex items-center gap-2 p-2 w-full rounded-lg ${
            activeSection === "settings" ? "bg-blue-600" : ""
          }`}
        >
          <FaCog /> پیگیری سفارش
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 p-2 w-full rounded-lg text-red-400 hover:bg-red-600"
        >
          <FaSignOutAlt /> خروج
        </button>
      </nav>
    </motion.aside>
  );
  const ProfileSection = () => {
    if (isEditing) {
      return (
        <motion.div
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-blue-600 p-6 rounded-xl m-10 shadow-lg space-y-4"
          dir="rtl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              ویرایش اطلاعات کاربری
            </h2>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleUpdateUser}
                className="bg-green-500 text-white p-3 mx-2 rounded-full"
              >
                <FaEdit />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white p-3  rounded-full"
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>

          <div>
            <label className="text-white block mb-2">نام</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full text-black p-2 rounded ${
                errors.name ? "border-2 border-red-500" : "border"
              }`}
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-white block mb-2">شماره تماس</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className={`w-full text-black p-2 rounded ${
                errors.phone ? "border-2 border-red-500" : "border"
              }`}
            />
            {errors.phone && (
              <p className="text-red-300 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="shadow rounded-xl m-6 p-10 flex flex-col gap-4"
        style={{ backgroundColor: "#3a6ea5" }}
        dir="rtl"
      >
        <div className="flex justify-between items-center">
          <h3
            className="text-2xl font-semibold mb-4 inline-flex items-center gap-2"
            style={{ color: "#ff6700" }}
          >
            <FaUser /> <span>اطلاعات کاربری</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="bg-orange-500 text-white p-4 rounded-full"
          >
            <FaEdit />
          </motion.button>
        </div>

        <p style={{ color: "#ffffff" }}>
          <strong className="font-bold text-yellow-400 text-lg ml-1">
            نام:
          </strong>{" "}
          {userInfo?.name}
        </p>
        <p style={{ color: "#e4e4e4" }}>
          <strong className="font-bold text-yellow-400 text-lg ml-1">
            شماره تماس:
          </strong>{" "}
          {userInfo?.phone}
        </p>
        <p style={{ color: "#e4e4e4" }}>
          <strong className="font-bold text-yellow-400 text-lg ml-1">
            تاریخ ایجاد اکانت:
          </strong>{" "}
          {new Date(userInfo?.createdAt || "").toLocaleDateString("fa-IR")}
        </p>
      </motion.section>
    );
  };

  const OrdersSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#3a6ea5" }}
      className="p-10 shadow rounded-xl m-10 text-white"
      dir="rtl"
    >
      <h3 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-3">
        سفارشات من
      </h3>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="border border-blue-400 rounded-lg p-4 hover:bg-blue-900 transition-colors"
            >
              <p className="mb-2">
                <strong className="text-yellow-400">شماره سفارش: </strong>
                {order._id}
              </p>
              <p className="mb-2">
                <strong className="text-yellow-400">وضعیت: </strong>
                {order.status}
              </p>
              <p className="mb-2">
                <strong className="text-yellow-400">مجموع: </strong>
                {order.totalAmount} تومان
              </p>
              <p className="mb-2">
                <strong className="text-yellow-400">آدرس: </strong>
                {order.shippingAddress.city} - {order.shippingAddress.state} -
                {order.shippingAddress.street} - پستال :
                {order.shippingAddress.postalCode}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-lg">شما سفارشی ندارید.</p>
      )}
    </motion.div>
  );

  const SettingsSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#3a6ea5" }}
      dir="rtl"
      className="p-6 m-10 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl text-white font-bold mb-4">پیگیری سفارشات</h3>
      <p className="mb-4" style={{ color: "#ffffff" }}>
        لطفا شماره سفارش خود را وارد کنید تا اطلاعات سفارش را دریافت کنید.
      </p>
      <input
        type="text"
        placeholder="شماره سفارش"
        className="border rounded p-2 w-full mb-4 focus:ring-2 focus:outline-none"
        style={{
          borderColor: "#004e98",
          outlineColor: "none",
          color: "#004e98",
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded shadow"
        style={{
          backgroundColor: "#004e98",
          color: "#fff",
          transition: "all 0.2s ease-in-out",
        }}
      >
        پیگیری سفارش
      </motion.button>
    </motion.div>
  );

  return (
    <div className="flex">
      <Toaster
        position="top-right"
        containerStyle={{ top: 10, fontSize: "14px", fontWeight: "bold" }}
      />
      <Sidebar />
      <main className="ml-64 w-full bg-gray-100 min-h-screen">
        {activeSection === "profile" && <ProfileSection />}
        {activeSection === "orders" && <OrdersSection />}
        {activeSection === "settings" && <SettingsSection />}
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          dir="rtl"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">انتخاب کنید</h2>
            <p className="mb-4">لطفا عملیات مورد نظر را انتخاب کنید</p>
            <div className="flex justify-start">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mx-2 transition-all text-white border bg-blue-500 rounded-lg hover:bg-opacity-75"
              >
                انصراف
              </button>

              <button
                onClick={(e) => {
                  setIsModalOpen(false);
                  handleDeleteAccount(e);
                }}
                className="px-4 py-2 mx-2 transition-all text-white border bg-red-500 rounded-lg hover:bg-opacity-75"
              >
                حذف حساب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;

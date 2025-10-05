"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaTimes,
  FaTicketAlt,
} from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import TicketSystem from "./TicketSystem";

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

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UserInfo {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
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
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const token = localStorage.getItem("tokenUser");
        const response = await fetch(`/api/auth/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData.user);
          setFormData({
            name: userData.user.name,
            phone: userData.user.phone,
          });
        } else if (response.status === 401) {
          logout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("خطا در دریافت اطلاعات کاربر");
      }
    };

    if (isAuthenticated && user && !userInfo) {
      fetchUserData();
    }
  }, [user, isAuthenticated]);

  const fetchOrders = async (page = 1, status = "all") => {
    if (!isAuthenticated) return;

    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem("tokenUser");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
        ...(status !== "all" && { status }),
      });

      const ordersResponse = await fetch(`/api/orders?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (ordersResponse.ok) {
        const data = await ordersResponse.json();
        setOrders(data.orders || []);
        setPagination(data.pagination);
      } else if (ordersResponse.status === 401) {
        logout();
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeSection === "orders") {
      fetchOrders(currentPage, statusFilter);
    }
  }, [isAuthenticated, activeSection, currentPage, statusFilter]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", phone: "" };

    if (!formData.name) {
      newErrors.name = "نام نمیتواند خالی باشد";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "شماره تماس نمیتواند خالی باشد";
      toast.error("شماره تماس نمیتواند خالی باشد");
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
    if (!validateForm() || !userInfo?._id) return;

    try {
      const token = localStorage.getItem("tokenUser");
      const response = await fetch(`/api/auth/${userInfo._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("اطلاعات با موفقیت بهروز شد");
        setUserInfo(result.user);
        setIsEditing(false);
      } else if (response.status === 401) {
        logout();
      } else {
        toast.error(result.message || "خطا در بهروزرسانی اطلاعات");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("خطای سرور");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 w-72 sm:w-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 h-screen p-6 text-white z-50 shadow-2xl transition-transform duration-300 ease-in-out
                   lg:relative lg:translate-x-0 lg:w-72 xl:w-80 lg:shadow-xl
                   ${
                     isSidebarOpen
                       ? "translate-x-0"
                       : "translate-x-full lg:translate-x-0"
                   }`}
        dir="rtl"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black mb-1 drop-shadow-lg">
                داشبورد
              </h2>
              <p className="text-white/80 text-sm font-medium truncate">
                خوش آمدید، {userInfo?.name}
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all"
            >
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

          <nav className="space-y-2 mb-8">
            <button
              onClick={() => {
                setActiveSection("profile");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all duration-300 text-right group
                ${
                  activeSection === "profile"
                    ? "bg-white text-indigo-600 shadow-2xl shadow-white/20 scale-105"
                    : "hover:bg-white/10 hover:scale-102"
                }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${
                  activeSection === "profile"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    : "bg-white/10 text-white group-hover:bg-white/20"
                }`}
              >
                <FaUser className="text-xl" />
              </div>
              <span className="font-bold text-lg">پروفایل</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("orders");
                setIsSidebarOpen(false);
                if (orders.length === 0) {
                  fetchOrders(1, statusFilter);
                }
              }}
              className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all duration-300 text-right group
                ${
                  activeSection === "orders"
                    ? "bg-white text-indigo-600 shadow-2xl shadow-white/20 scale-105"
                    : "hover:bg-white/10 hover:scale-102"
                }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${
                  activeSection === "orders"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    : "bg-white/10 text-white group-hover:bg-white/20"
                }`}
              >
                <BsCartCheckFill className="text-xl" />
              </div>
              <span className="font-bold text-lg">سفارشات</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("tickets");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all duration-300 text-right group
                ${
                  activeSection === "tickets"
                    ? "bg-white text-indigo-600 shadow-2xl shadow-white/20 scale-105"
                    : "hover:bg-white/10 hover:scale-102"
                }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${
                  activeSection === "tickets"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    : "bg-white/10 text-white group-hover:bg-white/20"
                }`}
              >
                <FaTicketAlt className="text-xl" />
              </div>
              <span className="font-bold text-lg">پشتیبانی</span>
            </button>
          </nav>

          <div className="space-y-2 pt-6 border-t border-white/20">
            <Link
              href="/"
              className="flex items-center gap-4 p-4 w-full rounded-2xl hover:bg-white/10 transition-all duration-300 text-right group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">صفحه اصلی</span>
            </Link>

            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-4 p-4 w-full rounded-2xl text-red-100 hover:bg-red-500/20 hover:text-white transition-all duration-300 text-right group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-all">
                <FaSignOutAlt className="text-xl" />
              </div>
              <span className="font-bold text-lg">خروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );

  const ProfileSection = () => {
    if (isEditing) {
      return (
        <div
          className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl mx-3 sm:mx-4 lg:mx-6 shadow-2xl border border-purple-100"
          dir="rtl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                ویرایش اطلاعات کاربری
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                اطلاعات خود را بروزرسانی کنید
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleUpdateUser}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <FaEdit className="text-xl" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-gray-700   mb-3 font-bold text-base sm:text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full text-gray-800 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-base sm:text-lg
                  ${
                    errors.name
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                      : "border-purple-200 bg-white focus:border-purple-500 focus:ring-purple-200 hover:border-purple-300"
                  }`}
                placeholder="نام خود را وارد کنید"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-3 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
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
              <label className="text-gray-700   mb-3 font-bold text-base sm:text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                شماره تماس
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={`w-full text-gray-800 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-base sm:text-lg
                  ${
                    errors.phone
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                      : "border-purple-200 bg-white focus:border-purple-500 focus:ring-purple-200 hover:border-purple-300"
                  }`}
                placeholder="09xxxxxxxxx"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-3 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
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
        </div>
      );
    }

    return (
      <section
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl mx-3 sm:mx-4 lg:mx-6 p-6 sm:p-8 lg:p-10 border border-purple-100"
        dir="rtl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 mb-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <FaUser className="text-xl sm:text-2xl" />
              </div>
              اطلاعات کاربری
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mr-16 sm:mr-[4.5rem]">
              اطلاعات حساب کاربری شما
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 font-bold"
          >
            <FaEdit className="text-lg" />
            <span className="hidden sm:inline">ویرایش اطلاعات</span>
            <span className="sm:hidden">ویرایش</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 sm:p-6 border-2 border-indigo-100 hover:border-indigo-200 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <FaUser className="text-lg" />
              </div>
              <p className="font-bold text-indigo-900 text-base sm:text-lg">
                نام و نام خانوادگی
              </p>
            </div>
            <p className="text-gray-700 text-lg sm:text-xl font-semibold mr-13">
              {userInfo?.name}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 sm:p-6 border-2 border-purple-100 hover:border-purple-200 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <p className="font-bold text-purple-900 text-base sm:text-lg">
                شماره تماس
              </p>
            </div>
            <p className="text-gray-700 text-lg sm:text-xl font-semibold mr-13 font-mono">
              {userInfo?.phone}
            </p>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 sm:p-6 border-2 border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="font-bold text-blue-900 text-base sm:text-lg">
                تاریخ عضویت
              </p>
            </div>
            <p className="text-gray-700 text-lg sm:text-xl font-semibold mr-13 font-mono">
              {new Date(userInfo?.createdAt || "").toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
      </section>
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-gradient-to-r from-yellow-500 to-orange-500",
      processing: "bg-gradient-to-r from-blue-500 to-indigo-500",
      shipped: "bg-gradient-to-r from-purple-500 to-pink-500",
      delivered: "bg-gradient-to-r from-green-500 to-emerald-500",
      cancelled: "bg-gradient-to-r from-red-500 to-pink-500",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-500 to-gray-600"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: "در انتظار",
      processing: "در حال پردازش",
      shipped: "ارسال شده",
      delivered: "تحویل داده شده",
      cancelled: "لغو شده",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const OrdersSection = () => (
    <div
      className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-2xl rounded-3xl mx-3 sm:mx-4 lg:mx-6 border border-purple-100"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 mb-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <BsCartCheckFill className="text-xl sm:text-2xl" />
            </div>
            سفارشات من
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mr-16 sm:mr-[4.5rem]">
            {pagination
              ? `${pagination.totalOrders} سفارش ثبت شده`
              : "لیست سفارشات شما"}
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-gray-700 text-sm sm:text-base font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-200 hover:border-indigo-300 transition-all cursor-pointer shadow-sm"
        >
          <option value="all">همه وضعیتها</option>
          <option value="pending">در انتظار</option>
          <option value="processing">در حال پردازش</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل داده شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
      </div>

      {isLoadingOrders ? (
        <div className="text-center py-16 sm:py-20">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-indigo-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-semibold mt-6 text-base sm:text-lg">
            در حال بارگذاری سفارشات...
          </p>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl p-5 sm:p-6 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <div className="text-left">
                      <div className="text-green-600 font-black text-base sm:text-lg">
                        {order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-green-600 text-xs font-semibold">
                        تومان
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-xl p-3 border border-indigo-100">
                    <div className="text-gray-500 text-xs mb-1 font-semibold">
                      شماره سفارش
                    </div>
                    <div className="text-gray-800 font-mono font-bold text-sm">
                      #{order._id.slice(-8)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                    <div className="flex items-center gap-2 text-gray-700 font-bold mb-2 text-xs sm:text-sm">
                      <svg
                        className="w-4 h-4 text-indigo-500"
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
                      آدرس تحویل
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-semibold font-mono">
                      {new Date(order.date || Date.now()).toLocaleDateString(
                        "fa-IR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrev}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-200 hover:to-purple-200 transition-all shadow-md hover:shadow-lg text-gray-700 border-2 border-indigo-200"
              >
                صفحه قبل
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg ${
                      page === currentPage
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110 shadow-xl"
                        : "bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 hover:from-indigo-200 hover:to-purple-200 border-2 border-indigo-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages)
                  )
                }
                disabled={!pagination.hasNext}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-200 hover:to-purple-200 transition-all shadow-md hover:shadow-lg text-gray-700 border-2 border-indigo-200"
              >
                صفحه بعد
              </button>
            </div>
          )}

          {pagination && (
            <div className="text-center mt-6">
              <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-2xl border-2 border-indigo-100">
                <span className="text-gray-600 text-sm font-semibold">
                  نمایش {orders.length} از {pagination.totalOrders} سفارش
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 sm:py-20">
          <div className="mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mx-auto flex items-center justify-center">
              <BsCartCheckFill className="text-4xl sm:text-6xl text-indigo-400" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            {statusFilter === "all"
              ? "شما هنوز سفارشی ندارید"
              : `سفارشی با وضعیت "${getStatusText(statusFilter)}" یافت نشد`}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            برای شروع خرید به صفحه اصلی بروید
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            رفتن به فروشگاه
          </Link>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-indigo-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-700 font-semibold text-base sm:text-lg">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      dir="rtl"
    >
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-xl shadow-lg border-b-2 border-purple-100 p-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          داشبورد کاربری
        </h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
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
        <Sidebar />

        <main className="flex-1 min-h-screen w-full">
          <div className="py-6 sm:py-8 lg:py-10">
            {activeSection === "profile" && <ProfileSection />}
            {activeSection === "orders" && <OrdersSection />}
            {activeSection === "tickets" && (
              <TicketSystem isAuthenticated={isAuthenticated} logout={logout} />
            )}
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 border-2 border-red-100"
            dir="rtl"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaSignOutAlt className="text-3xl sm:text-4xl text-red-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-3">
                تایید خروج
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                آیا مطمئن هستید که میخواهید از حساب کاربری خود خارج شوید؟
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg border-2 border-gray-300"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  handleLogout();
                }}
                className="flex-1 px-6 py-4 text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                خروج از حساب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

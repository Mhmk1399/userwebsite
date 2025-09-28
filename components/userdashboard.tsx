"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt, FaCog, FaEdit, FaTimes } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
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
            "Authorization": `Bearer ${token}`
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

  const fetchOrders = async (page = 1, status = 'all') => {
    if (!isAuthenticated) return;
    
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem("tokenUser");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        ...(status !== 'all' && { status })
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
    if (isAuthenticated && activeSection === 'orders') {
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
          "Authorization": `Bearer ${token}`
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
    router.push('/login');
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
          onClick={() => {
            setActiveSection("orders");
            if (orders.length === 0) {
              fetchOrders(1, statusFilter);
            }
          }}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 text-right
            ${
              activeSection === "orders"
                ? "bg-blue-600 shadow-lg transform scale-105 "
                : "hover:bg-blue-700/50 "
            }`}
        >
          <BsCartCheckFill className="text-lg" />
          <span className="font-medium"> سفارشات </span>
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
        className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl rounded-2xl mx-4 p-6 lg:p-10 space-y-6"
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      processing: 'bg-blue-500/20 text-blue-300',
      shipped: 'bg-purple-500/20 text-purple-300',
      delivered: 'bg-green-500/20 text-green-300',
      cancelled: 'bg-red-500/20 text-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: 'در انتظار',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده'
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const OrdersSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 lg:p-6 shadow-2xl rounded-2xl mx-4 text-white"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl lg:text-2xl font-bold flex items-center gap-3">
          <BsCartCheckFill className="text-xl" />
          سفارشات من
        </h3>
        
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="all" className="text-gray-800">همه وضعیت‌ها</option>
          <option value="pending" className="text-gray-800">در انتظار</option>
          <option value="processing" className="text-gray-800">در حال پردازش</option>
          <option value="shipped" className="text-gray-800">ارسال شده</option>
          <option value="delivered" className="text-gray-800">تحویل داده شده</option>
          <option value="cancelled" className="text-gray-800">لغو شده</option>
        </select>
      </div>

      {isLoadingOrders ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">در حال بارگذاری...</p>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-green-300 font-bold text-sm">
                      {order.totalAmount.toLocaleString()} تومان
                    </span>
                  </div>
                  
                  <div className="text-xs text-white/70">
                    <span className="font-mono">
                      #{order._id.slice(-8)}
                    </span>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-2 text-xs">
                    <div className="text-white/80 mb-1">آدرس تحویل:</div>
                    <div className="text-white/60 leading-relaxed">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60">
                    {new Date(order.date || Date.now()).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 bg-white/10 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                قبلی
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      page === currentPage 
                        ? 'bg-white text-blue-600 font-medium' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={!pagination.hasNext}
                className="px-3 py-2 bg-white/10 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                بعدی
              </button>
            </div>
          )}
          
          {pagination && (
            <div className="text-center text-white/60 text-xs mt-4">
              نمایش {orders.length} از {pagination.totalOrders} سفارش
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <BsCartCheckFill className="text-4xl text-white/30 mx-auto" />
          </div>
          <p className="text-lg text-white/80">
            {statusFilter === 'all' ? 'شما هنوز سفارشی ندارید.' : `سفارشی با وضعیت "${getStatusText(statusFilter)}" یافت نشد.`}
          </p>
        </div>
      )}
    </motion.div>
  );

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
              onClick={() => {
                setActiveSection("orders");
                if (orders.length === 0) {
                  fetchOrders(1, statusFilter);
                }
              }}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeSection === "orders"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              سفارشات
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
        <main className="flex-1  bg-gray-50 min-h-screen w-full">
          <div className="py-4 lg:py-8">
            {activeSection === "profile" && <ProfileSection />}
            {activeSection === "orders" && <OrdersSection />}
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
                آیا مطمئن هستید که میخواهید از حساب کاربری خود خارج شوید؟
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
                onClick={() => {
                  setIsModalOpen(false);
                  handleLogout();
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
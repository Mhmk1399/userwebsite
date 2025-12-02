"use client";

import { useEffect, useState, Suspense } from "react";
import {  useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<{
    authority?: string;
    status?: string;
    error?: string;
  }>({});

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const error = searchParams.get("error");

    setErrorInfo({ authority: authority || undefined, status: status || undefined, error: error || undefined });
  }, [searchParams]);

  const getErrorMessage = () => {
    if (errorInfo.error === "invalid_authority") {
      return "کد تراکنش نامعتبر است";
    }
    if (errorInfo.error === "session_expired") {
      return "جلسه پرداخت منقضی شده است";
    }
    if (errorInfo.error === "order_not_found") {
      return "سفارش یافت نشد";
    }
    if (errorInfo.error === "verify_failed") {
      return "تایید پرداخت ناموفق بود";
    }
    if (errorInfo.error === "amount_mismatch") {
      return "مبلغ پرداختی مطابقت ندارد";
    }
    if (errorInfo.error === "transaction_failed") {
      return "تراکنش ناموفق بود";
    }
    if (errorInfo.error === "server_error") {
      return "خطای سرور رخ داده است";
    }
    if (errorInfo.status === "NOK") {
      return "پرداخت توسط کاربر لغو شد";
    }
    return "پرداخت با خطا مواجه شد";
  };

  const getErrorTitle = () => {
    if (errorInfo.status === "NOK") {
      return "پرداخت لغو شد";
    }
    return "پرداخت ناموفق";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-8">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center relative z-10 border border-white/50"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl opacity-30"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4"
        >
          {getErrorTitle()}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mb-8"
        >
          {getErrorMessage()}
        </motion.p>

        {/* Error Details */}
        {errorInfo.authority && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 mb-8 text-right"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              اطلاعات تراکنش
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                <span className="text-gray-600 font-medium">
                  شماره Authority:
                </span>
                <span className="font-bold text-gray-800 font-mono text-sm">
                  {errorInfo.authority.substring(0, 20)}...
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                <span className="text-gray-600 font-medium">وضعیت:</span>
                <span className="font-bold text-red-600">ناموفق</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Common Failure Reasons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 text-right"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            دلایل احتمالی عدم موفقیت:
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>لغو تراکنش توسط کاربر</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>موجودی کافی در حساب نبود</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>اشکال در درگاه بانکی</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>وارد کردن اطلاعات نادرست کارت</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>منقضی شدن زمان پرداخت</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            تلاش مجدد پرداخت
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-xl font-bold hover:bg-red-50 transform hover:scale-105 transition-all duration-300"
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
            بازگشت به صفحه اصلی
          </Link>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
        >
          <p className="text-sm text-blue-800 flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                clipRule="evenodd"
              />
            </svg>
            در صورت کسر وجه و عدم ثبت سفارش، مبلغ ظرف 72 ساعت به حساب شما بازگردانده می‌شود
          </p>
        </motion.div>
      </motion.div>

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
      `}</style>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              در حال بارگذاری...
            </h2>
          </div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}

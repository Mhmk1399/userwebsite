"use client";

import { useEffect, useState, Suspense } from "react";
import {  useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cartService } from "@/lib/cartService";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<{
    authority: string;
    refId: string;
    orderId: string;
  } | null>(null);

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const refId = searchParams.get("RefID");
    const orderId = searchParams.get("OrderID");

    if (authority && refId && orderId) {
      setPaymentInfo({ authority, refId, orderId });
      
      // Clear cart after successful payment
      if (typeof window !== "undefined") {
        cartService.clearCart().then(() => {
          console.log("Cart cleared after successful payment");
        });
      }
      
      toast.success("پرداخت با موفقیت انجام شد");
    } else {
      toast.error("اطلاعات پرداخت یافت نشد");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center relative z-10 border border-white/50"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-30"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4"
        >
          پرداخت موفق!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mb-8"
        >
          سفارش شما با موفقیت ثبت شد و به زودی پردازش خواهد شد
        </motion.p>

        {/* Payment Details */}
        {paymentInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 text-right"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-green-600"
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
              جزئیات پرداخت
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                <span className="text-gray-600 font-medium">کد پیگیری:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 font-mono">
                    {paymentInfo.refId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.refId);
                      toast.success("کد پیگیری کپی شد");
                    }}
                    className="text-green-600 hover:text-green-700 transition-colors"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                <span className="text-gray-600 font-medium">
                  شماره Authority:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 font-mono text-sm">
                    {paymentInfo.authority.substring(0, 20)}...
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.authority);
                      toast.success("Authority کپی شد");
                    }}
                    className="text-green-600 hover:text-green-700 transition-colors"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                <span className="text-gray-600 font-medium">شماره سفارش:</span>
                <span className="font-bold text-gray-800 font-mono">
                  #{paymentInfo.orderId.substring(paymentInfo.orderId.length - 8)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-100 rounded-xl border-2 border-green-200">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                لطفا کد پیگیری را برای پیگیری سفارش خود نگه دارید
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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

          <Link
            href="/store"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl font-bold hover:bg-green-50 transform hover:scale-105 transition-all duration-300"
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
            ادامه خرید
          </Link>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              در حال بارگذاری...
            </h2>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

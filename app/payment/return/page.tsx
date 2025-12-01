"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cartService } from "@/lib/cartService";

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState<{
    paymentStatus: string;
    refId: string;
    orderId: string;
    amount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get return token from URL
        const returnToken = searchParams.get("token");

        if (!returnToken) {
          setError("توکن بازگشت یافت نشد");
          setLoading(false);
          return;
        }

        console.log("Verifying return token...");

        // Call our API to verify the return token
        const response = await fetch("/api/payment/verify-return", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ returnToken }),
        });

        const data = await response.json();
        console.log("Verification response:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || "تایید پرداخت ناموفق بود");
        }

        setVerificationData(data);

        if (data.paymentStatus === "success") {
          toast.success("پرداخت با موفقیت انجام شد");

          // Clear cart after successful payment
          if (typeof window !== "undefined") {
            await cartService.clearCart();
          }

          // Redirect to order details after 3 seconds
          setTimeout(() => {
            router.push(`/dashboard/orders/${data.orderId}`);
          }, 3000);
        } else {
          toast.error("پرداخت ناموفق بود");
          setTimeout(() => {
            router.push("/cart");
          }, 3000);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setError(
          error instanceof Error ? error.message : "خطا در تایید پرداخت"
        );
        toast.error(
          error instanceof Error ? error.message : "خطا در تایید پرداخت"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  // IndexedDB removed - using backend API via cartService

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            در حال تایید پرداخت...
          </h2>
          <p className="text-gray-600">لطفا صبر کنید</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md"
        >
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            خطا در تایید پرداخت
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/cart")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            بازگشت به سبد خرید
          </button>
        </motion.div>
      </div>
    );
  }

  if (verificationData?.paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md"
        >
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">پرداخت موفق</h2>
          <p className="text-gray-600 mb-4">پرداخت شما با موفقیت انجام شد</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-right">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">کد پیگیری:</span>
              <span className="font-bold text-gray-800">
                {verificationData.refId}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">شماره سفارش:</span>
              <span className="font-bold text-gray-800">
                {verificationData.orderId.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">مبلغ پرداختی:</span>
              <span className="font-bold text-gray-800">
                {verificationData.amount.toLocaleString()} تومان
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            در حال انتقال به صفحه سفارش...
          </p>

          <button
            onClick={() =>
              router.push(`/dashboard/orders/${verificationData.orderId}`)
            }
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full"
          >
            مشاهده سفارش
          </button>
        </motion.div>
      </div>
    );
  }

  // Payment failed
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md"
      >
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
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
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">پرداخت ناموفق</h2>
        <p className="text-gray-600 mb-6">
          متأسفانه پرداخت شما با موفقیت انجام نشد
        </p>
        <button
          onClick={() => router.push("/cart")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-full"
        >
          بازگشت به سبد خرید
        </button>
      </motion.div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">در حال بارگذاری...</h2>
        </div>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  );
}

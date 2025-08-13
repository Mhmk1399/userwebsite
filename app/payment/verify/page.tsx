"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

function PaymentVerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [authority, setAuthority] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlAuthority = searchParams.get("Authority");
    const urlStatus = searchParams.get("Status");

    if (urlAuthority) {
      setAuthority(urlAuthority);
      if (urlStatus === "OK") {
        verifyAndProcessOrder(urlAuthority);
      } else {
        setStatus("failed");
      }
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  const verifyAndProcessOrder = async (authority: string) => {
    try {
      // Get cart data from localStorage (stored before payment)
      const orderData = localStorage.getItem("pendingOrder");
      if (!orderData) {
        throw new Error("No pending order found");
      }

      const parsedOrderData = JSON.parse(orderData);

      // Verify payment with Zarinpal
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authority,
          amount: parsedOrderData.totalAmount // Convert to Rials
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success) {
        throw new Error("Payment verification failed");
      }

      // Submit order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...parsedOrderData,
          paymentStatus: "completed",
          paymentAuthority: authority,
          paymentRefId: verifyResult.ref_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      // Clear cart and pending order
      const db = await openDB();
      const transaction = (db as IDBDatabase).transaction("cart", "readwrite");
      const store = transaction.objectStore("cart");
      await store.clear();
      localStorage.removeItem("pendingOrder");

      setStatus("success");
      toast.success("پرداخت با موفقیت انجام شد");
    } catch (error) {
      console.error("Order processing error:", error);
      setStatus("failed");
      toast.error("خطا در پردازش سفارش");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">در حال پردازش پرداخت</h2>
            <p className="text-gray-600">لطفا صبر کنید...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">پرداخت موفق</h2>
            <p className="text-gray-600 mb-4">شماره پیگیری: {authority}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              بازگشت به صفحه اصلی
            </motion.button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">پرداخت ناموفق</h2>
            <p className="text-gray-600 mb-4">پرداخت شما انجام نشد</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/cart")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              بازگشت به سبد خرید
            </motion.button>
          </>
        )}
      </motion.div>
    </>
  );
}

export default function PaymentVerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">در حال بارگذاری</h2>
        </div>
      }>
        <PaymentVerifyContent />
      </Suspense>
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
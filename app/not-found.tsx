"use client";
import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            404
          </h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            صفحه مورد نظر یافت نشد
          </h2>
          <p className="text-gray-600 text-lg">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            <FaHome />
            بازگشت به صفحه اصلی
          </Link>
          
          <Link
            href="/store"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all"
          >
            <FaSearch />
            مشاهده فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}

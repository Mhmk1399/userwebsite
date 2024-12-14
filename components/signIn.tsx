"use client";
import React, { useState } from "react";

const SignIn = () => {
  const [formType, setFormType] = useState<"login" | "signup">("signup");

  const toggleForm = () => {
    setFormType((prev) => (prev === "login" ? "signup" : "login"));
  };

  const renderForm = () => {
    switch (formType) {
      case "signup":
        return (
          <form className="flex flex-col p-12">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              فرم ثبت نام
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                placeholder="نام"
                className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
            <input
              placeholder="ایمیل"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="email"
            />
            <input
              placeholder="رمز عبور"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
            />
            <input
              placeholder="تکرار رمز عبور"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
            />
            <p className="text-white mt-4">
              آیا از قبل ثبت نام کرده‌اید؟
              <button
                type="button"
                className="text-sm mr-1 text-blue-500 hover:underline"
                onClick={toggleForm}
              >
                ورود به حساب کاربری
              </button>
            </p>
            <button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 transition ease-in-out duration-150"
              type="submit"
            >
              ثبت نام
            </button>
          </form>
        );

      case "login":
        return (
          <form className="flex flex-col max-w-5xl w-full p-12">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">فرم ورود</h2>
            <input
              placeholder="ایمیل"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-3 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="email"
              required
            />
            <input
              placeholder="رمز عبور"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-3 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
              required
            />
            <p className="text-white mt-4">
              آیا حساب کاربری ندارید؟
              <button
                type="button"
                className="text-sm mr-1 text-blue-500 hover:underline"
                onClick={toggleForm}
              >
                ثبت نام
              </button>
            </p>
            <button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 transition ease-in-out duration-150"
              type="submit"
            >
              ورود
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen dark"
      dir="rtl"
    >
      <div className="max-w-md bg-gray-800 rounded-lg shadow-md p-6 mx-2">
        {renderForm()}
      </div>
    </div>
  );
};

export default SignIn;

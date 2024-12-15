"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import React, { useState } from "react";

interface FormErrors {
  name?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignIn = () => {
  const router = useRouter();
  const navigateToDashboard = useCallback(() => {
    router.replace("/");
  }, [router]);

  const [formType, setFormType] = useState<"login" | "signup">("signup");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (formType === "signup") {
      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = "نام الزامی است";
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "رمز عبور مطابقت ندارد";
      }
    }

    // Phone validation
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "شماره تلفن معتبر نیست (مثال: 09123456789)";
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleForm = () => {
    setFormType((prev) => (prev === "login" ? "signup" : "login"));
    // Reset form and errors when switching
    setFormData({
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) return;

    setIsLoading(true);

    const url = formType === "signup" ? "/api/auth" : "/api/auth/login";

    const dataToSend =
      formType === "signup"
        ? {
            name: formData.name,
            phone: formData.phone,
            password: formData.password,
          }
        : {
            phone: formData.phone,
            password: formData.password,
          };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error messages from server
        console.log(result.message || "خطا در برقراری ارتباط");
        return;
      }

      // Success handling
      console.log(
        formType === "signup"
          ? "ثبت نام با موفقیت انجام شد"
          : "ورود موفقیت آمیز بود"
      );
      if (response.status === 200 || response.status === 201) {
        navigateToDashboard();
      }
    } catch (error) {
      console.log("خطای سیستمی. لطفاً مجدداً تلاش کنید", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (formType) {
      case "signup":
        return (
          <form className="flex flex-col p-12" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              فرم ثبت نام
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                name="name"
                placeholder="نام"
                className={`bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 mb-2 
                  ${errors.name ? "border-2 border-red-500" : ""}`}
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mb-2">{errors.name}</p>
              )}
            </div>
            <input
              name="phone"
              placeholder="phone"
              className={`bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 mb-2 
                ${errors.phone ? "border-2 border-red-500" : ""}`}
              type="text"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
            )}

            <input
              name="password"
              placeholder="رمز عبور"
              className={`bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 mb-2 
                ${errors.password ? "border-2 border-red-500" : ""}`}
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}

            <input
              name="confirmPassword"
              placeholder="تکرار رمز عبور"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-2">
                {errors.confirmPassword}
              </p>
            )}

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
              className={`bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 
  ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"}`}
              type="submit"
              disabled={isLoading}
            >
              ثبت نام
            </button>
          </form>
        );

      case "login":
        return (
          <form
            className="flex flex-col max-w-5xl w-full p-12"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-gray-200 mb-4">فرم ورود</h2>
            <input
              name="phone"
              placeholder="شماره تلفن"
              className={`bg-gray-700 text-gray-200 border-0 rounded-md p-3 mb-2 
                ${errors.phone ? "border-2 border-red-500" : ""}`}
              type="text"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
            )}

            <input
              name="password"
              placeholder="رمز عبور"
              className={`bg-gray-700 text-gray-200 border-0 rounded-md p-3 mb-2 
                ${errors.password ? "border-2 border-red-500" : ""}`}
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}

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
              className={`bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 
  ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"}`}
              type="submit"
            >
              {isLoading ? "در حال ورود..." : "ورود"}
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

"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const AuthContainer: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = isLogin
    ? [
        {
          id: "phone",
          label: "شماره تلفن",
          type: "text",
          placeholder: "شماره تلفن",
        },
        {
          id: "password",
          label: "گذرواژه",
          type: "password",
          placeholder: "گذرواژه",
        },
      ]
    : [
        {
          id: "name",
          label: "نام و نام خانوادگی",
          type: "text",
          placeholder: "نام و نام خانوادگی",
        },
        {
          id: "phone",
          label: "شماره تلفن",
          type: "phone",
          placeholder: "شماره تلفن",
        },
        { id: "email", label: "ایمیل", type: "email", placeholder: "ایمیل" },
        {
          id: "password",
          label: "گذرواژه",
          type: "password",
          placeholder: "گذرواژه",
        },
        {
          id: "confirmPassword",
          label: "تکرار گذرواژه",
          type: "password",
          placeholder: "تکرار گذرواژه",
        },
      ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    setLoading(true);

    try {
      let response;
      switch (isLogin) {
        case true: {
          const { phone, password } = formValues;
          response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
          });
          const data = await response.json();
          if (response.ok && data.token) {
            localStorage.setItem("tokenUser", data.token);
            localStorage.setItem("userId", data.userId);
            // Store user name from the response
            if (data.newUser && data.newUser.name) {
              localStorage.setItem("userName", data.newUser.name);
            }
            toast.success("ورود با موفقیت انجام شد");
            // Redirect to home page after successful login
            router.push(`/`);
          } else {
            toast.error("ورود با موفقیت انجام نشد");
          }
          break;
        }

        case false: {
          const { name, phone, email, password, confirmPassword } = formValues;
          if (password !== confirmPassword) {
            setModalError(true);
            return;
          }
          response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            // Store user data for signup but don't redirect
            localStorage.setItem("tokenUser", data.token);
            localStorage.setItem("userId", data.userId);
            if (data.newUser && data.newUser.name) {
              localStorage.setItem("userName", data.newUser.name);
            }

            toast.success("ثبت نام با موفقیت انجام شد");

            // Switch to login form after successful signup
            setTimeout(() => {
              setIsLogin(true);
              // Clear form data
              setFormData({});
              // Reset the form
              const form = event.currentTarget;
              form.reset();
            }, 1500);
          } else {
            toast.error("ثبت نام با موفقیت انجام نشد");
          }
          break;
        }
      }
    } catch (error) {
      setModalError(true);
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "phone":
        if (!/^09[0-9]{9}$/.test(value)) {
          newErrors[name] = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
        } else {
          delete newErrors[name];
        }
        break;

      case "password":
        if (value.length < 8) {
          newErrors[name] = "رمز عبور باید حداقل ۸ کاراکتر باشد";
        } else if (!/[A-Z]/.test(value)) {
          newErrors[name] = "رمز عبور باید شامل حداقل یک حرف بزرگ باشد";
        } else {
          delete newErrors[name];
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = "ایمیل معتبر نیست";
        } else {
          delete newErrors[name];
        }
        break;

      case "name":
        if (value.length < 3) {
          newErrors[name] = "نام باید حداقل ۳ کاراکتر باشد";
        } else {
          delete newErrors[name];
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          newErrors[name] = "تکرار رمز عبور مطابقت ندارد";
        } else {
          delete newErrors[name];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div
      className=" bg-white flex items-center justify-center px-10 py-20 md:mt-40 lg:p-0 "
      dir="rtl"
    >
      {modalSuccess && (
        <Modal
          type="success"
          message="عملیات موفق بود"
          onClose={() => setModalSuccess(false)}
        />
      )}
      {modalError && (
        <Modal
          type="error"
          message="خطا در عملیات"
          onClose={() => setModalError(false)}
        />
      )}

      <div className="w-full max-w-md transform transition-all">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            بازگشت به صفحه اصلی
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "ورود به حساب کاربری" : "ایجاد حساب کاربری"}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label
                htmlFor={field.id}
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  autoComplete="on"
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                    transition-all duration-300 focus:outline-none focus:ring-0
                    ${
                      errors[field.id]
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50"
                    }
                    hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100`}
                />
                {/* Input Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {field.type === "email" && (
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  )}
                  {field.type === "password" && (
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  )}
                  {field.type === "text" && (
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {errors[field.id] && (
                <div className="flex items-center gap-2 text-red-600 text-sm animate-fadeIn">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors[field.id]}</span>
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0 || loading}
            className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 
              transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200
              ${
                Object.keys(errors).length > 0 || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                در حال پردازش...
              </div>
            ) : (
              <span>{isLogin ? "ورود به حساب" : "ایجاد حساب جدید"}</span>
            )}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">یا</span>
            </div>
          </div>

          <div className="mt-6">
            {isLogin ? (
              <p className="text-gray-600">
                حساب کاربری ندارید؟{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 
                    hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                >
                  ثبت نام کنید
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                قبلاً حساب کاربری دارید؟{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 
                    hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                >
                  وارد شوید
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModalProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Modal = ({ type, message, onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
    <div
      className={`px-16 py-8 rounded-lg  shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <p className="text-white">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 text-white w-full bg-gray-700 py-1 px-4 rounded-lg"
      >
        بستن
      </button>
    </div>
  </div>
);

export default AuthContainer;

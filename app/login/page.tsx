"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "صفحه ورود";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "صفحه ورود");
    }
  }, []);

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
            const userId = data.userId;
            localStorage.setItem("userId", userId);
            router.push(`/`);
          } else {
            setModalError(true);
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
          break;
        }
      }

      if (response.ok) {
        setModalSuccess(true);
        setTimeout(async () => {
          if (!isLogin) {
            setIsLogin(true);

            const data = await response.json();
            localStorage.setItem("tokenUser", data.token);
            localStorage.setItem("userId", data.userId);
          } else {
            router.push(`/`);
          }
        }, 3000);
      } else {
        setModalError(true);
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
      className="min-h-screen bg-gradient-to-b from-white to-indigo-200 flex items-center justify-center p-10 lg:p-0 "
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
        <h1 className="text-3xl my-4 font-bold text-center text-blue-600 border-b border-gray-300 pb-2">
          {isLogin ? "ورود" : "ثبت نام"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block font-medium mb-1  text-gray-500"
              >
                {field.label}:
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required
                autoComplete="on"
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg text-black/80 outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 
                  ${errors[field.id] ? "border-red-500" : "border-gray-300"}`}
              />
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`w-full py-3 text-white rounded-lg transition-colors
              ${
                Object.keys(errors).length > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-l from-blue-400 to-blue-700 hover:bg-blue-600"
              }`}
          >
            {loading ? "در حال پردازش..." : isLogin ? "ورود" : "ثبت نام"}
          </button>
        </form>

        <div className="text-center mt-3">
          {isLogin ? (
            <>
              <p className="text-gray-700 ml-2 inline">حساب کاربری ندارید؟</p>
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 font-bold inline"
              >
                ثبت نام
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-700 ml-2 inline">حساب دارید؟</p>
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 font-bold"
              >
                ورود
              </button>
            </>
          )}
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

export default Auth;

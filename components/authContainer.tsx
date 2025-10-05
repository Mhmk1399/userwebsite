"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Threads from "./Threads";

const AuthContainer: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "sms" | "password">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");

  const [smsLoading, setSmsLoading] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendSmsCode = async (phone: string) => {
    setSmsLoading(true);
    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      if (response.ok) {
        toast.success("کد تایید ارسال شد");
        setStep("sms");
        setPhoneNumber(phone);
        setCountdown(60);
      } else {
        toast.error("خطا در ارسال کد");
      }
    } catch {
      toast.error("خطا در ارسال کد");
    } finally {
      setSmsLoading(false);
    }
  };

  const verifySmsCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: smsCode }),
      });

      if (response.ok) {
        toast.success("کد تایید شد");
        setStep("password");
      } else {
        toast.error("کد نامعتبر است");
      }
    } catch {
      toast.error("خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          code: smsCode,
          newPassword: password,
        }),
      });

      if (response.ok) {
        toast.success("رمز عبور با موفقیت تغییر کرد");
        setIsForgetPassword(false);
        setIsLogin(true);
        setStep("phone");
      } else {
        toast.error("خطا در تغییر رمز عبور");
      }
    } catch {
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    if (step === "phone") {
      const phone = formValues.phone as string;
      if (!/^09\d{9}$/.test(phone)) {
        toast.error("شماره تلفن نامعتبر است");
        return;
      }

      if (!isLogin && !isForgetPassword) {
        try {
          const checkResponse = await fetch("/api/auth/check-phone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: phone }),
          });
          const checkData = await checkResponse.json();

          if (checkData.exists) {
            toast.error("کاربری با این شماره قبلاً ثبت نام کرده است");
            setTimeout(() => {
              setIsLogin(true);
              toast.success("لطفاً وارد شوید");
            }, 1500);
            return;
          }
        } catch (error) {
          console.error("Phone check error:", error);
        }
      }

      await sendSmsCode(phone);
      return;
    }

    if (step === "sms") {
      await verifySmsCode();
      return;
    }

    if (isForgetPassword) {
      const { password, confirmPassword } = formValues;
      if (password !== confirmPassword) {
        toast.error("رمزهای عبور مطابقت ندارند");
        return;
      }
      await resetPassword(password as string);
      return;
    }

    setLoading(true);

    try {
      let response;
      switch (isLogin) {
        case true: {
          if (isSubmitting) return;
          setIsSubmitting(true);

          const { password } = formValues;
          response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phoneNumber, password }),
          });
          const data = await response.json();
          if (response.ok && data.token) {
            localStorage.setItem("tokenUser", data.token);
            localStorage.setItem("userId", data.userId);
            if (data.newUser && data.newUser.name) {
              localStorage.setItem("userName", data.newUser.name);
            }
            toast.success("ورود با موفقیت انجام شد");
            router.push(`/dashboard`);
          } else {
            toast.error("ورود با موفقیت انجام نشد");
            setIsSubmitting(false);
          }
          break;
        }

        case false: {
          const { name, email, password, confirmPassword } = formValues;
          if (password !== confirmPassword) {
            setModalError(true);
            return;
          }
          response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone: phoneNumber, email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("tokenUser", data.token);
            localStorage.setItem("userId", data.userId);
            if (data.newUser && data.newUser.name) {
              localStorage.setItem("userName", data.newUser.name);
            }

            toast.success("ثبت نام با موفقیت انجام شد");

            setTimeout(() => {
              setIsLogin(true);
              setStep("phone");
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

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-10 py-20 lg:p-0 bg-white"
      dir="rtl"
    >
      <div className="absolute inset-0 z-0">
        <Threads
          color={[0, 1, 4]}
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
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

        <div className="bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform transition-all border border-white/20">
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

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === "phone"
                ? isForgetPassword
                  ? "بازیابی رمز عبور"
                  : isLogin
                  ? "ورود به حساب کاربری"
                  : "ایجاد حساب کاربری"
                : step === "sms"
                ? "تایید شماره تلفن"
                : isForgetPassword
                ? "رمز عبور جدید"
                : "تکمیل اطلاعات"}
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === "phone" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  شماره تلفن
                </label>
                <div className="relative">
                  <input
                    name="phone"
                    type="text"
                    placeholder="09xxxxxxxxx"
                    required
                    className="w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                      transition-all duration-300 focus:outline-none focus:ring-0
                      border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50
                      hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100"
                  />
                </div>
              </div>
            )}

            {step === "sms" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  کد تایید ارسال شده به {phoneNumber}
                  {countdown > 0 && (
                    <span className="text-blue-600 block text-sm mt-1">
                      ارسال مجدد در {countdown} ثانیه
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    name="smsCode"
                    type="text"
                    placeholder="کد 6 رقمی"
                    maxLength={6}
                    required
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                      transition-all duration-300 focus:outline-none focus:ring-0
                      border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50
                      hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100"
                  />
                </div>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={() => sendSmsCode(phoneNumber)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>
            )}

            {step === "password" && (
              <>
                {!isLogin && !isForgetPassword && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نام و نام خانوادگی
                      </label>
                      <input
                        name="name"
                        type="text"
                        placeholder="نام و نام خانوادگی"
                        required
                        className="w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                          transition-all duration-300 focus:outline-none focus:ring-0
                          border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50
                          hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ایمیل
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="ایمیل"
                        required
                        className="w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                          transition-all duration-300 focus:outline-none focus:ring-0
                          border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50
                          hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isForgetPassword ? "رمز عبور جدید" : "گذرواژه"}
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isForgetPassword ? "رمز عبور جدید" : "گذرواژه"}
                      required
                      className="w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                        transition-all duration-300 focus:outline-none focus:ring-0
                        border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50
                        hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {(!isLogin || isForgetPassword) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تکرار گذرواژه
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="تکرار گذرواژه"
                        required
                        className="w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-800 placeholder-gray-400 
                          transition-all duration-300 focus:outline-none focus:ring-0
                          border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50
                          hover:border-gray-300 focus:shadow-lg focus:shadow-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading || smsLoading}
              className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 
                transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200
                ${
                  loading || smsLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
            >
              {loading || smsLoading ? (
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
                <span>
                  {step === "phone"
                    ? "ارسال کد تایید"
                    : step === "sms"
                    ? "تایید کد"
                    : isForgetPassword
                    ? "تغییر رمز عبور"
                    : isLogin
                    ? "ورود به حساب"
                    : "ایجاد حساب جدید"}
                </span>
              )}
            </button>
          </form>

          {step === "phone" && (
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">یا</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {!isForgetPassword ? (
                  <>
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
                    {isLogin && (
                      <p className="text-gray-600">
                        رمز عبور خود را فراموش کردهاید؟{" "}
                        <button
                          onClick={() => setIsForgetPassword(true)}
                          className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 
                            hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-1"
                        >
                          بازیابی رمز عبور
                        </button>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">
                    به صفحه ورود بازگردید؟{" "}
                    <button
                      onClick={() => {
                        setIsForgetPassword(false);
                        setIsLogin(true);
                      }}
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 
                        hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    >
                      ورود
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "sms" && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep("phone")}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                بازگشت به مرحله قبل
              </button>
            </div>
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

export default AuthContainer;

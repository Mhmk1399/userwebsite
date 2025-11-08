"use client";
import React, { useState } from "react";
import {  LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import { FaUser } from "react-icons/fa";

interface LoginButtonProps {
  href: string;
  children: React.ReactNode;
  color: string;
}

// Assuming you have a LoginButton component, if not, create a simple one
const LoginButton: React.FC<LoginButtonProps> = ({ href, children, color }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="flex items-center gap-2 px-4 py-2 text-sm hover:opacity-80 font-medium transition-all duration-200"
      style={{ color }}
    >
      {children}
    </button>
  );
};

interface UserMenuProps {
  color?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ color = "#fff" }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsDropdownOpen(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <LoginButton color={color} href="/login">
      ورود | ثبت‌نام  <FaUser size={18} /> 
      </LoginButton>
    );
  }

  return (
    <div className="relative">
      <button
        style={{ color }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span> {user.name}</span>
        <FaUser style={{ color }} size={18} />
        <ChevronDown
          size={16}
          className={`transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <div className="px-4 py-2 flex justify-end text-sm  border-b border-gray-100">
                {user.name}
              </div>

              <button
                onClick={() => {
                  router.push("/dashboard");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                پروفایل کاربری
              </button>

              <hr className="my-1" />

              <button
                onClick={handleLogout}
                className="w-full text-right justify-end px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                خروج
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;

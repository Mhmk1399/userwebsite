"use client";
import { useState, useEffect } from "react";

interface User {
  name: string;
  userId: string;
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("tokenUser");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser({
            name: payload.username || payload.name || userId,
            userId,
            token,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("tokenUser");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
};

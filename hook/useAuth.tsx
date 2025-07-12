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
      const userName = localStorage.getItem("userName");

      if (token && userId && userName) {
        setUser({
          name: userName,
          userId,
          token,
        });
      }
      setIsLoading(false);
    };

    checkAuth();
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

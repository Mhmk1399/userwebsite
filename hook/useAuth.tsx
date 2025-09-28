"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  id: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyToken = async (token: string) => {
    try {
      console.log('Verifying token:', token?.substring(0, 20) + '...');
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      console.log('Token verification response:', data);
      return data.valid ? data.user : null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("tokenUser");
      console.log('Checking auth, token exists:', !!token);
      
      if (token) {
        const userData = await verifyToken(token);
        if (userData) {
          console.log('User authenticated:', userData);
          setUser(userData);
        } else {
          // Token is invalid or expired
          console.log('Token invalid, clearing');
          localStorage.removeItem("tokenUser");
          localStorage.removeItem("userId");
          setUser(null);
        }
      } else {
        console.log('No token found');
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("tokenUser");
      localStorage.removeItem("userId");
      setUser(null);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
};

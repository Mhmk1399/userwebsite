"use client";
import { useState, useEffect } from "react";

interface UserInfo {
  _id: string;
  storeId: string;
  basic: {
    storeName: string;
    logo: string;
    description: string;
  };
  design: {
    backgroundColor: string;
    font: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    instagram: string;
    telegram: string;
    whatsapp: string;
  };
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/userInfo");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, basic: userInfo?.basic };
};

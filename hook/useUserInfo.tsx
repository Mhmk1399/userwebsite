"use client";
import useSWR from "swr";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useUserInfo = () => {
  const {
    data: userInfo,
    error,
    isLoading,
  } = useSWR<UserInfo>("/api/userInfo", fetcher, {
    refreshInterval: 180000,
  });

  return {
    userInfo,
    loading: isLoading,
    error,
    basic: userInfo?.basic,
    contact: userInfo?.contact,
  };
};

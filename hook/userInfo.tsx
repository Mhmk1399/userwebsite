// hooks/useUserInfo.ts
import useSWR from "swr";

// Types
export interface UserBasicInfo {
  storeName: string;
  logo: string;
  description: string;
  _id: string;
}

export interface UserDesignInfo {
  backgroundColor: string;
  font: string;
  _id: string;
}

export interface UserContactInfo {
  phone: string;
  email: string;
  address: string;
  _id: string;
}

export interface UserSocialInfo {
  instagram: string;
  telegram: string;
  whatsapp: string;
  _id: string;
}

export interface UserInfo {
  _id: string;
  storeId: string;
  basic: UserBasicInfo;
  design: UserDesignInfo;
  contact: UserContactInfo;
  social: UserSocialInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserInfoResponse {
  userInfo: UserInfo;
}

interface UseUserInfoReturn {
  userInfo: UserInfo | null;
  basic: UserBasicInfo | null;
  design: UserDesignInfo | null;
  contact: UserContactInfo | null;
  social: UserSocialInfo | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate: () => void;
  refetch: () => void;
}

// Helper function to get token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Fetcher function with Bearer token
const fetcher = async (url: string): Promise<UserInfoResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("توکن یافت نشد. لطفاً وارد شوید");
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle different error cases
  if (response.status === 401) {
    // Unauthorized - token invalid or missing
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    throw new Error("احراز هویت نامعتبر است. لطفاً دوباره وارد شوید");
  }

  if (response.status === 404) {
    throw new Error("اطلاعات کاربر یافت نشد");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `خطا در دریافت اطلاعات: ${response.status}`
    );
  }

  return response.json();
};

/**
 * Custom hook to fetch and manage user info with authentication
 * @returns User info data with loading and error states
 */
export const useUserInfo = (): UseUserInfoReturn => {
  const token = typeof window !== "undefined" ? getAuthToken() : null;

  const { data, error, isLoading, mutate } = useSWR<UserInfoResponse>(
    // Only fetch if token exists
    token ? "/api/userinfo" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      shouldRetryOnError: (error) => {
        // Don't retry on auth errors
        if (error.message.includes("احراز هویت")) {
          return false;
        }
        return true;
      },
      onError: (error) => {
        console.error("User Info Error:", error);
        // You can add toast notification here
      },
    }
  );

  return {
    userInfo: data?.userInfo ?? null,
    basic: data?.userInfo?.basic ?? null,
    design: data?.userInfo?.design ?? null,
    contact: data?.userInfo?.contact ?? null,
    social: data?.userInfo?.social ?? null,
    isLoading,
    isError: !!error,
    error: error ?? null,
    mutate,
    refetch: mutate,
  };
};

// Export individual hooks for specific sections
export const useBasicInfo = () => {
  const { basic, isLoading, isError } = useUserInfo();
  return { basic, isLoading, isError };
};

export const useDesignInfo = () => {
  const { design, isLoading, isError } = useUserInfo();
  return { design, isLoading, isError };
};

export const useContactInfo = () => {
  const { contact, isLoading, isError } = useUserInfo();
  return { contact, isLoading, isError };
};

export const useSocialInfo = () => {
  const { social, isLoading, isError } = useUserInfo();
  return { social, isLoading, isError };
};

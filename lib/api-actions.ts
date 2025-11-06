/**
 * Unified API Actions Client
 * Helper functions for calling action-based API endpoints
 */

// Base API URLs
const AUTH_API = '/api/actions/auth';
const SMS_API = '/api/actions/sms';

/**
 * Generic action caller
 */
async function callAction(endpoint: string, action: string, data?: any, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, data }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
}

/**
 * Auth Actions
 */
export const authActions = {
  /**
   * Register new user
   */
  register: async (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    smsCode: string;
  }) => {
    return callAction(AUTH_API, 'register', data);
  },

  /**
   * Login user
   */
  login: async (data: {
    phone: string;
    password: string;
    smsCode: string;
  }) => {
    return callAction(AUTH_API, 'login', data);
  },

  /**
   * Verify JWT token
   */
  verifyToken: async (token: string) => {
    return callAction(AUTH_API, 'verify-token', { token });
  },

  /**
   * Check if phone exists
   */
  checkPhone: async (phoneNumber: string) => {
    return callAction(AUTH_API, 'check-phone', { phoneNumber });
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    data: {
      userId: string;
      name?: string;
      phone?: string;
    },
    token: string
  ) => {
    return callAction(AUTH_API, 'update-profile', data, token);
  },

  /**
   * Delete user account
   */
  deleteAccount: async (token: string) => {
    return callAction(AUTH_API, 'delete-account', {}, token);
  },

  /**
   * Logout user
   */
  logout: async () => {
    return callAction(AUTH_API, 'logout');
  },

  /**
   * Get user profile
   */
  getProfile: async (userId: string, token: string) => {
    return callAction(AUTH_API, 'get-profile', { userId }, token);
  },
};

/**
 * SMS Actions
 */
export const smsActions = {
  /**
   * Send SMS verification code
   */
  sendCode: async (phoneNumber: string, purpose?: 'register' | 'login' | 'reset-password') => {
    return callAction(SMS_API, 'send-code', { phoneNumber, purpose });
  },

  /**
   * Verify SMS code
   */
  verifyCode: async (phoneNumber: string, code: string) => {
    return callAction(SMS_API, 'verify-code', { phoneNumber, code });
  },

  /**
   * Resend SMS code
   */
  resendCode: async (phoneNumber: string) => {
    return callAction(SMS_API, 'resend-code', { phoneNumber });
  },

  /**
   * Reset password with SMS verification
   */
  resetPassword: async (data: {
    phoneNumber: string;
    code: string;
    newPassword: string;
  }) => {
    return callAction(SMS_API, 'reset-password', data);
  },
};

/**
 * Combined Auth Flow Helpers
 */
export const authFlow = {
  /**
   * Complete registration flow
   */
  async completeRegistration(
    phone: string,
    smsCode: string,
    name: string,
    password: string,
    email?: string
  ) {
    try {
      const result = await authActions.register({
        phone,
        smsCode,
        name,
        password,
        email,
      });

      if (result.success && result.token) {
        localStorage.setItem('tokenUser', result.token);
        localStorage.setItem('userId', result.userId);
        if (result.user?.name) {
          localStorage.setItem('userName', result.user.name);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete login flow
   */
  async completeLogin(phone: string, password: string, smsCode: string) {
    try {
      const result = await authActions.login({
        phone,
        password,
        smsCode,
      });

      if (result.success && result.token) {
        localStorage.setItem('tokenUser', result.token);
        localStorage.setItem('userId', result.userId);
        if (result.user?.name) {
          localStorage.setItem('userName', result.user.name);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete logout flow
   */
  async completeLogout() {
    try {
      await authActions.logout();
      localStorage.removeItem('tokenUser');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    } catch (error) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('tokenUser');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      throw error;
    }
  },

  /**
   * Complete password reset flow
   */
  async completePasswordReset(phone: string, code: string, newPassword: string) {
    try {
      return await smsActions.resetPassword({
        phoneNumber: phone,
        code,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Hook-like helper for checking authentication
 */
export const checkAuth = async () => {
  const token = localStorage.getItem('tokenUser');
  
  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const result = await authActions.verifyToken(token);
    return {
      isAuthenticated: result.valid,
      user: result.user,
    };
  } catch (error) {
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    return { isAuthenticated: false, user: null };
  }
};

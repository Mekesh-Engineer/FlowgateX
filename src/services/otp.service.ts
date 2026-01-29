import axios from 'axios';

const API_BASE = '/api/auth';

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresIn: number;
  otp?: string; // Only in development
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  verificationToken: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string | null;
    role: string;
  };
}

export const otpService = {
  /**
   * Send OTP to email address
   */
  async sendEmailOTP(email: string, firstName: string, type: 'registration' | 'reset' = 'registration'): Promise<SendOTPResponse> {
    try {
      const response = await axios.post<SendOTPResponse>(`${API_BASE}/send-email-otp`, {
        email,
        firstName,
        type,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'Failed to send OTP. Please try again.'
      );
    }
  },

  /**
   * Verify email OTP code
   */
  async verifyEmailOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
    try {
      const response = await axios.post<VerifyOTPResponse>(`${API_BASE}/verify-email-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'Failed to verify OTP. Please try again.'
      );
    }
  },

  /**
   * Register new user with verified email
   */
  async register(data: {
    firstName: string;
    lastName: string;
    mobile?: string;
    email: string;
    gender?: string;
    dob?: string;
    location?: string;
    role?: string;
    password: string;
    verificationToken: string;
    whatsappOptIn?: boolean;
    marketingOptIn?: boolean;
  }): Promise<RegisterResponse> {
    try {
      const response = await axios.post<RegisterResponse>(`${API_BASE}/register`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'Failed to register. Please try again.'
      );
    }
  },
};

export default otpService;

import jwt from 'jsonwebtoken';
import { CartItem } from './types';

/**
 * Generate Payment Token for Vendor Dashboard
 * 
 * Creates a JWT token that will be sent to the vendor dashboard
 * containing all necessary order information.
 * 
 * @param orderData - Order information including items, total, user, etc.
 * @returns JWT token string
 */

interface OrderData {
  orderId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export function generatePaymentToken(orderData: OrderData): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  const STORE_ID = process.env.STORE_ID;
  const RETURN_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  if (!STORE_ID) {
    throw new Error('STORE_ID is not configured');
  }

  // Create payload matching Vendor Payment Integration Guide format
  const payload = {
    // Core identifiers
    storeId: STORE_ID,
    storeUserId: orderData.userId, // Customer ID in your system
    
    // Customer information
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone || '0000000000',
    
    // Shopping cart (required format)
    cart: orderData.items.map(item => ({
      productId: item.productId,
      productName: item.name || '',
      price: item.price,
      quantity: item.quantity,
      ...(item.colorCode && { color: item.colorCode }), // Changed colorCode to color
    })),
    
    // Total amount in Toman
    totalAmount: orderData.totalAmount,
    
    // Return URL for callback
    returnUrl: `${RETURN_URL}/payment/return`,
    
    // IMPORTANT: Shipping address in metadata (required for order creation)
    metadata: {
      orderId: orderData.orderId,
      shippingAddress: orderData.shippingAddress.street,
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      postalCode: orderData.shippingAddress.postalCode,
    },
  };

  // Token expires in 15 minutes
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

/**
 * Verify Return Token from Vendor Dashboard
 * 
 * Verifies the JWT token received when user returns from payment
 * 
 * @param token - JWT token from vendor dashboard
 * @returns Decoded token payload
 */
export function verifyReturnToken(token: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build Vendor Dashboard Payment URL
 * 
 * Creates the full URL to redirect user to vendor dashboard for payment
 * Per Vendor Payment Integration Guide: redirect to /vendorsPaymentPage?token=xxx
 * 
 * @param paymentToken - JWT payment token
 * @returns Full payment URL
 */
export function buildPaymentUrl(paymentToken: string): string {
  const VENDOR_DASHBOARD_URL = process.env.VENDOR_DASHBOARD_URL;

  if (!VENDOR_DASHBOARD_URL) {
    throw new Error('VENDOR_DASHBOARD_URL is not configured');
  }

  // Remove trailing slash if present
  const baseUrl = VENDOR_DASHBOARD_URL.replace(/\/$/, '');
  
  return `${baseUrl}/vendorsPaymentPage?token=${encodeURIComponent(paymentToken)}`;
}

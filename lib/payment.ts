import jwt from 'jsonwebtoken';

/**
 * Generate Payment Token for Vendor Dashboard
 * 
 * Creates a JWT token that will be sent to the vendor dashboard
 * containing all necessary order information.
 * 
 * @param orderData - Order information including items, total, user, etc.
 * @returns JWT token string
 */
interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  colorCode?: string;
  properties?: { name: string; value: string }[];
}

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
  const RETURN_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  if (!STORE_ID) {
    throw new Error('STORE_ID is not configured');
  }

  // Create payload with all fields required by Domain B
  const payload = {
    // Core identifiers
    storeId: STORE_ID,
    orderId: orderData.orderId,
    
    // User identifiers (normalized for backward compatibility)
    userId: orderData.userId,
    storeUserId: orderData.userId, // Alias for Domain B
    
    // Cart/Items (provide both formats for compatibility)
    items: orderData.items.map(item => ({
      productId: item.productId,
      productName: item.name,
      name: item.name, // Alias
      quantity: item.quantity,
      price: item.price,
      ...(item.colorCode && { colorCode: item.colorCode }),
      ...(item.properties && { properties: item.properties }),
    })),
    cart: orderData.items.map(item => ({
      productId: item.productId,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    
    // Amount
    totalAmount: orderData.totalAmount,
    
    // Customer information
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail || '',
    customerPhone: orderData.customerPhone || '0000000000',
    
    // Shipping address
    shippingAddress: orderData.shippingAddress,
    
    // Return URL for Domain B to redirect back
    returnUrl: `${RETURN_URL}/payment/return`,
    
    // Metadata for additional order information
    metadata: {
      orderId: orderData.orderId,
      userId: orderData.userId,
      storeId: STORE_ID,
      createdAt: new Date().toISOString(),
    },
    
    // Timestamp
    timestamp: Date.now(),
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
 * 
 * @param paymentToken - JWT payment token
 * @returns Full payment URL
 */
export function buildPaymentUrl(paymentToken: string): string {
  const VENDOR_DASHBOARD_URL = process.env.VENDOR_DASHBOARD_URL;
  const RETURN_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  if (!VENDOR_DASHBOARD_URL) {
    throw new Error('VENDOR_DASHBOARD_URL is not configured');
  }

  const returnUrl = `${RETURN_URL}/payment/return`;
  
  return `${VENDOR_DASHBOARD_URL}/vendor/payment?token=${encodeURIComponent(paymentToken)}&returnUrl=${encodeURIComponent(returnUrl)}`;
}

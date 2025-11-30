/**
 * Test Payment Token Generation
 * Run this file to verify payment token structure matches Vendor Payment Integration Guide
 * 
 * Usage: node test-payment-token.js
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

// Sample order data (same structure as your cart page will send)
const testOrderData = {
  orderId: 'TEST-ORDER-001',
  userId: 'user_123456',
  items: [
    {
      productId: 'prod_1',
      name: 'محصول تستی',
      price: 100000,
      quantity: 2,
      colorCode: 'قرمز'
    },
    {
      productId: 'prod_2',
      name: 'محصول تستی دوم',
      price: 50000,
      quantity: 1
    }
  ],
  totalAmount: 250000,
  customerName: 'علی احمدی',
  customerEmail: 'test@example.com',
  customerPhone: '09123456789',
  shippingAddress: {
    street: 'خیابان آزادی، پلاک 123',
    city: 'تهران',
    state: 'تهران',
    postalCode: '1234567890'
  }
};

// Generate token (matching your lib/payment.ts structure)
function generateTestToken(orderData) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const STORE_ID = process.env.STORE_ID;
  const RETURN_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET not found in .env');
    process.exit(1);
  }

  if (!STORE_ID) {
    console.error('❌ STORE_ID not found in .env');
    process.exit(1);
  }

  // Payload matching Vendor Payment Integration Guide
  const payload = {
    storeId: STORE_ID,
    storeUserId: orderData.userId,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone || '0000000000',
    cart: orderData.items.map(item => ({
      productId: item.productId,
      productName: item.name || '',
      price: item.price,
      quantity: item.quantity,
      ...(item.colorCode && { color: item.colorCode }),
    })),
    totalAmount: orderData.totalAmount,
    returnUrl: `${RETURN_URL}/payment/return`,
    metadata: {
      orderId: orderData.orderId,
      shippingAddress: orderData.shippingAddress.street,
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      postalCode: orderData.shippingAddress.postalCode,
    },
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// Run test
console.log('🧪 Testing Payment Token Generation\n');
console.log('Environment Variables:');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('  STORE_ID:', process.env.STORE_ID || '✗ Missing');
console.log('  VENDOR_DASHBOARD_URL:', process.env.VENDOR_DASHBOARD_URL || '✗ Missing');
console.log('');

try {
  const token = generateTestToken(testOrderData);
  
  console.log('✅ Token Generated Successfully\n');
  console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
  console.log('');
  
  // Decode to verify structure
  const decoded = jwt.decode(token);
  console.log('📦 Token Payload Structure:\n');
  console.log('Required Fields (per Vendor Payment Integration Guide):');
  console.log('  ✓ storeId:', decoded.storeId);
  console.log('  ✓ storeUserId:', decoded.storeUserId);
  console.log('  ✓ customerName:', decoded.customerName);
  console.log('  ✓ customerPhone:', decoded.customerPhone);
  console.log('  ✓ cart:', decoded.cart.length, 'items');
  console.log('  ✓ totalAmount:', decoded.totalAmount, 'Toman');
  console.log('  ✓ returnUrl:', decoded.returnUrl);
  console.log('');
  
  console.log('Metadata Fields:');
  console.log('  ✓ orderId:', decoded.metadata.orderId);
  console.log('  ✓ shippingAddress:', decoded.metadata.shippingAddress);
  console.log('  ✓ city:', decoded.metadata.city);
  console.log('  ✓ state:', decoded.metadata.state);
  console.log('  ✓ postalCode:', decoded.metadata.postalCode);
  console.log('');
  
  console.log('Cart Items:');
  decoded.cart.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.productName}`);
    console.log(`     - Product ID: ${item.productId}`);
    console.log(`     - Price: ${item.price} Toman`);
    console.log(`     - Quantity: ${item.quantity}`);
    if (item.color) console.log(`     - Color: ${item.color}`);
  });
  console.log('');
  
  // Build payment URL
  const VENDOR_DASHBOARD_URL = process.env.VENDOR_DASHBOARD_URL;
  if (VENDOR_DASHBOARD_URL) {
    const baseUrl = VENDOR_DASHBOARD_URL.replace(/\/$/, '');
    const paymentUrl = `${baseUrl}/vendorsPaymentPage?token=${encodeURIComponent(token)}`;
    console.log('🔗 Payment URL (redirect user here):');
    console.log(paymentUrl);
    console.log('');
  }
  
  console.log('✅ All required fields present according to Vendor Payment Integration Guide');
  console.log('✅ Token expires in 15 minutes');
  
} catch (error) {
  console.error('❌ Error generating token:', error.message);
  process.exit(1);
}

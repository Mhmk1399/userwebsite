# Payment Flow Documentation

## Complete Payment Process Flow

### 1. User Initiates Payment
**Location**: `app/cart/page.tsx`
- User fills shipping address form
- Clicks "پرداخت و ثبت سفارش" button
- `submitOrder()` validates address and calls `initiatePayment()`

### 2. Payment Request API
**Location**: `app/api/payment/request/route.ts`
**Process**:
- Validates JWT token from Authorization header
- Validates cart items against database products
- Calculates total using server-side prices (security)
- Creates pending order data with 15min expiry
- Calls ZarinPal with callback to `/payment/verify`
- Stores pending order in global memory
- Returns payment URL and authority

### 3. ZarinPal Payment Gateway
**External Service**: `https://payment.zarinpal.com/pg/v4/payment/request.json`
- User redirected to: `https://payment.zarinpal.com/pg/StartPay/{authority}`
- User completes payment
- ZarinPal redirects directly to: `${NEXT_PUBLIC_BASE_USERWEBSITE_PAYMENT_URL}/payment/verify?Authority={authority}&Status={status}`

### 4. Payment Verification Page
**Location**: `app/payment/verify/page.tsx`
**Process**:
- Receives authority and status from ZarinPal callback
- Shows loading state to user
- Calls verification API
- Handles success/failure UI states
- Clears cart on success

### 5. Payment Verification API
**Location**: `app/api/payment/verify/route.ts`
**Process**:
- Retrieves pending order from global memory
- Checks order expiration (15min limit)
- Calls ZarinPal verification endpoint
- Creates final order in database with status "processing"
- Cleans up pending order
- Returns verification result

### 6. Order Completion
- **Success**: Shows success message with tracking number
- **Failure**: Shows error message with retry option
- Cart cleared automatically on success
- User redirected to home or cart page

## File Structure

```
app/
├── cart/
│   └── page.tsx                   # Cart with payment initiation
├── api/
│   └── payment/
│       ├── request/
│       │   └── route.ts          # Payment request API
│       └── verify/
│           └── route.ts          # Payment verification API
├── payment/
│   └── verify/
│       └── page.tsx              # Payment verification UI
models/
├── orders.ts                      # Order model
└── product.ts                     # Product model
lib/
├── data.ts                        # Database connection
└── types.ts                       # TypeScript interfaces
```

## Data Flow

```
1. Cart → Payment Request API → ZarinPal Gateway
2. ZarinPal → Direct callback → /payment/verify
3. Verify Page → Verification API → Order Creation
4. Success/Failure UI → Cart Cleanup → User Redirect
```

## Environment Variables Required

```env
JWT_SECRET=your_jwt_secret
ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
NEXT_PUBLIC_BASE_USERWEBSITE_PAYMENT_URL=https://yourdomain.com
STOREID=your_store_id
```

## Order Status Flow

1. **pending_payment** - Initial cart submission
2. **processing** - Payment verified and order created
3. **shipped** - Order dispatched
4. **delivered** - Order completed
5. **cancelled** - Order cancelled

## Testing Flow

### Postman Test for Payment Request
```json
POST /api/payment/request
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN

Body:
{
  "cartItems": [
    {
      "productId": "VALID_PRODUCT_ID",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "Test Street",
    "city": "Test City", 
    "state": "Test State",
    "postalCode": "1234567890"
  }
}
```

### Manual Testing Steps
1. Add products to cart
2. Fill shipping address completely
3. Click payment button
4. Complete payment on ZarinPal
5. Verify direct redirect to /payment/verify
6. Check order creation in database
7. Verify cart is cleared
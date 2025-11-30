# Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN A (Your Store)                                │
│                      https://yourstore.com                                   │
└─────────────────────────────────────────────────────────────────────────────┘

    👤 Customer
     │
     │ 1️⃣  Browses products
     ▼
┌──────────────┐
│ /store page  │ → Adds products to cart → IndexedDB (client-side)
└──────────────┘
     │
     │ 2️⃣  Views cart
     ▼
┌──────────────┐
│  /cart page  │ → Shows cart items from IndexedDB
└──────────────┘
     │            → Customer fills shipping form:
     │              • street, city, state, postalCode
     │
     │ 3️⃣  Clicks "پرداخت و ثبت سفارش"
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  POST /api/payment/checkout                                            │
│                                                                        │
│  Headers:                                                              │
│    Authorization: Bearer tokenUser (from localStorage)                │
│                                                                        │
│  Body:                                                                 │
│    {                                                                   │
│      cartItems: [...from IndexedDB...],                               │
│      shippingAddress: { street, city, state, postalCode }             │
│    }                                                                   │
│                                                                        │
│  Backend Process:                                                      │
│  ✓ Verify JWT token → Extract userId                                 │
│  ✓ Fetch user from database → Get name & phone                       │
│  ✓ Validate products from database → Server-side prices              │
│  ✓ Create Order (status: pending, paymentStatus: pending)            │
│  ✓ Generate JWT payment token                                        │
│                                                                        │
│  Payment Token Contains:                                               │
│  {                                                                     │
│    storeId: "storemibyro6v1nfhv9",                                    │
│    storeUserId: "user_123",           ← From JWT                     │
│    customerName: "علی احمدی",          ← From database               │
│    customerPhone: "09123456789",       ← From database               │
│    cart: [                             ← From IndexedDB              │
│      { productId, productName, price, quantity, color }              │
│    ],                                                                  │
│    totalAmount: 200000,                ← Calculated                  │
│    returnUrl: "https://yourstore.com/payment/return",                │
│    metadata: {                         ← From user form              │
│      orderId: "ORDER_123",                                           │
│      shippingAddress: "خیابان آزادی...",                             │
│      city: "تهران",                                                  │
│      state: "تهران",                                                 │
│      postalCode: "1234567890"                                        │
│    }                                                                   │
│  }                                                                     │
│                                                                        │
│  Response:                                                             │
│  {                                                                     │
│    success: true,                                                      │
│    paymentUrl: "https://tomakdigitalagency.ir/vendorsPaymentPage?token=xxx" │
│  }                                                                     │
└────────────────────────────────────────────────────────────────────────┘
     │
     │ 4️⃣  window.location.href = paymentUrl
     ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                  DOMAIN B (Vendor Dashboard)                                 │
│            https://www.tomakdigitalagency.ir/                                │
└─────────────────────────────────────────────────────────────────────────────┘

     │
     │ 5️⃣  Customer lands on payment page
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  GET /vendorsPaymentPage?token=xxx                                     │
│                                                                        │
│  1. Validate JWT token (JWT_SECRET must match!)                       │
│  2. Show payment summary to customer                                  │
│  3. Customer clicks "پرداخت"                                         │
└────────────────────────────────────────────────────────────────────────┘
     │
     │ 6️⃣  Create payment request
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  POST /api/vendors/payment/request                                     │
│                                                                        │
│  1. Create VendorsPayment record in database                          │
│  2. Create Payment record for ZarinPal tracking                       │
│  3. Request ZarinPal gateway URL                                      │
│  4. Redirect to ZarinPal                                              │
└────────────────────────────────────────────────────────────────────────┘
     │
     │ 7️⃣  Redirect to ZarinPal gateway
     ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                          ZarinPal Gateway                                    │
│                      https://payment.zarinpal.com/                           │
└─────────────────────────────────────────────────────────────────────────────┘

     │
     │ 8️⃣  Customer enters card details and pays
     ▼
     │ ✅ Payment successful
     │
     │ 9️⃣  ZarinPal redirects back to Domain B
     ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                  DOMAIN B (Vendor Dashboard)                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  GET /api/payment/callback?Authority=xxx&Status=OK                     │
│                                                                        │
│  1. Verify payment with ZarinPal                                      │
│  2. Update Payment status to 'verified'                               │
│  3. Update VendorsPayment status                                      │
│  4. Redirect to success page                                          │
└────────────────────────────────────────────────────────────────────────┘
     │
     │ 🔟 Redirect to success page
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  GET /vendorsPaymentPage/success                                       │
│                                                                        │
│  ⚡ THIS IS WHERE THE MAGIC HAPPENS ⚡                                │
│                                                                        │
│  1. ✅ CREATE ORDER IN DATABASE                                       │
│     {                                                                  │
│       userId: customer_id,                                            │
│       storeId: "storemibyro6v1nfhv9",                                │
│       products: [...from cart...],                                    │
│       shippingAddress: {                                              │
│         street: "خیابان آزادی...",  ← From your metadata            │
│         city: "تهران",               ← From your metadata            │
│         state: "تهران",              ← From your metadata            │
│         postalCode: "1234567890"     ← From your metadata            │
│       },                                                               │
│       status: "pending",                                              │
│       paymentStatus: "completed",    ← ✅ PAYMENT DONE!              │
│       paymentAuthority: "A00000...",                                  │
│       totalAmount: 200000                                             │
│     }                                                                  │
│                                                                        │
│  2. Generate return token                                             │
│     returnToken = jwt.sign({                                          │
│       verified: true,                                                 │
│       refId: 123456,                                                  │
│       amount: 200000,                                                 │
│       customerName: "علی احمدی",                                      │
│       cart: [...]                                                     │
│     }, JWT_SECRET)                                                    │
│                                                                        │
│  3. Redirect back to Domain A                                         │
│     returnUrl + "?paymentStatus=success&returnToken=xxx"              │
└────────────────────────────────────────────────────────────────────────┘
     │
     │ 1️⃣1️⃣  Customer returns to your store
     ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN A (Your Store)                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  GET /payment/return?paymentStatus=success&returnToken=xxx             │
│                                                                        │
│  Your Frontend:                                                        │
│  1. Extract returnToken from URL                                      │
│  2. (Optional) Verify token with Domain B:                            │
│     POST https://tomakdigitalagency.ir/api/vendors/payment/verify-return │
│     Body: { returnToken: "xxx" }                                      │
│                                                                        │
│  3. Show success message to customer:                                 │
│     "پرداخت موفق! سفارش شما ثبت شد"                                 │
│                                                                        │
│  4. Clear cart from IndexedDB                                         │
│                                                                        │
│  5. (Optional) Update local order status in your database             │
└────────────────────────────────────────────────────────────────────────┘

     ✅ COMPLETE!
     
     Order exists in:
     • Domain B database (paymentStatus: 'completed')
     • Domain A database (paymentStatus: 'pending')
     • Customer receives confirmation
```

---

## 🔑 Key Points

### Data Sources in Your Cart Page
```
┌──────────────────┬─────────────────────────────────┐
│ Data Field       │ Source                          │
├──────────────────┼─────────────────────────────────┤
│ storeId          │ .env → STORE_ID                 │
│ storeUserId      │ localStorage tokenUser (userId) │
│ customerName     │ Database StoreUsers collection  │
│ customerPhone    │ Database StoreUsers collection  │
│ cart items       │ IndexedDB "CartDB"              │
│ totalAmount      │ Calculated from cart            │
│ shippingAddress  │ User form input                 │
│ city             │ User form input                 │
│ state            │ User form input                 │
│ postalCode       │ User form input                 │
└──────────────────┴─────────────────────────────────┘
```

### Critical Environment Variables
```
Both Domain A and Domain B MUST have:
JWT_SECRET=sdsdsdsd  (MUST BE IDENTICAL!)

Domain A (.env):
STORE_ID=storemibyro6v1nfhv9
VENDOR_DASHBOARD_URL=https://www.tomakdigitalagency.ir/

Domain B (.env):
JWT_SECRET=sdsdsdsd  (SAME AS DOMAIN A!)
ZARINPAL_MERCHANT_ID=...
```

### Token Lifetime
```
Payment Token: 15 minutes
└─→ Customer must complete payment within this time
    Otherwise token expires and payment fails
```

---

## 📊 Database Records Created

### Domain A (Your Store)
```javascript
Order {
  _id: ObjectId("..."),
  userId: ObjectId("user_123"),
  storeId: "storemibyro6v1nfhv9",
  products: [...],
  totalAmount: 200000,
  shippingAddress: {...},
  status: "pending",           // ← Initially pending
  paymentStatus: "pending",    // ← Initially pending
  createdAt: Date
}
```

### Domain B (Vendor Dashboard)
```javascript
Order {
  _id: ObjectId("..."),
  userId: ObjectId("user_123"),
  storeId: "storemibyro6v1nfhv9",
  products: [...],
  totalAmount: 200000,
  shippingAddress: {...},      // ← Parsed from your metadata
  status: "pending",
  paymentStatus: "completed",  // ← ✅ Automatically set after payment
  paymentAuthority: "A00000...",
  createdAt: Date
}
```

The order in **Domain B is the source of truth** for payment status!


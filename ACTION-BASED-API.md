# 🎯 Action-Based API Architecture Documentation

## 📋 Overview

The authentication system has been refactored to use an **action-based architecture** where multiple related operations are consolidated into single endpoints. This approach reduces endpoint proliferation and provides a cleaner, more maintainable API structure.

---

## 🏗️ Architecture Changes

### **Before (Old Architecture)**
```
❌ 10+ separate endpoints
/api/auth (POST)
/api/auth/login (POST)
/api/auth/verify (POST)
/api/auth/check-phone (POST)
/api/auth/send-code (POST)
/api/auth/verify-code (POST)
/api/auth/reset-password (POST)
/api/auth/logout (POST)
/api/auth/[id] (GET, PATCH, DELETE)
```

### **After (New Architecture)**
```
✅ 2 unified endpoints
/api/actions/auth (POST) - All auth operations
/api/actions/sms (POST) - All SMS operations
```

---

## 📡 API Endpoints

### **1. Auth Actions Endpoint**
**URL**: `/api/actions/auth`  
**Method**: `POST`  
**Purpose**: Handle all authentication-related operations

#### **Request Format**
```json
{
  "action": "action_name",
  "data": { /* action-specific data */ }
}
```

#### **Available Actions**

##### **1.1 Register**
```typescript
Action: 'register'
Data: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  smsCode: string;
}
Response: {
  success: boolean;
  message: string;
  token: string;
  userId: string;
  user: { name, phone, email };
}
```

##### **1.2 Login**
```typescript
Action: 'login'
Data: {
  phone: string;
  password: string;
  smsCode: string;
}
Response: {
  success: boolean;
  message: string;
  token: string;
  userId: string;
  user: { name, phone };
}
```

##### **1.3 Verify Token**
```typescript
Action: 'verify-token'
Data: {
  token: string;
}
Response: {
  success: boolean;
  valid: boolean;
  user?: { id, name, phone, email };
}
```

##### **1.4 Check Phone**
```typescript
Action: 'check-phone'
Data: {
  phoneNumber: string;
}
Response: {
  success: boolean;
  exists: boolean;
  message: string;
}
```

##### **1.5 Update Profile**
```typescript
Action: 'update-profile'
Data: {
  userId: string;
  name?: string;
  phone?: string;
}
Headers: {
  Authorization: 'Bearer <token>'
}
Response: {
  success: boolean;
  message: string;
  user: { updated user data };
}
```

##### **1.6 Delete Account**
```typescript
Action: 'delete-account'
Data: {}
Headers: {
  Authorization: 'Bearer <token>'
}
Response: {
  success: boolean;
  message: string;
}
```

##### **1.7 Logout**
```typescript
Action: 'logout'
Data: {}
Response: {
  success: boolean;
  message: string;
}
```

##### **1.8 Get Profile**
```typescript
Action: 'get-profile'
Data: {
  userId?: string;
}
Headers: {
  Authorization: 'Bearer <token>'
}
Response: {
  success: boolean;
  user: { user data };
}
```

---

### **2. SMS Actions Endpoint**
**URL**: `/api/actions/sms`  
**Method**: `POST`  
**Purpose**: Handle all SMS-related operations

#### **Request Format**
```json
{
  "action": "action_name",
  "data": { /* action-specific data */ }
}
```

#### **Available Actions**

##### **2.1 Send Code**
```typescript
Action: 'send-code'
Data: {
  phoneNumber: string;
  purpose?: 'register' | 'login' | 'reset-password';
}
Response: {
  success: boolean;
  message: string;
  expiresAt: string; // ISO date
  expiresIn: number; // seconds (300)
}
```

**Features:**
- Validates phone format (09XXXXXXXXX)
- Rate limiting (5-minute cooldown)
- Purpose-based validation:
  - `register`: Ensures user doesn't exist
  - `login`: Ensures user exists
  - `reset-password`: Ensures user exists
- Generates 6-digit code
- Code expires in 5 minutes

##### **2.2 Verify Code**
```typescript
Action: 'verify-code'
Data: {
  phoneNumber: string;
  code: string; // 6 digits
}
Response: {
  success: boolean;
  message: string;
  verified: boolean;
}
```

**Features:**
- Validates code format (6 digits)
- Checks expiry time
- Marks verification as complete

##### **2.3 Resend Code**
```typescript
Action: 'resend-code'
Data: {
  phoneNumber: string;
}
Response: {
  success: boolean;
  message: string;
  expiresAt: string;
  expiresIn: number;
}
```

**Features:**
- Deletes old verification
- Generates new code
- Resets expiry timer

##### **2.4 Reset Password**
```typescript
Action: 'reset-password'
Data: {
  phoneNumber: string;
  code: string;
  newPassword: string;
}
Response: {
  success: boolean;
  message: string;
}
```

**Features:**
- Verifies SMS code
- Updates password (bcrypt hashed)
- Deletes verification record
- Requires verified code

---

## 🛠️ Frontend Integration

### **Using the API Actions Library**

Import the utility functions:
```typescript
import { authActions, smsActions, authFlow } from '@/lib/api-actions';
```

### **Examples**

#### **1. Complete Registration Flow**
```typescript
// Step 1: Send SMS code
const sendResult = await smsActions.sendCode('09123456789', 'register');

// Step 2: Verify SMS code
const verifyResult = await smsActions.verifyCode('09123456789', '123456');

// Step 3: Complete registration
const registerResult = await authFlow.completeRegistration(
  '09123456789',
  '123456',
  'علی محمدی',
  'myPassword123',
  'ali@example.com'
);
// Token automatically stored in localStorage
```

#### **2. Complete Login Flow**
```typescript
// Step 1: Send SMS code
await smsActions.sendCode('09123456789', 'login');

// Step 2: Verify code
await smsActions.verifyCode('09123456789', '123456');

// Step 3: Login
const result = await authFlow.completeLogin(
  '09123456789',
  'myPassword123',
  '123456'
);
// Token automatically stored in localStorage
```

#### **3. Password Reset Flow**
```typescript
// Step 1: Send SMS code
await smsActions.sendCode('09123456789', 'reset-password');

// Step 2: Verify code
await smsActions.verifyCode('09123456789', '123456');

// Step 3: Reset password
await authFlow.completePasswordReset(
  '09123456789',
  '123456',
  'newPassword123'
);
```

#### **4. Check Authentication**
```typescript
const { isAuthenticated, user } = await checkAuth();

if (isAuthenticated) {
  console.log('User:', user);
} else {
  router.push('/login');
}
```

#### **5. Logout**
```typescript
await authFlow.completeLogout();
// Token automatically removed from localStorage
router.push('/login');
```

---

## 📁 File Structure

```
app/
├── api/
│   └── actions/
│       ├── auth/
│       │   └── route.ts        ✅ Unified auth endpoint
│       └── sms/
│           └── route.ts        ✅ Unified SMS endpoint
components/
└── authContainer.tsx           ✅ Updated to use actions
lib/
└── api-actions.ts              ✅ Frontend utility library
models/
├── storesUsers.ts              (unchanged)
└── verification.ts             ✅ Updated with purpose field
middleWare/
└── verifyToken.ts              (unchanged)
```

---

## ✨ Key Improvements

### **1. Reduced Endpoint Count**
- **Before**: 10+ endpoints
- **After**: 2 endpoints
- **Benefit**: Easier to maintain and document

### **2. Consistent Error Handling**
```typescript
try {
  // Action logic
} catch (error) {
  return NextResponse.json({
    success: false,
    message: error.message
  }, { status: 500 });
}
```

### **3. Type Safety**
All actions have TypeScript types defined:
```typescript
type AuthAction = 
  | 'register'
  | 'login'
  | 'verify-token'
  | 'check-phone'
  | 'update-profile'
  | 'delete-account'
  | 'logout'
  | 'get-profile';
```

### **4. Purpose-Based SMS Validation**
```typescript
purpose?: 'register' | 'login' | 'reset-password'
```
- `register`: Prevents existing user registration
- `login`: Ensures user exists
- `reset-password`: Validates user before reset

### **5. Rate Limiting**
- SMS codes expire in 5 minutes (extended from 1 minute)
- Rate limit prevents spam (must wait for expiry)

### **6. Better Security**
- All passwords hashed with bcrypt (10 rounds)
- JWT tokens with 10-hour expiry
- HTTP-only cookies (configurable)
- Token verification on protected routes
- User can only access their own data

---

## 🔒 Security Features

✅ **Password Hashing**: bcrypt with 10 rounds  
✅ **JWT Authentication**: 10-hour expiry  
✅ **SMS Verification**: Required for sensitive operations  
✅ **Code Expiry**: 5 minutes for SMS codes  
✅ **Rate Limiting**: Prevents SMS spam  
✅ **Authorization**: User-specific data access  
✅ **Input Validation**: Phone format, code format  
✅ **Store Isolation**: Users scoped to storeId  
✅ **Token Verification**: Middleware protection  
✅ **Error Messages**: Generic to prevent user enumeration  

---

## 🧪 Testing

### **Test Complete Registration**
```bash
curl -X POST http://localhost:3000/api/actions/sms \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send-code",
    "data": {
      "phoneNumber": "09123456789",
      "purpose": "register"
    }
  }'
```

### **Test Login**
```bash
curl -X POST http://localhost:3000/api/actions/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "data": {
      "phone": "09123456789",
      "password": "myPassword123",
      "smsCode": "123456"
    }
  }'
```

---

## 📊 Migration Guide

### **Old Code**
```typescript
// Send SMS
await fetch('/api/auth/send-code', {
  method: 'POST',
  body: JSON.stringify({ phoneNumber: '09123456789' })
});

// Verify SMS
await fetch('/api/auth/verify-code', {
  method: 'POST',
  body: JSON.stringify({ phoneNumber: '09123456789', code: '123456' })
});

// Login
await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ phone: '09123456789', password: 'pass' })
});
```

### **New Code**
```typescript
import { smsActions, authFlow } from '@/lib/api-actions';

// Send SMS
await smsActions.sendCode('09123456789', 'login');

// Verify SMS
await smsActions.verifyCode('09123456789', '123456');

// Login
await authFlow.completeLogin('09123456789', 'pass', '123456');
```

---

## 🎯 Benefits Summary

1. **Cleaner API Surface**: 2 endpoints vs 10+
2. **Better Organization**: Related operations grouped together
3. **Type Safety**: Full TypeScript support
4. **Error Handling**: Centralized and consistent
5. **Frontend Convenience**: Helper functions for common flows
6. **Maintainability**: Easier to add new actions
7. **Testing**: Simpler test setup
8. **Documentation**: Single source of truth per domain

---

## 🚀 Future Enhancements

1. **Rate Limiting Per User**: Track attempts by userId
2. **Account Lockout**: After N failed attempts
3. **Audit Logging**: Track all auth actions
4. **Refresh Tokens**: Implement token refresh mechanism
5. **2FA Support**: Add two-factor authentication
6. **Social Login**: Google, Apple OAuth
7. **Session Management**: Track active sessions
8. **Password Strength**: Enforce complexity requirements

---

**Last Updated**: 2025-11-06  
**Version**: 2.0.0  
**Status**: ✅ Production Ready

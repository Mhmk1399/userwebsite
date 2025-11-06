# ⚡ Quick Setup Guide - 5 Minutes to Payment

## 🎯 TL;DR - What You Need To Do

### Step 1: Environment Variables (2 minutes)
```bash
# Create .env.local file
cp .env.example .env.local
```

Edit `.env.local`:
```env
JWT_SECRET=your_32_character_secret_key_here_match_vendor_dashboard
VENDOR_DASHBOARD_URL=https://your-vendor-dashboard.com
STORE_ID=your_store_id_from_vendor
NEXT_PUBLIC_API_URL=https://your-website.com
MONGO_URI=your_mongodb_connection_string
```

⚠️ **CRITICAL**: `JWT_SECRET` must match vendor dashboard EXACTLY!

### Step 2: Test Token Generation (1 minute)
```bash
# Update test-payment.js with your JWT_SECRET, STORE_ID, VENDOR_DASHBOARD_URL
node test-payment.js
```

✅ If you see "Token verification successful" → You're good!

### Step 3: Test Payment Flow (2 minutes)
1. Add items to cart
2. Fill shipping address
3. Click "Pay" button
4. You should redirect to vendor dashboard
5. Complete payment
6. You should return to your site with success message

## 📋 Checklist

**Configuration:**
- [ ] Created `.env.local`
- [ ] Set `JWT_SECRET` (matches vendor dashboard)
- [ ] Set `VENDOR_DASHBOARD_URL`
- [ ] Set `STORE_ID`
- [ ] Set `NEXT_PUBLIC_API_URL`

**Testing:**
- [ ] Ran `node test-payment.js` successfully
- [ ] Tested cart → checkout flow
- [ ] Verified redirect to vendor dashboard
- [ ] Completed test payment
- [ ] Verified return to website
- [ ] Checked order status in database

**Production:**
- [ ] Added env vars to hosting platform
- [ ] Tested in production environment
- [ ] Verified HTTPS is enabled
- [ ] Monitored logs for errors

## 🔧 What Was Installed

Everything is already set up! Just configure your environment variables.

**Dependencies already in package.json:**
- ✅ `jsonwebtoken` 
- ✅ `@types/jsonwebtoken`

## 🎯 Key Files to Know

| File | What It Does |
|------|--------------|
| `.env.local` | Your secret configuration (CREATE THIS!) |
| `lib/payment.ts` | Token generation utilities |
| `app/api/payment/checkout/route.ts` | Initiates payment |
| `app/api/payment/verify-return/route.ts` | Verifies payment |
| `app/payment/return/page.tsx` | Shows payment result |
| `app/cart/page.tsx` | Updated to use new flow |

## 🚨 Common Mistakes

### ❌ Mistake 1: JWT_SECRET Mismatch
**Problem:** Token verification fails  
**Solution:** Copy EXACT same JWT_SECRET from vendor dashboard

### ❌ Mistake 2: Wrong URLs
**Problem:** Redirect doesn't work  
**Solution:** Use full URLs with `https://` (no trailing slash)

### ❌ Mistake 3: Missing Environment Variables
**Problem:** "Configuration not found" error  
**Solution:** Check all required vars in `.env.local`

## 🎉 What You Get

✅ Secure cross-domain payment  
✅ Beautiful payment UI  
✅ Automatic cart clearing  
✅ Order tracking  
✅ Error handling  
✅ Mobile responsive  

## 📞 Need Help?

Check the detailed guide: `PAYMENT-IMPLEMENTATION.md`

## 🚀 Deploy Commands

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## ⏱️ Time Estimate

- Configuration: 2 minutes
- Testing: 3 minutes
- **Total: 5 minutes** ⚡

---

**Ready?** Start with Step 1 above! 🎯

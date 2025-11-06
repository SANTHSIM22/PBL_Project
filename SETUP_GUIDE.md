# Quick Setup Guide - Razorpay Integration

## ✅ What's Been Implemented

### Backend (Server)
- ✅ Cart system (add, update, remove items)
- ✅ Order creation with Razorpay
- ✅ Payment verification
- ✅ Order management for customers, artisans, and admins
- ✅ Models: Cart, Order
- ✅ Routes: /api/cart, /api/orders

### Frontend (Client)
- ✅ Cart component with quantity management
- ✅ Checkout component with Razorpay integration
- ✅ Orders component for all user roles
- ✅ "Add to Cart" button on products
- ✅ Dashboard integration for all user types

## 🚀 Next Steps to Test

### 1. Configure Razorpay Keys

Create `server/.env` file (if not exists):
```env
MONGO_URI=mongodb://127.0.0.1:27017/pbl_project
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
PORT=5000
```

### 2. Update Frontend Key

Edit `client/src/components/Checkout.jsx` line 67:
```javascript
key: 'rzp_test_YOUR_KEY_ID', // Your Razorpay Key ID
```

### 3. Restart Server

The server should now start without errors after razorpay installation.

## 🧪 Testing the Flow

### Customer Journey:
1. Login as customer (buyer)
2. Go to "Browse Products" tab
3. Click "Add to Cart" on any product
4. Go to "Cart" tab - see your items
5. Click "Proceed to Checkout"
6. Click "Pay Now" - Razorpay modal opens
7. Use test card: 4111 1111 1111 1111
8. Complete payment
9. Check "My Orders" tab - order appears!

### Artisan Journey:
1. Login as artisan (seller)
2. Go to "Orders" tab
3. See orders containing your products
4. Update order status (Processing, Shipped, Delivered)

### Admin Journey:
1. Login as superadmin
2. Click "Orders" in left menu
3. See ALL orders from all customers
4. Manage any order status

## 📦 Features

### Cart Features:
- Persistent cart (saved in database)
- Quantity adjustment (+/-)
- Remove items
- Real-time total calculation
- Shows product details and artisan info

### Payment Features:
- Secure Razorpay integration
- Test mode for development
- Payment signature verification
- Automatic cart clearing after successful payment

### Order Features:
- Order history for customers
- Order notifications for artisans (orders with their products)
- Full order management for admins
- Status tracking: placed → processing → shipped → delivered
- Customer details visible to artisans/admin

## 🔑 Test Razorpay Cards

For testing in Test Mode:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits (e.g., 123)
- **Expiry**: Any future date (e.g., 12/25)
- **Name**: Any name

## 📝 Notes

- Cart items persist even after logout/login
- Orders are only created on successful payment
- Each order contains product snapshots (price at time of purchase)
- Artisans only see orders for their own products
- Customers see only their orders
- Admins see everything

## 🐛 If Server Won't Start

1. Check if razorpay is installed: `npm list razorpay`
2. Reinstall if needed: `npm install razorpay`
3. Verify `.env` file exists in server directory
4. Check MongoDB is running
5. Look for syntax errors in routes

Server is ready when you see:
```
Connected to MongoDB
Server running on port 5000
```

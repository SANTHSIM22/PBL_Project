# Razorpay Integration Setup Guide

## Overview
This integration adds shopping cart and payment functionality using Razorpay for customers to purchase artisan products.

## Features Added
1. **Shopping Cart** - Add products to cart, update quantities, remove items
2. **Razorpay Payment Gateway** - Secure payment processing
3. **Order Management** - Track orders for customers, artisans, and admin
4. **Order Status Updates** - Artisans and admin can update order status

## Setup Instructions

### 1. Server Setup

#### Install Dependencies
The Razorpay package has been installed. If you need to reinstall:
```bash
cd server
npm install
```

#### Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get Razorpay API Keys:
   - Sign up at https://razorpay.com/
   - Go to Dashboard → Settings → API Keys
   - Generate Test Mode keys (for development)
   - Copy Key ID and Key Secret

3. Update `.env` file with your keys:
   ```
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
   ```

### 2. Client Setup

#### Update Razorpay Key in Checkout Component
Open `client/src/components/Checkout.jsx` and update line 78:
```javascript
key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay Test Key ID
```

### 3. Database Models Added

#### Cart Model
- Stores user's cart items with product references and quantities

#### Order Model
- Stores completed orders with:
  - Customer details
  - Product items with quantities
  - Payment status (pending/completed/failed)
  - Order status (placed/processing/shipped/delivered/cancelled)
  - Razorpay payment details

### 4. API Endpoints

#### Cart Routes (`/api/cart`)
- `GET /` - Get user's cart
- `POST /add` - Add item to cart
- `PUT /update/:productId` - Update item quantity
- `DELETE /remove/:productId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

#### Order Routes (`/api/orders`)
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment signature
- `GET /my-orders` - Get customer's orders
- `GET /all-orders` - Get all orders (admin/artisan)
- `PUT /update-status/:orderId` - Update order status (admin/artisan)

### 5. Frontend Components Added

#### Cart Component (`Cart.jsx`)
- Display cart items
- Update quantities
- Remove items
- Show total amount
- Proceed to checkout

#### Checkout Component (`Checkout.jsx`)
- Display order summary
- Integrate Razorpay payment modal
- Handle payment success/failure
- Clear cart after successful payment

#### Orders Component (`Orders.jsx`)
- Customer view: Display purchase history
- Admin/Artisan view: Display all orders
- Update order status (admin/artisan only)

### 6. User Flows

#### Customer Flow
1. Browse products in dashboard
2. Click "Add to Cart" on products
3. View cart from "Cart" tab
4. Update quantities or remove items
5. Click "Proceed to Checkout"
6. Review order and click "Pay Now"
7. Complete payment via Razorpay modal
8. View order in "My Orders" tab

#### Artisan Flow
1. View orders in "Orders" tab
2. See orders containing their products
3. Update order status (processing/shipped/delivered)

#### Admin Flow
1. View all orders in "Orders" menu
2. See complete order details
3. Update any order status
4. Monitor payments and fulfillment

### 7. Testing Payment Integration

#### Test Mode
1. Use Razorpay Test Keys (start with `rzp_test_`)
2. Test cards: https://razorpay.com/docs/payments/payments/test-card-details/
   - Success: 4111 1111 1111 1111
   - Failure: 4111 1111 1111 1112
   - CVV: Any 3 digits
   - Expiry: Any future date

#### Production Mode
1. Complete KYC on Razorpay
2. Get Live Keys (start with `rzp_live_`)
3. Update keys in `.env` and `Checkout.jsx`
4. Test thoroughly before going live

### 8. Security Notes

- Never commit `.env` file to version control
- Keep Razorpay secret key confidential
- Payment verification happens server-side
- Razorpay signature prevents payment tampering

### 9. Running the Application

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

### 10. Troubleshooting

**Payment fails with signature mismatch:**
- Ensure `RAZORPAY_KEY_SECRET` in `.env` matches your dashboard
- Check you're using the same key in frontend and backend

**Cart not persisting:**
- Verify user is authenticated (token in localStorage)
- Check MongoDB connection

**Orders not showing:**
- Verify payment completed successfully
- Check order status in MongoDB
- Ensure user role is correct

## Next Steps (Optional Enhancements)

1. Email notifications for order confirmations
2. SMS updates for order status
3. Refund handling
4. Multiple payment methods (UPI, Wallets)
5. Order cancellation by customer
6. Inventory management
7. Analytics dashboard
8. Export orders to CSV/PDF

## Support

For Razorpay integration issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For application issues:
- Check server logs
- Check browser console
- Verify MongoDB connection

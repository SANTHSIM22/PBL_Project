import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authMiddleware } from './products.js';
import { notifyArtisanPurchase, notifyCustomerOrderConfirmation } from '../services/smsService.js';

const router = express.Router();

// Check if we're in mock mode (for testing without real Razorpay keys)
const MOCK_MODE = !process.env.RAZORPAY_KEY_ID || 
                  process.env.RAZORPAY_KEY_ID === 'rzp_test_YourKeyIdHere' || 
                  process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id';

console.log('🔐 Payment Mode:', MOCK_MODE ? 'MOCK (Testing - No Razorpay needed)' : 'LIVE (Razorpay enabled)');

// Create Razorpay order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    console.log('Create order request:', { cartItems, userId: req.user.id });
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of cartItems) {
      const product = await Product.findById(item.productId).populate('artisanId');
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        artisanId: product.artisanId._id
      });
    }
    
    console.log('Total amount:', totalAmount, 'Items:', orderItems);
    
    // Create Razorpay order
    let razorpayOrder;
    
    if (MOCK_MODE) {
      // Mock Razorpay order for testing
      console.log('Creating MOCK Razorpay order (no real API call)');
      razorpayOrder = {
        id: `mock_order_${Date.now()}`,
        amount: totalAmount * 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      };
    } else {
      // Real Razorpay order
      try {
        // Dynamically import Razorpay only when needed
        const Razorpay = (await import('razorpay')).default;
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        
        razorpayOrder = await razorpay.orders.create({
          amount: totalAmount * 100, // Amount in paise
          currency: 'INR',
          receipt: `order_${Date.now()}`
        });
        console.log('Razorpay order created:', razorpayOrder.id);
      } catch (razorpayError) {
        console.error('Razorpay error:', razorpayError);
        return res.status(500).json({ 
          message: 'Failed to create Razorpay order. Please check your Razorpay credentials.',
          error: razorpayError.message 
        });
      }
    }
      
    // Create order in database
    const order = new Order({
      orderId: razorpayOrder.receipt,
      customerId: req.user.id,
      items: orderItems,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    });
    
    await order.save();
    
    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Verify payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    console.log('Verify payment request:', { razorpay_order_id, razorpay_payment_id });
    
    // Verify signature (skip in mock mode)
    if (!MOCK_MODE) {
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');
      
      if (razorpay_signature !== expectedSign) {
        console.error('Invalid signature:', { received: razorpay_signature, expected: expectedSign });
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    } else {
      console.log('MOCK MODE: Skipping signature verification');
    }
    
    // Update order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
      .populate('customerId', 'username email phone')
      .populate('items.productId')
      .populate('items.artisanId', 'username email phone');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.razorpayPaymentId = razorpay_payment_id || 'mock_payment_id';
    order.razorpaySignature = razorpay_signature || 'mock_signature';
    order.paymentStatus = 'completed';
    order.updatedAt = Date.now();
    await order.save();
    
    // Clear user's cart
    await Cart.findOneAndDelete({ userId: req.user.id });
    
    console.log('Payment verified successfully for order:', order._id);
    
    // Send SMS notifications to artisans
    try {
      const artisanNotifications = new Set(); // Track unique artisans
      
      for (const item of order.items) {
        const artisan = item.artisanId;
        const artisanKey = artisan._id.toString();
        
        // Send SMS only once per artisan (even if they have multiple products in order)
        if (!artisanNotifications.has(artisanKey) && artisan.phone) {
          const customerName = order.customerId.username;
          const productName = item.name;
          const quantity = item.quantity;
          const itemTotal = item.price * item.quantity;
          
          // Send SMS notification
          const smsResult = await notifyArtisanPurchase(
            artisan.phone,
            customerName,
            productName,
            quantity,
            itemTotal
          );
          
          console.log(`SMS notification to ${artisan.username}:`, smsResult.message);
          artisanNotifications.add(artisanKey);
        }
      }
      
      // Send confirmation SMS to customer
      if (order.customerId.phone) {
        const customerSmsResult = await notifyCustomerOrderConfirmation(
          order.customerId.phone,
          order.orderId,
          order.totalAmount
        );
        console.log(`SMS confirmation to customer:`, customerSmsResult.message);
      }
    } catch (smsError) {
      // Don't fail the order if SMS fails
      console.error('SMS notification error:', smsError);
    }
    
    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// Get all orders (for customer)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('items.productId')
      .populate('items.artisanId', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get all orders (for admin/artisan)
router.get('/all-orders', authMiddleware, async (req, res) => {
  try {
    let query = {};
    
    // If artisan, only show orders containing their products
    if (req.user.role === 'seller') {
      query = { 'items.artisanId': req.user.id };
    }
    // Superadmin sees all orders
    
    const orders = await Order.find(query)
      .populate('customerId', 'username email phone')
      .populate('items.productId')
      .populate('items.artisanId', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order status (admin/artisan)
router.put('/update-status/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permissions
    if (req.user.role !== 'superadmin' && req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If artisan, verify they own at least one product in the order
    if (req.user.role === 'seller') {
      const hasProduct = order.items.some(
        item => item.artisanId.toString() === req.user.id
      );
      if (!hasProduct) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;

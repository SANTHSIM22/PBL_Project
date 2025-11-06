import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import React from 'react';
const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      // Create order
      const orderRes = await fetch(`${API_BASE_URL}/api/orders/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems: cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
          }))
        })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        console.error('Order creation failed:', orderData);
        alert(orderData.message || orderData.error || 'Failed to create order');
        setProcessing(false);
        return;
      }
      
      console.log('Order created successfully:', orderData);
      
      // Check if we're in mock mode (mock order IDs start with "mock_")
      const isMockMode = orderData.orderId.startsWith('mock_');
      
      if (isMockMode) {
        // Mock mode - skip Razorpay and directly verify "payment"
        console.log('MOCK MODE: Simulating payment success');
        
        const verifyRes = await fetch(`${API_BASE_URL}/api/orders/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: 'mock_payment_' + Date.now(),
            razorpay_signature: 'mock_signature'
          })
        });
        
        const verifyData = await verifyRes.json();
        
        if (verifyRes.ok) {
          alert('✅ MOCK PAYMENT: Order placed successfully! (No real payment was processed)');
          // Get user info to redirect to correct dashboard
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          // For customer, redirect to /dashboard/customer or their slug
          const dashboardUrl = user.slug ? `/dashboard/${user.slug}` : '/dashboard/customer';
          window.location.href = dashboardUrl;
        } else {
          alert('Payment verification failed: ' + verifyData.message);
        }
        
        setProcessing(false);
        return;
      }
      
      // Real Razorpay mode
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Artisan Marketplace',
        description: 'Purchase from artisans',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch(`${API_BASE_URL}/api/orders/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyRes.ok) {
            alert('Payment successful! Your order has been placed.');
            // Get user info to redirect to correct dashboard
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            // For customer, redirect to /dashboard/customer or their slug
            const dashboardUrl = user.slug ? `/dashboard/${user.slug}` : '/dashboard/customer';
            window.location.href = dashboardUrl;
          } else {
            alert('Payment verification failed: ' + verifyData.message);
          }
          
          setProcessing(false);
        },
        prefill: {
          name: localStorage.getItem('username') || '',
          email: localStorage.getItem('email') || ''
        },
        theme: {
          color: '#a0522d'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-4">Add some products to your cart first!</p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-[#a0522d] text-white px-6 py-2 rounded hover:bg-[#8b4513]"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex gap-4 border-b pb-4">
                  {item.productId?.imageUrl && (
                    <img 
                      src={item.productId.imageUrl} 
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productId?.name}</h3>
                    <p className="text-sm text-gray-600">by {item.productId?.artisanId?.username}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{(item.productId?.price || 0) * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Payment Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Included</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#a0522d]">₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                processing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#a0522d] hover:bg-[#8b4513]'
              }`}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

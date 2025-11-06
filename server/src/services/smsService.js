// SMS Service for sending notifications
// Using Fast2SMS (Indian SMS Service - Easy & Affordable)

// Check if we're in mock mode (for testing without real Fast2SMS API key)
const SMS_MOCK_MODE = !process.env.FAST2SMS_API_KEY || 
                      process.env.FAST2SMS_API_KEY === 'your_fast2sms_api_key';

console.log('📱 SMS Mode:', SMS_MOCK_MODE ? 'MOCK (Testing - No SMS sent)' : 'LIVE (Fast2SMS enabled)');

/**
 * Send SMS using Fast2SMS API
 */
async function sendSMS(phoneNumber, message) {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'No phone number provided' };
    }

    // Remove country code if present (Fast2SMS uses only 10-digit numbers)
    const cleanNumber = phoneNumber.replace(/^\+91/, '').replace(/\s/g, '');
    
    if (SMS_MOCK_MODE) {
      // Mock mode - just log the SMS
      console.log('📱 MOCK SMS to:', cleanNumber);
      console.log('📝 Message:', message);
      return { 
        success: true, 
        message: 'SMS sent (MOCK mode)', 
        mock: true 
      };
    }

    // Real SMS sending via Fast2SMS
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: cleanNumber
      })
    });

    const data = await response.json();
    
    if (data.return === true) {
      console.log('✅ SMS sent successfully to:', cleanNumber);
      return { 
        success: true, 
        message: 'SMS sent successfully',
        messageId: data.request_id 
      };
    } else {
      console.error('❌ Fast2SMS error:', data);
      return { 
        success: false, 
        message: data.message || 'Failed to send SMS' 
      };
    }
  } catch (error) {
    console.error('❌ SMS sending error:', error.message);
    return { 
      success: false, 
      message: error.message 
    };
  }
}

/**
 * Send SMS notification to artisan when their product is purchased
 */
export async function notifyArtisanPurchase(artisanPhone, customerName, productName, quantity, orderTotal) {
  const message = `New Order! Customer: ${customerName}, Product: ${productName}, Qty: ${quantity}, Total: Rs.${orderTotal}. Check dashboard - Artisan Connect`;
  return await sendSMS(artisanPhone, message);
}

/**
 * Send order confirmation SMS to customer
 */
export async function notifyCustomerOrderConfirmation(customerPhone, orderNumber, totalAmount) {
  const message = `Order Confirmed! Order #${orderNumber}, Total: Rs.${totalAmount}. Track in your dashboard - Artisan Connect`;
  return await sendSMS(customerPhone, message);
}

/**
 * Send test SMS (for debugging)
 */
export async function sendTestSMS(phoneNumber, message) {
  return await sendSMS(phoneNumber, message);
}

export default {
  notifyArtisanPurchase,
  notifyCustomerOrderConfirmation,
  sendTestSMS
};

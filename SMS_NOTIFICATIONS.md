# SMS Notification System

## Overview
SMS notifications are sent to artisans when their products are purchased, and to customers when orders are confirmed.

## Features
✅ **Artisan Notifications** - Get SMS when product is sold  
✅ **Customer Confirmations** - Order confirmation SMS  
✅ **MOCK Mode** - Test without real SMS service  
✅ **Multiple Products** - One SMS per artisan per order  

## How It Works

### When Payment is Completed:
1. **Artisan Gets SMS**: "🎉 New Order! Customer: [name], Product: [product], Qty: [x], Total: ₹[amount]"
2. **Customer Gets SMS**: "✅ Order Confirmed! Order #[id], Total: ₹[amount]"

### MOCK Mode (Default - No SMS Service Needed)
- SMS messages are logged to console
- No actual SMS sent
- Perfect for testing
- No cost or signup required

### Server Output Example:
```
📱 SMS Mode: MOCK (Testing - No SMS sent)
📱 MOCK SMS to: +919876543210
Message: 🎉 New Order Alert!
Customer: John
Product: Handwoven Basket
Quantity: 2
Total: ₹600
```

## Setup for Real SMS (Optional)

### 1. Sign Up for Twilio
- Go to https://www.twilio.com/
- Sign up for free trial (₹1,300 credit)
- Verify your phone number

### 2. Get Credentials
- Go to Twilio Console: https://console.twilio.com/
- Copy **Account SID**
- Copy **Auth Token**
- Get a **Twilio Phone Number** (from Console)

### 3. Update .env File
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

### 4. Phone Number Format
- **India**: +919876543210
- **US**: +15551234567
- Must include country code with +

### 5. Verify Recipients (Trial Account)
- Trial accounts can only send to verified numbers
- Verify numbers in Twilio Console
- Upgrade to send to any number

## Testing

### MOCK Mode Test:
1. Complete a purchase as customer
2. Check server console for SMS logs
3. See messages that would be sent

### Real SMS Test:
1. Add your phone number to artisan account
2. Make test purchase
3. Receive actual SMS!

## SMS Content

### Artisan SMS:
```
🎉 New Order Alert!

Customer: [Customer Name]
Product: [Product Name]
Quantity: [X]
Total: ₹[Amount]

Check your dashboard for details.
- Artisan Connect
```

### Customer SMS:
```
✅ Order Confirmed!

Order #[order_12345]
Total: ₹[Amount]

Your order has been placed successfully. Track it in your dashboard.
- Artisan Connect
```

## Requirements

### Phone Numbers Must:
- Be stored in user's `phone` field
- Include country code (e.g., +91 for India)
- Be valid mobile numbers

### Artisan Notification Requires:
- Artisan must have `phone` in database
- Product must have valid `artisanId`

### Customer Notification Requires:
- Customer must have `phone` in database

## Troubleshooting

### SMS Not Sending (Real Mode):
1. Check Twilio credentials in `.env`
2. Verify phone numbers include country code
3. Check Twilio account balance
4. Verify recipient numbers (trial accounts)

### SMS Not Logged (MOCK Mode):
1. Check server console output
2. Verify artisan/customer has phone number
3. Look for "📱 MOCK SMS" in logs

### Error: "Unverified Number":
- Trial accounts: Verify recipient in Twilio Console
- OR upgrade to paid account

## Cost (Real Mode)

### Twilio Pricing:
- **India SMS**: ~₹0.50 per message
- **US SMS**: ~₹6 per message
- **Free Trial**: ₹1,300 credit
- Can send ~2,600 messages with trial credit!

## Privacy & Security

✅ Phone numbers are private  
✅ SMS sent only on actual purchase  
✅ One SMS per artisan per order  
✅ Customer gets confirmation only  

## Future Enhancements

- 📧 Email notifications
- 🔔 WhatsApp notifications
- 📱 Order status update SMS
- 🚚 Shipping notification SMS
- ⭐ Review request SMS

## Support

**Twilio Issues**: https://www.twilio.com/help  
**Phone Format**: Include country code (+91 for India)  
**Testing**: Use MOCK mode first!

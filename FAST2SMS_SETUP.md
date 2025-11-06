# Fast2SMS Setup Guide (Super Easy! 🚀)

## Why Fast2SMS?
✅ **Indian Service** - Made for India  
✅ **FREE 10 SMS Daily** - Perfect for testing  
✅ **Easy Setup** - Just 2 minutes!  
✅ **No Credit Card** - Sign up with mobile  
✅ **Works Immediately** - No verification delays  

## 🎯 Quick Setup (3 Steps)

### Step 1: Sign Up (1 minute)
1. Go to: **https://www.fast2sms.com/**
2. Click **"Sign Up Free"**
3. Enter your mobile number
4. Verify OTP
5. Done! ✅

### Step 2: Get API Key (30 seconds)
1. After login, go to: **https://www.fast2sms.com/dashboard/dev-api**
2. You'll see your **API Key** (long string)
3. Copy it!

### Step 3: Update .env File (30 seconds)
```env
FAST2SMS_API_KEY=paste_your_api_key_here
```

**That's it!** Restart your server and SMS will work! 🎉

## 📱 Phone Number Format

Fast2SMS uses **10-digit Indian numbers** (without +91):
- ✅ **Correct**: `9876543210`
- ✅ **Also works**: `+919876543210` (we auto-remove +91)
- ❌ **Wrong**: `919876543210`

## 🆓 Free Plan Details

- **10 SMS per day** - FREE forever
- **No expiry** - Use anytime
- **Indian numbers only** - Perfect for your use case
- **Instant delivery** - Usually within seconds

## 💰 Paid Plans (Optional)

If you need more SMS:
- **₹99** = 200 SMS
- **₹499** = 1,000 SMS
- **₹999** = 2,500 SMS

Much cheaper than Twilio!

## 🧪 Testing Right Now (MOCK Mode)

Your current setup will work in **MOCK mode**:
```env
FAST2SMS_API_KEY=your_fast2sms_api_key
```

Server will show:
```
📱 SMS Mode: MOCK (Testing - No SMS sent)
📱 MOCK SMS to: 9876543210
📝 Message: New Order! Customer: John...
```

Perfect for development!

## 🔥 Go LIVE in 2 Minutes!

1. Sign up: https://www.fast2sms.com/
2. Get API key: https://www.fast2sms.com/dashboard/dev-api
3. Update .env:
   ```env
   FAST2SMS_API_KEY=your_actual_api_key
   ```
4. Restart server
5. Done! Real SMS will be sent! 📱

## 📝 SMS Messages

### Artisan Notification:
```
New Order! Customer: John, Product: Basket, Qty: 2, Total: Rs.600. Check dashboard - Artisan Connect
```

### Customer Confirmation:
```
Order Confirmed! Order #12345, Total: Rs.600. Track in your dashboard - Artisan Connect
```

Messages are under 160 characters = 1 SMS credit each!

## ⚡ Advantages over Twilio

| Feature | Fast2SMS | Twilio |
|---------|----------|--------|
| Setup Time | 2 minutes | 10+ minutes |
| Free SMS | 10/day forever | Trial credits only |
| Indian Numbers | ✅ Native | ❌ Expensive |
| Verification | Instant | Slow |
| Pricing (India) | ₹0.50/SMS | ₹4-6/SMS |
| Credit Card | Not needed | Required |

## 🎯 Current Status

- ✅ Code updated to Fast2SMS
- ✅ MOCK mode active (works without signup)
- ✅ Ready for real SMS in 2 minutes!

## 🐛 Troubleshooting

### "Invalid API Key"
- Check you copied the full key
- No spaces before/after
- Get new key from dashboard

### "Insufficient Balance"
- Free plan: 10 SMS limit reached today
- Solution: Wait till midnight or recharge

### SMS Not Delivered
- Check number format (10 digits)
- Verify DND is not active
- Check Fast2SMS dashboard logs

## 📞 Support

- **Fast2SMS Support**: support@fast2sms.com
- **Dashboard**: https://www.fast2sms.com/dashboard
- **API Docs**: https://docs.fast2sms.com/

---

**Ready to send real SMS?** Just sign up and paste your API key! 🚀

// Test SMS functionality
import dotenv from 'dotenv';
dotenv.config();

import { sendTestSMS } from './services/smsService.js';

// Get phone number from command line argument
const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.log('❌ Usage: node src/testSMS.js <phone_number>');
  console.log('📱 Example: node src/testSMS.js 9876543210');
  process.exit(1);
}

console.log('🧪 Testing Fast2SMS integration...\n');
console.log('📱 Phone Number:', phoneNumber);
console.log('🔑 API Key:', process.env.FAST2SMS_API_KEY ? `${process.env.FAST2SMS_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('');

// Test SMS
const testMessage = 'Hello from your PBL Project! This is a test SMS. 🚀';

sendTestSMS(phoneNumber, testMessage)
  .then(result => {
    console.log('\n✅ Test complete!');
    console.log('📊 Result:', result);
    
    if (result.mock) {
      console.log('\n⚠️  MOCK MODE: SMS not actually sent');
      console.log('💡 To send real SMS:');
      console.log('   1. Get your API key from https://www.fast2sms.com/dashboard/dev-api');
      console.log('   2. Update FAST2SMS_API_KEY in .env file');
      console.log('   3. Restart the server');
    } else if (result.success) {
      console.log('\n🎉 Real SMS sent successfully!');
      console.log('📬 Message ID:', result.messageId);
    } else {
      console.log('\n❌ SMS failed:', result.message);
      console.log('\n🔍 Troubleshooting:');
      console.log('   1. Check if your Fast2SMS API key is valid');
      console.log('   2. Verify you have SMS credits at https://www.fast2sms.com/dashboard');
      console.log('   3. Make sure phone number is 10 digits (Indian number)');
      console.log('   4. Check Fast2SMS dashboard for error logs');
    }
  })
  .catch(error => {
    console.error('\n💥 Error:', error.message);
  });

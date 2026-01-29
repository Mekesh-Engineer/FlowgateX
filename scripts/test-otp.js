/**
 * OTP System Test Script
 * Run this to test the OTP flow end-to-end
 * 
 * Usage: node scripts/test-otp.js
 */

const testOTPFlow = async () => {
  const API_BASE = 'http://localhost:3000/api/auth';
  const TEST_MOBILE = '+919876543210';
  
  console.log('🧪 Starting OTP System Test\n');

  try {
    // Step 1: Send OTP
    console.log('📱 Step 1: Sending OTP...');
    const sendResponse = await fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: TEST_MOBILE,
        type: 'registration'
      })
    });

    const sendData = await sendResponse.json();
    console.log('✅ OTP Sent:', sendData);
    
    if (!sendData.success) {
      throw new Error('Failed to send OTP');
    }

    const otp = sendData.otp; // Only available in dev mode
    console.log(`\n🔐 OTP Code: ${otp}\n`);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Verify OTP
    console.log('🔍 Step 2: Verifying OTP...');
    const verifyResponse = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: TEST_MOBILE,
        otp: otp
      })
    });

    const verifyData = await verifyResponse.json();
    console.log('✅ OTP Verified:', verifyData);

    if (!verifyData.success) {
      throw new Error('Failed to verify OTP');
    }

    // Step 3: Register User
    console.log('\n👤 Step 3: Registering user...');
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        mobile: TEST_MOBILE,
        email: `test${Date.now()}@example.com`,
        password: 'TestPass123!',
        verificationToken: verifyData.verificationToken,
        role: 'user',
        gender: 'male',
        location: 'Test City',
        dob: '1990-01-01'
      })
    });

    const registerData = await registerResponse.json();
    console.log('✅ User Registered:', registerData);

    if (registerData.success) {
      console.log('\n🎉 All tests passed successfully!');
      console.log('User ID:', registerData.user.uid);
    } else {
      throw new Error(registerData.error || 'Registration failed');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run tests
testOTPFlow();

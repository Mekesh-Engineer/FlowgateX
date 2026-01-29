import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// In production, use a real SMS service like Twilio, AWS SNS, or Firebase SMS
// For now, we'll use Firebase Firestore to store OTP and console log it
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send SMS (placeholder for real SMS service)
async function sendSMS(mobile: string, otp: string): Promise<boolean> {
  try {
    // TODO: Integrate with real SMS provider
    // Example with Twilio:
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   body: `Your FlowGateX verification code is: ${otp}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: mobile
    // });

    // For development: Log OTP to console
    console.log(`📱 OTP for ${mobile}: ${otp}`);
    console.log(`🔐 Copy this code for testing: ${otp}`);
    
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, type = 'registration' } = body;

    // Validate mobile number
    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json(
        { error: 'Valid mobile number is required' },
        { status: 400 }
      );
    }

    // Clean mobile number
    const cleanMobile = mobile.replace(/[\s-]/g, '');
    const mobileRegex = /^\+?[1-9]\d{9,14}$/;
    
    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    // Note: Same mobile number can be used for multiple accounts (different emails)
    // No uniqueness check for mobile numbers

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Firestore
    const otpRef = adminDb.collection('otps').doc(cleanMobile);
    await otpRef.set({
      otp,
      mobile: cleanMobile,
      type,
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    });

    // Send SMS
    const smsSent = await sendSMS(cleanMobile, otp);

    if (!smsSent) {
      return NextResponse.json(
        { error: 'Failed to send SMS. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600, // seconds
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}

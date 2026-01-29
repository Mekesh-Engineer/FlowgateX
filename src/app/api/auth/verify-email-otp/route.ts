import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Clean email
    const cleanEmail = email.toLowerCase().trim();

    // Retrieve OTP from Firestore
    const otpRef = adminDb.collection('email_otps').doc(cleanEmail);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      );
    }

    const otpData = otpDoc.data();

    // Check if already verified
    if (otpData?.verified) {
      return NextResponse.json(
        { error: 'OTP already used. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check expiration
    const expiresAt = new Date(otpData?.expiresAt);
    if (expiresAt < new Date()) {
      await otpRef.delete(); // Clean up expired OTP
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempts
    const attempts = (otpData?.attempts || 0) + 1;
    if (attempts > MAX_ATTEMPTS) {
      await otpRef.delete(); // Clean up after max attempts
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpData?.otp !== otp) {
      // Update attempts
      await otpRef.update({ attempts });
      
      return NextResponse.json(
        {
          error: 'Invalid OTP. Please try again.',
          attemptsRemaining: MAX_ATTEMPTS - attempts,
        },
        { status: 400 }
      );
    }

    // OTP is valid - mark as verified
    await otpRef.update({
      verified: true,
      verifiedAt: new Date().toISOString(),
    });

    // Generate verification token
    const verificationToken = Buffer.from(
      JSON.stringify({
        email: cleanEmail,
        verified: true,
        timestamp: Date.now(),
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verificationToken,
      email: cleanEmail,
    });

  } catch (error) {
    console.error('Verify Email OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}

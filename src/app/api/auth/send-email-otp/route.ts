import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send email OTP (placeholder for real email service)
async function sendEmailOTP(email: string, otp: string, firstName: string): Promise<boolean> {
  try {
    // TODO: Integrate with email service (SendGrid, AWS SES, Resend, etc.)
    // Example with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'FlowGateX <noreply@flowgatex.com>',
    //   to: email,
    //   subject: 'Your FlowGateX Verification Code',
    //   html: `
    //     <h2>Welcome to FlowGateX, ${firstName}!</h2>
    //     <p>Your verification code is: <strong style="font-size: 24px; color: #eb1616;">${otp}</strong></p>
    //     <p>This code will expire in 10 minutes.</p>
    //     <p>If you didn't request this code, please ignore this email.</p>
    //   `
    // });

    // For development: Log OTP to console
    console.log(`📧 EMAIL OTP for ${email}: ${otp}`);
    console.log(`🔐 Copy this code for testing: ${otp}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, type = 'registration' } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Clean and validate email
    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Check if email already exists in Firebase Auth or Firestore
    if (type === 'registration') {
      try {
        // Check Firebase Auth
        const { adminAuth } = await import('@/lib/firebase-admin');
        try {
          await adminAuth.getUserByEmail(cleanEmail);
          return NextResponse.json(
            { error: 'This email is already registered. Please login instead.' },
            { status: 409 }
          );
        } catch (authError: any) {
          // Email not found in Auth - this is good for registration
          if (authError.code !== 'auth/user-not-found') {
            throw authError;
          }
        }

        // Check Firestore users collection
        const usersRef = adminDb.collection('users');
        const existingUser = await usersRef.where('email', '==', cleanEmail).get();
        
        if (!existingUser.empty) {
          return NextResponse.json(
            { error: 'This email is already registered. Please login instead.' },
            { status: 409 }
          );
        }
      } catch (error: any) {
        if (error.status === 409) throw error;
        console.error('Error checking email:', error);
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Firestore (keyed by email)
    const otpRef = adminDb.collection('email_otps').doc(cleanEmail);
    await otpRef.set({
      otp,
      email: cleanEmail,
      type,
      firstName: firstName || 'User',
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    });

    // Send email OTP
    const emailSent = await sendEmailOTP(cleanEmail, otp, firstName || 'User');

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      expiresIn: 600, // seconds
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });

  } catch (error: any) {
    console.error('Send Email OTP error:', error);
    
    if (error.status === 409) {
      return NextResponse.json(
        { error: error.body?.error || 'Email already registered' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}

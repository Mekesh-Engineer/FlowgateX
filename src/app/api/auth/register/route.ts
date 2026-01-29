import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import * as crypto from 'crypto';

// Hash password (in production, use bcrypt or similar)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      mobile,
      email,
      gender,
      dob,
      location,
      role,
      password,
      verificationToken,
      whatsappOptIn,
      marketingOptIn,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !verificationToken) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Clean email
    const cleanEmail = email.toLowerCase().trim();

    // Verify the EMAIL OTP was validated
    try {
      const tokenData = JSON.parse(
        Buffer.from(verificationToken, 'base64').toString('utf-8')
      );

      if (tokenData.email !== cleanEmail) {
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        );
      }

      // Check token age (valid for 5 minutes after OTP verification)
      const tokenAge = Date.now() - tokenData.timestamp;
      if (tokenAge > 5 * 60 * 1000) {
        return NextResponse.json(
          { error: 'Verification token expired. Please verify OTP again.' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if EMAIL OTP document is verified
    const otpRef = adminDb.collection('email_otps').doc(cleanEmail);
    const otpDoc = await otpRef.get();
    
    if (!otpDoc.exists || !otpDoc.data()?.verified) {
      return NextResponse.json(
        { error: 'Email not verified. Please verify OTP first.' },
        { status: 400 }
      );
    }

    // Check if email already exists (final check)
    const usersRef = adminDb.collection('users');
    const existingUserByEmail = await usersRef.where('email', '==', cleanEmail).get();

    if (!existingUserByEmail.empty) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Create Firebase Auth user
    // Note: phoneNumber is NOT set to allow multiple accounts with same mobile
    let firebaseUser;
    try {
      firebaseUser = await adminAuth.createUser({
        email: cleanEmail,
        password,
        displayName: `${firstName} ${lastName}`,
        emailVerified: true, // Mark as verified since we verified via OTP
      });
    } catch (authError: any) {
      console.error('Firebase Auth error:', authError);
      
      if (authError.code === 'auth/email-already-exists') {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message || 'Failed to create authentication account' },
        { status: 500 }
      );
    }

    // Create user document in Firestore
    const userDoc = {
      uid: firebaseUser.uid,
      firstName,
      lastName,
      mobile: mobile || null,
      email: cleanEmail,
      gender: gender || null,
      dob: dob || null,
      location: location || null,
      role: role || 'user',
      whatsappOptIn: whatsappOptIn || false,
      marketingOptIn: marketingOptIn || false,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileComplete: true,
    };

    await usersRef.doc(firebaseUser.uid).set(userDoc);

    // Clean up OTP document
    await otpRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email: cleanEmail,
        mobile: mobile || null,
        role: role || 'user',
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}

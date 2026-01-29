import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

/**
 * Cleanup endpoint to remove expired OTPs
 * Should be called by a cron job periodically
 */
export async function GET(request: NextRequest) {
  try {
    // Verify request is from authorized source (cron job)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    const otpsRef = adminDb.collection('otps');
    
    // Get all OTPs
    const snapshot = await otpsRef.get();
    
    let deletedCount = 0;
    const batch = adminDb.batch();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const expiresAt = new Date(data.expiresAt);

      // Delete if expired (older than current time)
      if (expiresAt < now) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} expired OTP(s).`,
      deletedCount,
      timestamp: now.toISOString(),
    });

  } catch (error) {
    console.error('OTP cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

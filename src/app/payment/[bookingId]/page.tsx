'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getBookingById, updateBookingStatus, BookingData } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Payment method types
type PaymentMethod = 'card' | 'upi' | 'wallet' | 'netbanking';
type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'failed';

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
}

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  // State
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [upiId, setUpiId] = useState('');

  // Saved payment methods
  const [savedCards] = useState<SavedCard[]>([
    { id: '1', last4: '4242', brand: 'Visa', expiryMonth: '12', expiryYear: '25' },
    { id: '2', last4: '5555', brand: 'Mastercard', expiryMonth: '08', expiryYear: '26' },
  ]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Card details for new card
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await getBookingById(bookingId);
        if (bookingData) {
          // Verify user owns this booking
          if (user && bookingData.userId !== user.id) {
            alert('Unauthorized access');
            router.push('/dashboard/user/bookings');
            return;
          }
          // Check if already paid
          if (bookingData.paymentStatus === 'paid') {
            router.push(`/ticket/${bookingId}`);
            return;
          }
          setBooking(bookingData);
        } else {
          alert('Booking not found');
          router.push('/dashboard/user/bookings');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        alert('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBooking();
    }
  }, [bookingId, user, router]);

  const handlePayment = async () => {
    if (!booking) return;

    setPaymentStatus('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For card payments, show 3D secure OTP
    if (selectedMethod === 'card') {
      setPaymentStatus('verifying');
      setShowOTP(true);
      return;
    }

    // Complete payment
    await completePayment();
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      alert('Please enter valid 6-digit OTP');
      return;
    }

    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await completePayment();
  };

  const completePayment = async () => {
    try {
      setPaymentStatus('processing');
      
      // Update booking status in Firebase
      await updateBookingStatus(bookingId, 'confirmed', 'paid');
      
      setPaymentStatus('success');
      
      // Redirect to ticket after 3 seconds
      setTimeout(() => {
        router.push(`/ticket/${bookingId}`);
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  // Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="text-green-600" style={{ fontSize: 48 }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Booking ID</p>
            <p className="text-2xl font-bold text-gray-900">{bookingId.substring(0, 8).toUpperCase()}</p>
          </div>

          <div className="w-48 h-48 bg-white border-4 border-gray-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
            <QrCode2Icon style={{ fontSize: 120 }} className="text-gray-400" />
          </div>

          <Button onClick={() => router.push(`/ticket/${bookingId}`)} className="w-full mb-3">
            <span className="material-icons-outlined mr-2">confirmation_number</span>
            View My Ticket
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/user/bookings')} className="w-full">
            Go to My Bookings
          </Button>
        </div>
      </div>
    );
  }

  // Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ErrorIcon className="text-red-600" style={{ fontSize: 48 }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">Something went wrong with your payment</p>
          <Button onClick={() => setPaymentStatus('idle')} className="w-full mb-3">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/user/bookings')} className="w-full">
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowBackIcon className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-1">Secure checkout powered by industry-leading payment processors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Badges */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LockIcon fontSize="small" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <SecurityIcon fontSize="small" />
                  <span>PCI-DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <VerifiedUserIcon fontSize="small" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    selectedMethod === 'card' ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <CreditCardIcon className={selectedMethod === 'card' ? "text-blue-600" : "text-gray-400"} />
                  <p className="text-sm font-medium mt-2">Card</p>
                </button>
                <button
                  onClick={() => setSelectedMethod('upi')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    selectedMethod === 'upi' ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <QrCode2Icon className={selectedMethod === 'upi' ? "text-blue-600" : "text-gray-400"} />
                  <p className="text-sm font-medium mt-2">UPI</p>
                </button>
                <button
                  onClick={() => setSelectedMethod('wallet')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    selectedMethod === 'wallet' ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <AccountBalanceWalletIcon className={selectedMethod === 'wallet' ? "text-blue-600" : "text-gray-400"} />
                  <p className="text-sm font-medium mt-2">Wallet</p>
                </button>
                <button
                  onClick={() => setSelectedMethod('netbanking')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    selectedMethod === 'netbanking' ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="material-icons-outlined text-gray-400">account_balance</span>
                  <p className="text-sm font-medium mt-2">Net Banking</p>
                </button>
              </div>

              {/* Card Payment */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  {/* Saved Cards */}
                  {savedCards.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Cards</h3>
                      <div className="space-y-2">
                        {savedCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => setSelectedCard(card.id)}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 text-left transition-all",
                              selectedCard === card.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CreditCardIcon className="text-gray-600" />
                                <div>
                                  <p className="font-medium text-gray-900">{card.brand} •••• {card.last4}</p>
                                  <p className="text-sm text-gray-500">Expires {card.expiryMonth}/{card.expiryYear}</p>
                                </div>
                              </div>
                              {selectedCard === card.id && (
                                <CheckCircleIcon className="text-blue-600" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Or add a new card</p>
                    </div>
                  )}

                  {/* New Card Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            setCardExpiry(value);
                          }}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <Input
                          type="password"
                          placeholder="123"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Save this card for future payments</span>
                    </label>
                  </div>
                </div>
              )}

              {/* UPI Payment */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter UPI ID</label>
                    <Input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-600 mb-4">Or scan QR code to pay</p>
                    <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode2Icon style={{ fontSize: 120 }} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Payment */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-3">
                  {['PayTM', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((wallet) => (
                    <button
                      key={wallet}
                      className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{wallet}</span>
                        <span className="material-icons-outlined text-gray-400">chevron_right</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Net Banking */}
              {selectedMethod === 'netbanking' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Choose your bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* 3D Secure OTP Modal */}
            {showOTP && (
              <div className="bg-white rounded-xl p-6 border-2 border-blue-600">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Enter OTP for 3D Secure Verification</h3>
                <p className="text-sm text-gray-600 mb-4">We&apos;ve sent a 6-digit OTP to your registered mobile number</p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="mb-4"
                />
                <Button onClick={handleOTPSubmit} className="w-full" disabled={paymentStatus === 'processing'}>
                  {paymentStatus === 'processing' ? 'Verifying...' : 'Verify & Pay'}
                </Button>
                <button className="w-full text-center text-sm text-blue-600 hover:underline mt-2">
                  Resend OTP
                </button>
              </div>
            )}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{booking.eventTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">Booking ID: {bookingId.substring(0, 8)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Tickets</h3>
                {Object.entries(booking.items.tickets).map(([tierId, quantity]) => (
                  <div key={tierId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{tierId} × {quantity}</span>
                    <span className="font-medium text-gray-900">₹{(quantity * 999).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {booking.items.addons && Object.keys(booking.items.addons).length > 0 && (
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">Add-ons</h3>
                  {Object.entries(booking.items.addons).map(([addon, selected]) => (
                    selected && (
                      <div key={addon} className="flex justify-between text-sm">
                        <span className="text-gray-600">{addon}</span>
                        <span className="font-medium text-gray-900">₹500</span>
                      </div>
                    )
                  ))}
                </div>
              )}

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{booking.financials.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium text-gray-900">₹{booking.financials.fees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium text-gray-900">₹{booking.financials.taxes.toLocaleString()}</span>
                </div>
                {booking.financials.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{booking.financials.discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₹{booking.financials.total.toLocaleString()}</span>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full"
                disabled={paymentStatus === 'processing' || paymentStatus === 'verifying'}
              >
                {paymentStatus === 'processing' && (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Processing...
                  </span>
                )}
                {paymentStatus === 'verifying' && 'Verifying...'}
                {paymentStatus === 'idle' && (
                  <>
                    <LockIcon className="mr-2" fontSize="small" />
                    Pay ₹{booking.financials.total.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

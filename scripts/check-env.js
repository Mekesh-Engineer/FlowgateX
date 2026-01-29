/**
 * Environment Variable Checker
 * Run this to verify your OTP system configuration
 * 
 * Usage: node scripts/check-env.js
 */

const requiredEnvVars = [
  'FIREBASE_SERVICE_ACCOUNT_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const optionalEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'CRON_SECRET',
];

console.log('🔍 Checking OTP System Configuration...\n');

let allRequired = true;
let hasOptional = false;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Required Environment Variables');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: Set`);
    if (envVar === 'FIREBASE_SERVICE_ACCOUNT_KEY') {
      try {
        const parsed = JSON.parse(value);
        console.log(`   └─ Project ID: ${parsed.project_id}`);
      } catch (e) {
        console.log(`   └─ ⚠️  Warning: Invalid JSON format`);
      }
    }
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
    allRequired = false;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📱 Optional SMS Provider Variables');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const twilioVars = optionalEnvVars.filter(v => v.startsWith('TWILIO'));
const awsVars = optionalEnvVars.filter(v => v.startsWith('AWS'));
const otherVars = optionalEnvVars.filter(v => !v.startsWith('TWILIO') && !v.startsWith('AWS'));

console.log('Twilio Configuration:');
twilioVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar}: Set`);
    hasOptional = true;
  } else {
    console.log(`  ⚪ ${envVar}: Not set`);
  }
});

console.log('\nAWS Configuration:');
awsVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar}: Set`);
    hasOptional = true;
  } else {
    console.log(`  ⚪ ${envVar}: Not set`);
  }
});

console.log('\nOther:');
otherVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar}: Set`);
  } else {
    console.log(`  ⚪ ${envVar}: Not set`);
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Summary');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allRequired) {
  console.log('✅ All required environment variables are set!');
  console.log('✅ Firebase configuration is complete');
  console.log('✅ OTP system can generate and store codes');
} else {
  console.log('❌ Some required variables are missing!');
  console.log('⚠️  OTP system will NOT work without Firebase config');
  console.log('');
  console.log('📝 To fix:');
  console.log('1. Check your .env.local file');
  console.log('2. Fill in your Firebase credentials');
  console.log('3. Run this script again');
  process.exit(1);
}

console.log('');

if (hasOptional) {
  console.log('📱 SMS Provider detected!');
  console.log('✅ OTP will be sent via SMS in production');
} else {
  console.log('⚠️  No SMS provider configured');
  console.log('ℹ️  OTP will be shown in console (development mode)');
  console.log('');
  console.log('For production:');
  console.log('• Add Twilio credentials for SMS');
  console.log('• Or add AWS SNS credentials');
  console.log('• Or use Firebase Phone Authentication');
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 Next Steps');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allRequired) {
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Go to: http://localhost:3000/register');
  console.log('3. Fill registration form and request OTP');
  console.log('4. Check console for OTP code (dev mode)');
  console.log('5. Enter OTP and complete registration');
  console.log('');
  console.log('📚 For more info, see: OTP_QUICKSTART.md');
} else {
  console.log('1. Set up Firebase environment variables');
  console.log('2. Run this script again to verify');
  console.log('3. See OTP_QUICKSTART.md for detailed setup');
}

console.log('');

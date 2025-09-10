// Paystack Configuration for SmartSkin Africa
// Replace these with your actual Paystack credentials

export const PaystackConfig = {
  // 🔑 REPLACE WITH YOUR PAYSTACK PUBLIC KEY
  // Get this from your Paystack Dashboard > Settings > API Keys & Webhooks
  publicKey: 'pk_test_ae96921e259f51977f468e537fa5ba9634efc0f4', // Replace with your actual public key
  
  // 🔐 REPLACE WITH YOUR PAYSTACK SECRET KEY (optional, for server-side verification)
  // Only use this if you want server-side payment verification
  secretKey: 'sk_test_64c5ba71f02c462d17d685be712f84144008c213', // Replace with your actual secret key
  
  // 💰 PAYMENT SETTINGS
  amount: 7000, // Amount in pesewas (70 GHS) - ADJUST AS NEEDED
  currency: 'GHS' as const, // Change to 'USD', 'GHS', 'ZAR', or 'KES' as needed
  
  // 📧 BUSINESS INFO
  businessName: 'SmartSkin Africa',
  
  // 🎯 SUGGESTED AMOUNTS (in kobo/cents)
  suggestedAmounts: {
    NGN: 500000, // 5,000 NGN (≈ $12 USD)
    USD: 1200,   // $12 USD  
    GHS: 7000,   // 70 GHS (≈ $12 USD)
    ZAR: 20000,  // 200 ZAR (≈ $12 USD)
    KES: 150000  // 1,500 KES (≈ $12 USD)
  }
};

// 📋 SETUP INSTRUCTIONS:
// 
// 1. Go to https://dashboard.paystack.com/
// 2. Sign in to your account
// 3. Go to Settings > API Keys & Webhooks
// 4. Copy your Public Key (starts with pk_test_ or pk_live_)
// 5. Copy your Secret Key (starts with sk_test_ or sk_live_)
// 6. Replace the keys above
// 7. Set your desired amount and currency
// 
// 💡 TESTING:
// - Use test keys (pk_test_, sk_test_) for development
// - Use live keys (pk_live_, sk_live_) for production
// 
// 🌍 CURRENCY GUIDE:
// - NGN: Nigerian Naira (most popular in West Africa)
// - USD: US Dollar (international customers)
// - GHS: Ghana Cedi (Ghana customers)
// - ZAR: South African Rand (South Africa customers)
// - KES: Kenyan Shilling (Kenya customers)
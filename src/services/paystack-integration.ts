// Direct Paystack Integration for SmartSkin Africa
export interface PaystackCustomer {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface PaystackConfig {
  publicKey: string;
  secretKey?: string; // Only needed for server-side verification
  amount: number; // Amount in kobo (NGN) or cents (USD)
  currency: 'NGN' | 'USD' | 'GHS' | 'ZAR' | 'KES';
}

export class PaystackIntegration {
  private config: PaystackConfig;

  constructor(config: PaystackConfig) {
    this.config = config;
  }

  // Initialize Paystack payment popup
  async initializePayment(customer: PaystackCustomer, callback: {
    onSuccess: (transaction: any) => void;
    onCancel: () => void;
    onClose: () => void;
  }): Promise<void> {
    
    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      await this.loadPaystackScript();
    }

    const handler = window.PaystackPop.setup({
      key: this.config.publicKey,
      email: customer.email,
      amount: this.config.amount,
      currency: this.config.currency,
      firstname: customer.first_name,
      lastname: customer.last_name,
      phone: customer.phone,
      metadata: {
        custom_fields: [
          {
            display_name: "Service",
            variable_name: "service",
            value: "SmartSkin AI Analysis"
          },
          {
            display_name: "Phone Number",
            variable_name: "phone",
            value: customer.phone
          }
        ]
      },
      callback: function(response: any) {
        console.log('✅ Payment successful:', response);
        callback.onSuccess(response);
      },
      onClose: function() {
        console.log('❌ Payment popup closed');
        callback.onClose();
      }
    });

    handler.openIframe();
  }

  // Load Paystack inline script
  private loadPaystackScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paystack-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'paystack-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  }

  // Verify payment on server (optional - for extra security)
  async verifyPayment(reference: string): Promise<any> {
    if (!this.config.secretKey) {
      throw new Error('Secret key required for payment verification');
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.data.status === 'success') {
        console.log('✅ Payment verified successfully');
        return data.data;
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (error) {
      console.error('❌ Payment verification error:', error);
      throw error;
    }
  }

  // Get supported currencies and their minimum amounts
  static getSupportedCurrencies() {
    return {
      NGN: { name: 'Nigerian Naira', minimum: 100 }, // 1 NGN
      USD: { name: 'US Dollar', minimum: 50 }, // $0.50
      GHS: { name: 'Ghana Cedi', minimum: 100 }, // 1 GHS
      ZAR: { name: 'South African Rand', minimum: 100 }, // 1 ZAR
      KES: { name: 'Kenyan Shilling', minimum: 100 } // 1 KES
    };
  }

  // Helper method to convert major currency to minor units
  static convertToMinorUnits(amount: number, currency: string): number {
    // Paystack expects amounts in minor units (kobo for NGN, cents for USD, etc.)
    return Math.round(amount * 100);
  }
}

// Type declaration for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}
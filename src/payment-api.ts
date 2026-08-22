import { requiredEnv } from './env';

export class PaymentApi {
  private apiKey: string = requiredEnv('NEXT_PUBLIC_PAYMENT_API_KEY', process.env.NEXT_PUBLIC_PAYMENT_API_KEY);
  private baseUrl: string = requiredEnv('NEXT_PUBLIC_PAYMENT_BASE_URL', process.env.NEXT_PUBLIC_PAYMENT_BASE_URL);
  private headers = { 'Content-Type': 'application/json', 'x-api-key': this.apiKey };

  // Method to get payment meta data
  async getPaymentData(): Promise<{ key: string; price: number }> {
    const response = await fetch(`${this.baseUrl}/credentials`, {
      headers: this.headers,
    });

    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error('Failed to get payment data');
    }
  }

  // Method to initiate payment
  async initiatePayment(access_code: string, customer: Record<string, string>): Promise<string> {
    const response = await fetch(`${this.baseUrl}/initiate`, {
      method: 'POST',
      body: JSON.stringify({ access_code, customer }),
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.message;
    } else {
      throw new Error('Failed to initiate payment');
    }
  }

  // Method to verify payment
  async verifyPayment(reference: string, access_code: string, key: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      body: JSON.stringify({ reference, access_code, key }),
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.message;
    } else {
      throw new Error('Failed to verify payment');
    }
  }

  // Method to verify payment
  async sendContactForm(fullName: string, email: string, phone: string, message: string): Promise<string> {
    const response = await fetch(`${this.baseUrl.replace(/\/payment$/, '')}/contact`, {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone, message }),
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.message;
    } else {
      throw new Error('Failed to send contact form');
    }
  }
}

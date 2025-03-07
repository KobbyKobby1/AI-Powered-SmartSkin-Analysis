export class PaymentApi {
  private apiKey: string = 'c073ab50-bded-4446-b71e-27637df054bd';
  // private baseUrl: string = 'http://localhost:5890/payment';
  private baseUrl: string = 'https://payment.smartskinafrica.com/payment';
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
    const response = await fetch(`https://payment.smartskinafrica.com/contact`, {
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

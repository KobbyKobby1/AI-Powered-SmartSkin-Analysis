// Payment Integration Service - Links payment verification to report delivery
import { PaystackIntegration, PaystackCustomer } from './paystack-integration';
import { PaystackConfig } from '../config/paystack-config';
import { Api } from '../api';

export interface PaymentRequest {
  sessionId: string;
  userInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export class PaymentIntegrationService {
  private skinAnalysisApi = new Api();
  private paystackIntegration: PaystackIntegration;

  constructor() {
    // Initialize Paystack with your configuration
    this.paystackIntegration = new PaystackIntegration({
      publicKey: PaystackConfig.publicKey,
      secretKey: PaystackConfig.secretKey,
      amount: PaystackConfig.amount,
      currency: PaystackConfig.currency
    });
  }

  // NEW: Direct Paystack payment initiation
  async initiatePaystackPayment(request: PaymentRequest): Promise<void> {
    console.log('💳 Initiating Paystack payment for skin analysis report...');
    
    try {
      // Prepare customer data for Paystack
      const customer: PaystackCustomer = {
        email: request.userInfo.email,
        first_name: request.userInfo.name.split(' ')[0] || request.userInfo.name,
        last_name: request.userInfo.name.split(' ').slice(1).join(' ') || 'User',
        phone: request.userInfo.phone
      };
      
      // Store session info for post-payment processing
      this.storePaymentSession(request);
      
      console.log('👤 Customer data prepared:', customer);
      console.log(`💰 Amount: ${PaystackConfig.amount / 100} ${PaystackConfig.currency}`);
      
      // Initialize Paystack payment popup
      await this.paystackIntegration.initializePayment(customer, {
        onSuccess: (transaction) => {
          console.log('🎉 Payment successful!', transaction);
          this.handlePaymentSuccess(transaction.reference, request);
        },
        onCancel: () => {
          console.log('❌ Payment cancelled by user');
          alert('Payment was cancelled. Please try again to get your skin analysis report.');
        },
        onClose: () => {
          console.log('📱 Payment popup closed');
        }
      });
      
    } catch (error) {
      console.error('❌ Paystack payment initiation failed:', error);
      throw new Error(`Payment failed: ${error}`);
    }
  }


  // NEW: Handle Paystack payment success
  async handlePaymentSuccess(paymentReference: string, request: PaymentRequest): Promise<string> {
    console.log('🎉 Paystack payment success:', paymentReference);
    console.log('🔍 Debug - Using sessionId for report generation:', request.sessionId);
    
    try {
      // Debug: Check if analysis data exists
      const analysisDataCheck = localStorage.getItem(`analysis_${request.sessionId}`);
      console.log('🔍 Debug - Analysis data available:', analysisDataCheck ? 'YES' : 'NO');
      
      if (!analysisDataCheck) {
        console.warn('⚠️ Analysis data not found, creating mock data for testing...');
        
        // Create mock analysis data for testing
        const mockAnalysisData = {
          scores: [
            { name: 'dark_spots', value: 25, color: '#FF6961' },
            { name: 'hydration', value: 40, color: '#FFB347' },
            { name: 'acne', value: 75, color: '#00FF00' }
          ],
          recommendations: [
            {
              issueTargeted: 'dark_spots',
              products: [
                {
                  id: 'test-product-1',
                  name: 'Vitamin C Serum',
                  brand: 'The Ordinary',
                  category: 'brightening-serum',
                  targetIssues: ['dark_spots'],
                  ingredients: ['Vitamin C', 'Vitamin E'],
                  description: 'Brightening serum for dark spots',
                  priceRange: '$7-12',
                  imageUrl: 'https://theordinary.com/vitamin-c.jpg',
                  purchaseUrl: 'https://theordinary.com/vitamin-c',
                  suitableFor: ['all skin types'],
                  howToUse: 'Apply AM before moisturizer',
                  source: 'amazon'
                }
              ],
              treatmentType: 'primary'
            }
          ],
          userInfo: { 
            name: request.userInfo.name, 
            gender: 'female', 
            age: '25-35' 
          },
          aiResult: {
            skinType: 'combination',
            confidence: 85,
            analysis: {
              oiliness: { score: 60, zones: ['T-zone'] },
              poreSize: { score: 70, description: 'Normal' },
              texture: { score: 75, description: 'Good' },
              sensitivity: { score: 80, description: 'Low' },
              hydration: { score: 45, description: 'Needs improvement' }
            }
          }
        };
        
        // Store the mock data
        localStorage.setItem(`analysis_${request.sessionId}`, JSON.stringify(mockAnalysisData));
        console.log('✅ Mock analysis data created and stored');
      }
      
      // Optional: Verify payment with Paystack (for extra security)
      if (PaystackConfig.secretKey && PaystackConfig.secretKey !== 'sk_test_your_secret_key_here') {
        console.log('🔍 Verifying payment with Paystack...');
        const verificationResult = await this.paystackIntegration.verifyPayment(paymentReference);
        console.log('✅ Payment verified:', verificationResult);
      }
      
      // Generate and deliver the report immediately
      console.log('🚀 Generating report for sessionId:', request.sessionId);
      const deliveryResult = await this.skinAnalysisApi.generateAndSendReport(
        request.sessionId,
        request.userInfo.email,
        request.userInfo.phone
      );
      
      console.log('📄 Report delivered successfully');
      
      // Clean up session data
      this.cleanupPaymentSession(paymentReference);
      
      // Show success message to user
      alert('🎉 Payment successful! Your skin analysis report is being generated and will be delivered to WhatsApp shortly.');
      
      return deliveryResult;
      
    } catch (error) {
      console.error('❌ Payment success handling failed:', error);
      alert('❌ Payment was successful, but there was an issue generating your report. Please contact support.');
      throw error;
    }
  }

  // LEGACY: Handle payment success callback (for frontend)
  async handlePaymentSuccess_Legacy(paymentReference: string): Promise<string> {
    console.log('🎉 Payment success callback received:', paymentReference);
    
    try {
      // Find session by reference (you might need to modify this based on your storage)
      const allSessions = this.getAllPaymentSessions();
      const sessionData = allSessions.find(session => 
        session.paymentReference === paymentReference
      );
      
      if (!sessionData) {
        // Try to find by any stored reference pattern
        const fallbackSession = allSessions[0]; // Use latest session as fallback
        if (fallbackSession) {
          return this.deliverReportForSession(fallbackSession);
        }
        throw new Error('No session found for payment reference');
      }
      
      return this.deliverReportForSession(sessionData);
      
    } catch (error) {
      console.error('❌ Payment success handling failed:', error);
      throw error;
    }
  }

  private async deliverReportForSession(sessionData: any): Promise<string> {
    try {
      // Generate and deliver the report immediately
      const deliveryResult = await this.skinAnalysisApi.generateAndSendReport(
        sessionData.sessionId,
        sessionData.userInfo.email,
        sessionData.userInfo.phone
      );
      
      console.log('📄 Report delivered successfully');
      return deliveryResult;
      
    } catch (error) {
      console.error('❌ Report delivery failed:', error);
      throw error;
    }
  }

  // Store payment session data
  private storePaymentSession(request: PaymentRequest): void {
    const sessionKey = `payment_session_${request.sessionId}`;
    const sessionData = {
      ...request,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    
    // Also store in a list for easy retrieval
    const allSessions = this.getAllPaymentSessions();
    allSessions.push(sessionData);
    localStorage.setItem('all_payment_sessions', JSON.stringify(allSessions));
    
    console.log('💾 Payment session stored:', sessionKey);
  }

  // Retrieve payment session data
  private getPaymentSession(reference: string): PaymentRequest | null {
    try {
      // Try to find by reference first
      const allSessions = this.getAllPaymentSessions();
      return allSessions.find(session => session.sessionId.includes(reference)) || null;
      
    } catch (error) {
      console.error('Error retrieving payment session:', error);
      return null;
    }
  }

  // Get all payment sessions
  private getAllPaymentSessions(): any[] {
    try {
      const sessions = localStorage.getItem('all_payment_sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error retrieving all payment sessions:', error);
      return [];
    }
  }

  // Clean up payment session data
  private cleanupPaymentSession(reference: string): void {
    try {
      const allSessions = this.getAllPaymentSessions();
      const updatedSessions = allSessions.filter(session => 
        !session.sessionId.includes(reference)
      );
      
      localStorage.setItem('all_payment_sessions', JSON.stringify(updatedSessions));
      localStorage.removeItem(`payment_session_${reference}`);
      
      console.log('🧹 Payment session cleaned up:', reference);
    } catch (error) {
      console.error('Error cleaning up payment session:', error);
    }
  }

  // Test method for development
  async testReportGeneration(sessionId: string, userName: string, email: string, phone: string): Promise<string> {
    console.log('🧪 Testing report generation without payment...');
    
    try {
      // Generate and deliver report directly (bypass payment)
      const result = await this.skinAnalysisApi.generateAndSendReport(sessionId, email, phone);
      
      console.log('✅ Test report generated successfully');
      return result;
      
    } catch (error) {
      console.error('❌ Test report generation failed:', error);
      throw error;
    }
  }
}
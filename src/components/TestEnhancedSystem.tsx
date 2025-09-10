import React, { useState } from 'react';
import { EnhancedProductService } from '../services/enhanced-product-service';
import { PDFService } from '../services/pdf-service';
import { WhatsAppService } from '../services/whatsapp-service';
import { PaymentIntegrationService } from '../services/payment-integration';
import { Api } from '../api';

interface TestResults {
  products?: any;
  pdf?: boolean;
  whatsapp?: string;
  fullFlow?: string;
  paystack?: string;
  error?: string;
}

export const TestEnhancedSystem = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [testType, setTestType] = useState<string>('products');

  // Test individual components
  const testProductRecommendations = async () => {
    console.log('🧪 Testing product recommendation system...');
    
    const productService = new EnhancedProductService();
    
    // Mock data from your actual analysis system
    const mockScores = [
      { name: 'dark_spots', value: 15, color: '#FF6961' },   // High severity
      { name: 'acne', value: 45, color: '#FFB347' },          // Moderate severity  
      { name: 'hydration', value: 35, color: '#FF6961' },     // High severity
      { name: 'sensitivity', value: 75, color: '#00FF00' }    // Low severity
    ];

    const recommendations = await productService.analyzeAndRecommend(mockScores);
    
    console.log('✅ Product recommendations generated:', recommendations);
    return recommendations;
  };

  const testPDFGeneration = async () => {
    console.log('🧪 Testing PDF generation...');
    
    const pdfService = new PDFService();
    const productService = new EnhancedProductService();
    
    // Generate mock data
    const mockScores = [
      { name: 'dark_spots', value: 20, color: '#FF6961' },
      { name: 'hydration', value: 40, color: '#FFB347' },
      { name: 'sensitivity', value: 80, color: '#00FF00' }
    ];
    
    const recommendations = await productService.analyzeAndRecommend(mockScores);
    
    const mockAnalysisData = {
      scores: mockScores,
      recommendations,
      userInfo: {
        name: 'Test User',
        gender: 'female',
        age: '25-35'
      },
      aiResult: {
        skinType: 'combination',
        confidence: 87,
        analysis: {
          oiliness: { score: 60, zones: ['T-zone shows moderate oil production'] },
          poreSize: { score: 70, description: 'Normal pore size in most areas' },
          texture: { score: 75, description: 'Generally good texture' },
          sensitivity: { score: 80, description: 'Low sensitivity detected' },
          hydration: { score: 45, description: 'Could benefit from more hydration' }
        }
      }
    };

    const pdfBlob = await pdfService.generateSkinAnalysisReport(mockAnalysisData);
    
    // Trigger download for testing
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartSkin_Test_Report.pdf';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ PDF generated and downloaded');
    return true;
  };

  const testWhatsAppDelivery = async () => {
    console.log('🧪 Testing WhatsApp delivery...');
    
    const whatsAppService = new WhatsAppService();
    const pdfService = new PDFService();
    
    // Generate a mock PDF
    const mockAnalysisData = {
      scores: [{ name: 'test', value: 50, color: '#FFB347' }],
      recommendations: [],
      userInfo: { name: 'Test User', gender: 'female', age: '25' },
      aiResult: { skinType: 'normal', confidence: 85, analysis: {} }
    };
    
    const pdfBlob = await pdfService.generateSkinAnalysisReport(mockAnalysisData);
    
    // Test WhatsApp message (will open WhatsApp with test number)
    const result = await whatsAppService.sendReport('+1234567890', pdfBlob, 'Test User');
    
    console.log('✅ WhatsApp delivery test completed');
    return result;
  };

  const testFullFlow = async () => {
    console.log('🧪 Testing complete integration flow...');
    
    const api = new Api();
    const paymentIntegration = new PaymentIntegrationService();
    
    // Generate a mock session
    const sessionId = 'test_' + Date.now();
    
    // Mock image analysis
    const mockImageBlob = new Blob(['fake image data'], { type: 'image/png' });
    
    // Run full analysis
    const analysisResult = await api.getSkinScoresAndRecommendations(
      sessionId,
      mockImageBlob,
      'combination',
      'female',
      '25-35',
      'Test User'
    );
    
    console.log('🔬 Analysis completed:', analysisResult);
    
    // Test report generation (bypassing payment for testing)
    const reportResult = await paymentIntegration.testReportGeneration(
      sessionId,
      'Test User',
      'test@example.com',
      '+1234567890'
    );
    
    console.log('✅ Full flow test completed');
    return `Analysis completed with ${analysisResult.scores.length} scores and ${analysisResult.recommendations.length} product categories. ${reportResult}`;
  };

  const testPaystackPayment = async () => {
    console.log('🧪 Testing Paystack payment integration...');
    
    const paymentIntegration = new PaymentIntegrationService();
    
    // Mock payment request
    const paymentRequest = {
      sessionId: 'test_' + Date.now(),
      userInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+233123456789' // Ghana number format
      }
    };
    
    try {
      // This will open the Paystack payment popup
      await paymentIntegration.initiatePaystackPayment(paymentRequest);
      return 'Paystack payment popup opened! Amount: 70 GHS. Use test card: 4084084084084081 to complete payment and test the full report delivery flow.';
    } catch (error) {
      throw new Error(`Paystack test failed: ${error}`);
    }
  };

  const runTest = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      let result: any;
      
      switch (testType) {
        case 'products':
          result = { products: await testProductRecommendations() };
          break;
        case 'pdf':
          result = { pdf: await testPDFGeneration() };
          break;
        case 'whatsapp':
          result = { whatsapp: await testWhatsAppDelivery() };
          break;
        case 'fullflow':
          result = { fullFlow: await testFullFlow() };
          break;
        case 'paystack':
          result = { paystack: await testPaystackPayment() };
          break;
        default:
          throw new Error('Unknown test type');
      }
      
      setResults(result);
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResults({ error: String(error) });
    }
    
    setTesting(false);
  };

  return (
    <div style={{ 
      padding: '30px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#602DEE', marginBottom: '30px' }}>
        🧪 SmartSkin Enhanced System Test Interface
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Select Test Type:
        </label>
        <select 
          value={testType} 
          onChange={(e) => setTestType(e.target.value)}
          style={{ 
            padding: '10px', 
            fontSize: '16px', 
            borderRadius: '5px',
            border: '2px solid #602DEE',
            marginRight: '15px',
            minWidth: '200px'
          }}
        >
          <option value="products">🛍️ Product Recommendations</option>
          <option value="pdf">📄 PDF Generation</option>
          <option value="whatsapp">📱 WhatsApp Delivery</option>
          <option value="paystack">💳 Paystack Payment</option>
          <option value="fullflow">🔄 Complete Flow Test</option>
        </select>
        
        <button 
          onClick={runTest} 
          disabled={testing}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: testing ? '#ccc' : '#602DEE',
            color: 'white',
            cursor: testing ? 'not-allowed' : 'pointer',
            marginLeft: '10px'
          }}
        >
          {testing ? 'Testing...' : '▶️ Run Test'}
        </button>
      </div>

      {/* Test Descriptions */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h3>Test Descriptions:</h3>
        <ul>
          <li><strong>🛍️ Product Recommendations:</strong> Tests the enhanced product database with real skincare products</li>
          <li><strong>📄 PDF Generation:</strong> Creates and downloads a comprehensive skin analysis PDF report</li>
          <li><strong>📱 WhatsApp Delivery:</strong> Tests WhatsApp message generation and PDF download</li>
          <li><strong>💳 Paystack Payment:</strong> Tests the new Paystack payment integration (opens payment popup)</li>
          <li><strong>🔄 Complete Flow:</strong> Tests the entire pipeline: Analysis → PDF → WhatsApp delivery</li>
        </ul>
      </div>

      {/* Results Display */}
      {results && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#602DEE' }}>📊 Test Results:</h3>
          
          {results.error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '15px', 
              borderRadius: '5px',
              border: '1px solid #c62828'
            }}>
              <strong>❌ Error:</strong> {results.error}
            </div>
          )}
          
          {results.products && (
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>
              <h4>✅ Product Recommendations Generated Successfully!</h4>
              <p><strong>Found {results.products.length} product categories:</strong></p>
              <ul>
                {results.products.map((rec: any, index: number) => (
                  <li key={index}>
                    <strong>{rec.issueTargeted.replace(/_/g, ' ')}:</strong> {rec.products.length} products
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {results.pdf && (
            <div style={{ 
              backgroundColor: '#e3f2fd', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>
              <h4>✅ PDF Generated and Downloaded!</h4>
              <p>Check your downloads folder for 'SmartSkin_Test_Report.pdf'</p>
            </div>
          )}
          
          {results.whatsapp && (
            <div style={{ 
              backgroundColor: '#fff3e0', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>
              <h4>✅ WhatsApp Delivery Test Completed!</h4>
              <p>{results.whatsapp}</p>
            </div>
          )}
          
          {results.fullFlow && (
            <div style={{ 
              backgroundColor: '#f3e5f5', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>
              <h4>✅ Complete Flow Test Successful!</h4>
              <p>{results.fullFlow}</p>
            </div>
          )}
          
          {results.paystack && (
            <div style={{ 
              backgroundColor: '#e8f4f8', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>
              <h4>✅ Paystack Payment Test Initiated!</h4>
              <p>{results.paystack}</p>
              <p><strong>💳 Test Card:</strong> 4084084084084081</p>
              <p><strong>💰 Amount:</strong> 70 pesewas (0.70 GHS)</p>
              <p><strong>🔧 Debug:</strong> Check browser console for detailed logs</p>
            </div>
          )}
          
          {/* Raw JSON for debugging */}
          {results.products && (
            <details style={{ marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                🔍 View Raw Data (Developer)
              </summary>
              <pre style={{ 
                backgroundColor: '#f8f8f8', 
                padding: '15px', 
                borderRadius: '5px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '400px'
              }}>
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#e8f4fd',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#1976d2' }}>📋 Usage Instructions:</h3>
        <ol>
          <li>Select a test type from the dropdown</li>
          <li>Click "Run Test" to execute</li>
          <li>Check the console (F12) for detailed logs</li>
          <li>For PDF/WhatsApp tests, check your downloads folder</li>
          <li>WhatsApp test will open a new tab with a test message</li>
        </ol>
        
        <h4 style={{ color: '#1976d2', marginTop: '20px' }}>🚀 Ready for Production:</h4>
        <p>
          Once tests pass, your system will automatically:<br/>
          ✅ Analyze uploaded skin images<br/>
          ✅ Generate personalized product recommendations<br/>
          ✅ Create comprehensive PDF reports<br/>
          ✅ Deliver reports via WhatsApp after payment<br/>
        </p>
      </div>
    </div>
  );
};
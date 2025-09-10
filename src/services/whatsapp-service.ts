// src/services/whatsapp-service.ts
export class WhatsAppService {
  private apiKey = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
  private baseUrl = 'https://api.whatsapp.com/send'; // or your WhatsApp Business API

  async sendReport(phoneNumber: string, pdfBlob: Blob, userName: string): Promise<string> {
    try {
      console.log('📱 Sending WhatsApp report to:', phoneNumber);
      
      // Clean phone number (remove any non-digits except +)
      const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
      
      // Method 1: Direct WhatsApp Web Link with immediate PDF download
      const reportId = `SSA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const message = `🌟 *SmartSkin Africa - Your AI Skin Analysis Report* 🌟

Hello ${userName}! 👋

✅ *Your personalized skin analysis is complete!*

📊 **What's included in your report:**
• AI-powered skin type detection
• Detailed skin health scoring  
• Personalized product recommendations
• Step-by-step skincare routine
• Purchase links for recommended products

💡 **Your report has been automatically downloaded to your device**

📱 *Questions?* Reply to this message for support

🚀 SmartSkin Africa - *Your skin, our AI, Africa's future*

---
Report ID: ${reportId}
Generated: ${new Date().toLocaleDateString()}`;
      
      const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
      
      // Store PDF for immediate download
      await this.triggerPDFDownload(pdfBlob, userName, reportId);
      
      // Open WhatsApp with delay to allow download to start
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
      
      return `✅ Report generated and ready for WhatsApp sharing! Download started automatically.`;
      
    } catch (error) {
      console.error('❌ WhatsApp sending failed:', error);
      throw new Error('Failed to send WhatsApp report');
    }
  }

  private async triggerPDFDownload(pdfBlob: Blob, userName: string, reportId: string): Promise<void> {
    return new Promise((resolve) => {
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SmartSkin_${userName.replace(/[^a-zA-Z0-9]/g, '_')}_Report_${reportId.split('_')[1]}.pdf`;
      a.style.display = 'none';
      
      // Add to DOM, click, and clean up
      document.body.appendChild(a);
      a.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 500);
    });
  }

  // Alternative: Use WhatsApp Business API (for production)
  async sendReportViaAPI(phoneNumber: string, pdfBlob: Blob, userName: string): Promise<string> {
    const formData = new FormData();
    formData.append('phone', phoneNumber);
    formData.append('message', `Hello ${userName}! Your SmartSkin Africa report is ready.`);
    formData.append('document', pdfBlob, `${userName}_Report.pdf`);
    
    const response = await fetch('/api/whatsapp/send-document', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('WhatsApp API failed');
    
    const result = await response.json();
    return result.message;
  }
}
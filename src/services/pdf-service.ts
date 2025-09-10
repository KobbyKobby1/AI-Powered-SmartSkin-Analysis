// src/services/pdf-service.ts
import jsPDF from 'jspdf';
import { ConcernDescriptions } from '../skin-pages/recommendation/concerns-description';
import logoImage from '../assets/logo.png';

export class PDFService {
  private doc: jsPDF | null = null;
  private pageWidth = 210; // A4 width in mm
  private pageHeight = 297; // A4 height in mm
  private margin = 20;
  private currentPage = 1;

  private async addPageHeader(pageTitle?: string) {
    if (!this.doc) return;
    
    try {
      // Add small logo in header
      this.doc.addImage(logoImage, 'PNG', 15, 10, 40, 13);
    } catch (error) {
      // Fallback text if logo fails
      this.doc.setFontSize(12);
      this.doc.setTextColor(218, 165, 32);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('SmartSkin Africa', 15, 20);
    }
    
    if (pageTitle) {
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(pageTitle, this.pageWidth - 15, 20, { align: 'right' });
    }
    
    // Add header line
    this.doc.setDrawColor(218, 165, 32);
    this.doc.setLineWidth(0.5);
    this.doc.line(15, 30, this.pageWidth - 15, 30);
    
    // Add page number in footer
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(`Page ${this.currentPage}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    this.currentPage++;
  }

  async generateSkinAnalysisReport(analysisData: any): Promise<Blob> {
    console.log('📄 Creating professional PDF report...');
    
    this.doc = new jsPDF();
    this.currentPage = 1; // Reset page counter
    const { scores, recommendations, userInfo, aiResult, userImage } = analysisData;
    
    // Page 1: Cover page with logo and title
    await this.addCoverPage(userInfo.name);
    
    // Page 2: Skin Analysis Results with colored boxes
    this.doc.addPage();
    await this.addPageHeader('Skin Analysis Results');
    await this.addSkinAnalysisPage(scores, aiResult, userImage);
    
    // Page 3+: Product Recommendations
    this.doc.addPage();
    await this.addPageHeader('Product Recommendations');
    this.addProductRecommendationsPage(recommendations);
    
    // Final Page: Glossary
    this.doc.addPage();
    await this.addPageHeader('Glossary & Definitions');
    this.addGlossaryPage();
    
    return this.doc.output('blob');
  }

  private async addCoverPage(userName: string) {
    if (!this.doc) return;
    
    // Light purple background
    this.doc.setFillColor(245, 240, 255);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    const centerX = this.pageWidth / 2;
    
    try {
      // Add the actual SmartSkin logo
      this.doc.addImage(logoImage, 'PNG', centerX - 60, 50, 120, 40);
    } catch (error) {
      console.warn('Failed to add logo, using fallback design:', error);
      
      // Fallback: Enhanced logo design if image fails
      // Outer circle (gold ring)
      this.doc.setFillColor(218, 165, 32); // Gold color
      this.doc.circle(centerX, 80, 28, 'F');
      
      // Inner circle (white background for S)
      this.doc.setFillColor(255, 255, 255);
      this.doc.circle(centerX, 80, 24, 'F');
      
      // Gold S letter
      this.doc.setTextColor(218, 165, 32);
      this.doc.setFontSize(48);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('S', centerX, 90, { align: 'center' });
      
      // Brand name
      this.doc.setTextColor(218, 165, 32);
      this.doc.setFontSize(36);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Smartskin Africa', centerX, 140, { align: 'center' });
    }
    
    // Add decorative elements
    this.doc.setDrawColor(218, 165, 32);
    this.doc.setLineWidth(2);
    this.doc.line(centerX - 60, 120, centerX + 60, 120);
    
    // Main title
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Your Skin Analysis', centerX, 160, { align: 'center' });
    this.doc.text('Report', centerX, 190, { align: 'center' });
    
    // Add user name if provided
    if (userName && userName !== 'User') {
      this.doc.setFontSize(14);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`Prepared for: ${userName}`, centerX, 210, { align: 'center' });
    }
    
    // Generated date
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, centerX, 230, { align: 'center' });
  }

  private async addSkinAnalysisPage(scores: any[], aiResult: any, userImage?: string | Blob) {
    if (!this.doc) return;
    
    let yPosition = 45; // Account for header
    
    // Page title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Your Skin Analysis Report', this.pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 25;
    
    // User image - make it more prominent and centered
    const imageX = this.pageWidth / 2 - 50; // Center the image
    const imageY = yPosition;
    const imageWidth = 100; // Bigger image
    const imageHeight = 120; // Bigger image
    
    try {
      if (userImage) {
        // Convert image to base64 if it's a Blob
        let imageData: string;
        
        if (userImage instanceof Blob) {
          imageData = await this.blobToBase64(userImage);
        } else if (typeof userImage === 'string') {
          imageData = userImage;
        } else {
          throw new Error('Invalid image format');
        }
        
        // Add professional border and shadow effect
        this.doc.setFillColor(255, 255, 255);
        this.doc.rect(imageX - 3, imageY - 3, imageWidth + 6, imageHeight + 6, 'F');
        this.doc.setDrawColor(200, 200, 200);
        this.doc.setLineWidth(2);
        this.doc.rect(imageX - 3, imageY - 3, imageWidth + 6, imageHeight + 6);
        
        // Add the user image to PDF
        this.doc.addImage(imageData, 'JPEG', imageX, imageY, imageWidth, imageHeight);
        
        // Add border around image
        this.doc.setDrawColor(218, 165, 32); // Gold border
        this.doc.setLineWidth(2);
        this.doc.rect(imageX, imageY, imageWidth, imageHeight);
        
      } else {
        // Fallback: Professional placeholder
        this.doc.setFillColor(245, 245, 245);
        this.doc.rect(imageX, imageY, imageWidth, imageHeight, 'F');
        this.doc.setDrawColor(218, 165, 32);
        this.doc.setLineWidth(2);
        this.doc.rect(imageX, imageY, imageWidth, imageHeight);
        
        // Add placeholder text
        this.doc.setFontSize(12);
        this.doc.setTextColor(120, 120, 120);
        this.doc.text('Your Photo', imageX + imageWidth/2, imageY + imageHeight/2 - 10, { align: 'center' });
        this.doc.text('Will Appear Here', imageX + imageWidth/2, imageY + imageHeight/2, { align: 'center' });
        this.doc.text('After Upload', imageX + imageWidth/2, imageY + imageHeight/2 + 10, { align: 'center' });
      }
    } catch (error) {
      console.warn('Failed to add user image to PDF:', error);
      
      // Fallback placeholder
      this.doc.setFillColor(245, 245, 245);
      this.doc.rect(imageX, imageY, imageWidth, imageHeight, 'F');
      this.doc.setDrawColor(218, 165, 32);
      this.doc.setLineWidth(2);
      this.doc.rect(imageX, imageY, imageWidth, imageHeight);
      this.doc.setFontSize(12);
      this.doc.setTextColor(120, 120, 120);
      this.doc.text('Your Photo Here', imageX + imageWidth/2, imageY + imageHeight/2, { align: 'center' });
    }
    
    yPosition += imageHeight + 15;
    
    // Overall skin score with better styling - centered under image
    const overallScore = Math.round(scores.reduce((sum, score) => sum + score.value, 0) / scores.length);
    
    // Score background box - centered and wider
    const scoreBoxWidth = 120;
    const scoreBoxX = this.pageWidth / 2 - scoreBoxWidth / 2;
    this.doc.setFillColor(0, 0, 0);
    this.doc.rect(scoreBoxX, yPosition, scoreBoxWidth, 25, 'F');
    
    // Score text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Your Skin Score is ${overallScore}%`, this.pageWidth / 2, yPosition + 16, { align: 'center' });
    yPosition += 40;
    
    // Score boxes in grid layout
    this.addScoreBoxes(scores, yPosition);
    
    // Legend
    this.addLegend();
  }
  
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private addScoreBoxes(scores: any[], startY: number) {
    if (!this.doc) return;
    
    const boxWidth = 40;
    const boxHeight = 25;
    const spacing = 5;
    const cols = 4;
    
    let x = this.margin;
    let y = startY;
    let col = 0;
    
    scores.forEach((score, index) => {
      // Calculate position
      if (col >= cols) {
        col = 0;
        x = this.margin;
        y += boxHeight + spacing + 5;
      }
      
      // Determine color based on score
      let fillColor: [number, number, number];
      if (score.value <= 60) {
        fillColor = [255, 105, 97]; // Red - Needs attention
      } else if (score.value <= 80) {
        fillColor = [255, 179, 71]; // Orange - Average
      } else {
        fillColor = [76, 175, 80]; // Green - Good
      }
      
      // Draw colored box
      this.doc!.setFillColor(...fillColor);
      this.doc!.rect(x, y, boxWidth, boxHeight, 'F');
      
      // Add score name (first line)
      this.doc!.setTextColor(0, 0, 0);
      this.doc!.setFontSize(8);
      this.doc!.setFont('helvetica', 'bold');
      const scoreName = this.formatScoreName(score.name);
      this.doc!.text(scoreName, x + boxWidth/2, y + 8, { align: 'center' });
      
      // Add percentage (second line)
      this.doc!.setFontSize(12);
      this.doc!.text(`${score.value}%`, x + boxWidth/2, y + 18, { align: 'center' });
      
      x += boxWidth + spacing;
      col++;
    });
  }

  private formatScoreName(name: string): string {
    // Format score names to match the reference PDF
    const nameMap: { [key: string]: string } = {
      'dark_spots': 'Dark Spots',
      'uneven_skin': 'Uneven\nSkin Tone',
      'pigmentation': 'Hyper\nPigmentation',
      'dark_circle': 'Dark Circle',
      'skin_dullness': 'Dullness',
      'acne': 'Acne',
      'face_wrinkles': 'Finelines &\nWrinkles',
      'eye_wrinkles': 'Eye\nWrinkles',
      'crows_feet': 'Crow\'s Feet',
      'redness': 'Redness',
      'firmness': 'Saggy skin',
      'oxygen': 'Lack of\nOxygen',
      'smoothness': 'Lack of\nSmoothness',
      'texture': 'Lack of\nTexture',
      'hydration': 'Dehydration'
    };
    
    return nameMap[name] || name.replace(/_/g, ' ');
  }

  private addLegend() {
    if (!this.doc) return;
    
    const legendY = 250;
    const legendStartX = this.margin;
    
    // Red circle
    this.doc.setFillColor(255, 105, 97);
    this.doc.circle(legendStartX + 5, legendY, 3, 'F');
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.text('Needs attention (0-60)', legendStartX + 12, legendY + 2);
    
    // Orange circle
    this.doc.setFillColor(255, 179, 71);
    this.doc.circle(legendStartX + 65, legendY, 3, 'F');
    this.doc.text('Average (61-80)', legendStartX + 72, legendY + 2);
    
    // Green circle
    this.doc.setFillColor(76, 175, 80);
    this.doc.circle(legendStartX + 110, legendY, 3, 'F');
    this.doc.text('Good (81-100)', legendStartX + 117, legendY + 2);
  }

  private addProductRecommendationsPage(recommendations: any[]) {
    if (!this.doc) return;
    
    let yPosition = 50; // Account for header
    
    // Page title
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Recommended products for your skin concern', this.pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 30;
    
    // Product grid (2x2 layout like the reference)
    const productBoxWidth = 80;
    const productBoxHeight = 100;
    const spacing = 10;
    
    let col = 0;
    let row = 0;
    const maxCols = 2;
    
    recommendations.forEach((rec, recIndex) => {
      if (!rec.products || rec.products.length === 0) return;
      
      // Take first 2 products from each recommendation
      rec.products.slice(0, 2).forEach(async (product: any, prodIndex: number) => {
        if (yPosition + productBoxHeight > this.pageHeight - 50) {
          this.doc!.addPage();
          await this.addPageHeader('Product Recommendations (continued)');
          yPosition = 60;
          row = 0;
          col = 0;
        }
        
        const x = this.margin + col * (productBoxWidth + spacing);
        const y = yPosition + row * (productBoxHeight + spacing);
        
        // Product box
        this.doc!.setDrawColor(200, 200, 200);
        this.doc!.setLineWidth(1);
        this.doc!.rect(x, y, productBoxWidth, productBoxHeight);
        
        // Product image placeholder
        this.doc!.setFillColor(240, 240, 240);
        this.doc!.rect(x + 5, y + 5, productBoxWidth - 10, 50, 'F');
        this.doc!.setFontSize(8);
        this.doc!.setTextColor(100, 100, 100);
        this.doc!.text('Product Image', x + productBoxWidth/2, y + 32, { align: 'center' });
        
        // Product name
        this.doc!.setTextColor(0, 0, 0);
        this.doc!.setFontSize(10);
        this.doc!.setFont('helvetica', 'bold');
        const productName = String(product.name || 'Unknown Product');
        this.doc!.text(productName, x + productBoxWidth/2, y + 70, { align: 'center', maxWidth: productBoxWidth - 10 });
        
        // Buy Now button
        this.doc!.setFillColor(255, 99, 71);
        this.doc!.rect(x + 15, y + 80, 50, 12, 'F');
        this.doc!.setTextColor(255, 255, 255);
        this.doc!.setFontSize(10);
        this.doc!.setFont('helvetica', 'bold');
        this.doc!.text('Buy Now', x + productBoxWidth/2, y + 88, { align: 'center' });
        
        col++;
        if (col >= maxCols) {
          col = 0;
          row++;
        }
      });
    });
  }

  private addGlossaryPage() {
    if (!this.doc) return;
    
    let yPosition = 50; // Account for header
    
    // Page title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Glossary', this.pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 30;
    
    // Add concern descriptions
    ConcernDescriptions.forEach(async (concern) => {
      if (yPosition > this.pageHeight - 50) {
        this.doc!.addPage();
        await this.addPageHeader('Glossary & Definitions (continued)');
        yPosition = 50;
      }
      
      // Concern heading
      this.doc!.setFontSize(12);
      this.doc!.setFont('helvetica', 'bold');
      this.doc!.setTextColor(0, 0, 0);
      this.doc!.text(`${concern.heading} -`, this.margin, yPosition);
      
      // Concern description
      this.doc!.setFontSize(10);
      this.doc!.setFont('helvetica', 'normal');
      const lines = this.doc!.splitTextToSize(concern.description, this.pageWidth - 2 * this.margin);
      this.doc!.text(lines, this.margin, yPosition + 8);
      
      yPosition += 8 + (lines.length * 5) + 8;
    });
  }
}
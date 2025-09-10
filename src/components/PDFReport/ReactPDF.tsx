import React from 'react';
import { Button, Box } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { PDFService } from '../../services/pdf-service';

interface ReactPDFReportProps {
  userPhoto?: string;
  skinScore?: number;
  outputScore?: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  recommendations?: Array<{
    name: string;
    count: number;
    products: Array<{
      name: string;
      image_url?: string;
      price?: number;
      product_url?: string;
      description?: string;
      brand?: string;
      category?: string;
      priceRange?: string;
      purchaseUrl?: string;
      howToUse?: string;
    }>;
  }>;
  userName?: string;
  sessionId?: string;
}

const ReactPDFReport: React.FC<ReactPDFReportProps> = ({
  userPhoto,
  skinScore = 54,
  outputScore = [],
  recommendations = [],
  userName = 'User',
  sessionId
}) => {
  const pdfService = new PDFService();

  const generatePDF = async () => {
    try {
      const button = document.querySelector('[data-react-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.textContent = 'Generating PDF...';
        button.disabled = true;
      }

      // Transform recommendations to match the enhanced product service format
      const enhancedRecommendations = recommendations.map(rec => ({
        issueTargeted: rec.name,
        severity: (outputScore.find(s => s.name === rec.name)?.value ?? 100) <= 60 ? 'high' : 
                 (outputScore.find(s => s.name === rec.name)?.value ?? 100) <= 80 ? 'moderate' : 'low',
        explanation: `Treatment and care for ${rec.name.replace(/_/g, ' ')}`,
        products: rec.products.map(product => ({
          id: `${rec.name}_${product.name.replace(/\s+/g, '_')}`,
          name: product.name || 'Unknown Product',
          brand: 'SmartSkin Recommended',
          category: rec.name,
          targetIssues: [rec.name],
          ingredients: ['Natural ingredients'],
          description: product.description || `Professional treatment for ${rec.name.replace(/_/g, ' ')}`,
          priceRange: product.price ? `$${product.price}` : '$25-50',
          imageUrl: product.image_url || '',
          purchaseUrl: product.product_url || 'https://smartskinafrica.com/shop',
          suitableFor: ['all skin types'],
          howToUse: 'Apply as directed on packaging',
          source: 'smartskin'
        })),
        treatmentType: 'primary' as const
      }));

      // Prepare analysis data for PDF generation
      const analysisData = {
        scores: outputScore.map(score => ({
          name: score.name,
          value: score.value,
          color: score.value <= 60 ? '#FF6961' : score.value <= 80 ? '#FFB347' : '#4CAF50'
        })),
        recommendations: enhancedRecommendations,
        userInfo: {
          name: userName,
          gender: 'unknown',
          age: 'unknown'
        },
        aiResult: {
          skinType: 'combination',
          confidence: 85,
          analysis: {
            oiliness: { score: skinScore, zones: ['Analysis complete'] },
            poreSize: { score: skinScore, description: 'Professional analysis' },
            texture: { score: skinScore, description: 'Comprehensive assessment' },
            sensitivity: { score: skinScore, description: 'Detailed evaluation' },
            hydration: { score: skinScore, description: 'In-depth analysis' }
          }
        },
        userImage: userPhoto
      };

      // Generate PDF using your existing service
      const pdfBlob = await pdfService.generateSkinAnalysisReport(analysisData);

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SmartSkin_Professional_Report_${userName}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Reset button
      if (button) {
        button.textContent = 'Download Professional PDF';
        button.disabled = false;
      }

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
      
      const button = document.querySelector('[data-react-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.textContent = 'Download Professional PDF';
        button.disabled = false;
      }
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<PictureAsPdf />}
      onClick={generatePDF}
      data-react-pdf-button
      sx={{ 
        bgcolor: '#DAA520',
        '&:hover': { bgcolor: '#B8860B' },
        color: 'white'
      }}
    >
      Download Professional PDF
    </Button>
  );
};

export default ReactPDFReport;
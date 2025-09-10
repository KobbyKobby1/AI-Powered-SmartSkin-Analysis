import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { OutputScore, Product, Recommendation } from '../../context';
import { ConcernDescriptions } from '../../skin-pages/recommendation/concerns-description';
import logoImage from '../../assets/logo.png';

// Register fonts (optional)
Font.register({
  family: 'DM Sans',
  src: 'https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriOQ4EhD.ttf'
});

const styles = StyleSheet.create({
  // Cover Page Styles
  coverPage: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    padding: 60,
    height: '100vh',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  companyName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D4A574',
    marginBottom: 100,
    fontFamily: 'DM Sans',
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },

  // Analysis Page Styles
  analysisPage: {
    padding: 30,
    fontFamily: 'DM Sans',
  },
  analysisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userPhoto: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  scoreOverlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricBox: {
    width: '23%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'space-between',
  },
  metricName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 50,
  },
  legendText: {
    fontSize: 12,
  },

  // Product Page Styles
  productPage: {
    padding: 30,
    fontFamily: 'DM Sans',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: '45%',
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#464646',
  },
  buyButton: {
    backgroundColor: '#E74C3C',
    color: 'white',
    padding: '8 20',
    borderRadius: 5,
    fontSize: 12,
  },

  // Glossary Styles
  glossaryPage: {
    padding: 30,
    fontFamily: 'DM Sans',
  },
  glossaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  glossaryItem: {
    marginBottom: 15,
  },
  glossaryTerm: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  glossaryDefinition: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333',
  },
});

interface PDFReportProps {
  userPhoto?: string;
  skinScore: number;
  outputScore: OutputScore[];
  recommendations: Recommendation[];
  userName?: string;
}

const getMetricColor = (score: number): string => {
  if (score <= 60) return '#FF6961'; // Red - Needs attention
  if (score <= 80) return '#FFB347'; // Orange - Average  
  return '#4CAF50'; // Green - Good
};

const PDFReport: React.FC<PDFReportProps> = ({
  userPhoto,
  skinScore,
  outputScore,
  recommendations,
  userName = 'User'
}) => {
  // Process metrics to match the exact format from the PDF
  const processedMetrics = outputScore.map(metric => {
    const concernDesc = ConcernDescriptions.find(cd => cd.id === metric.name);
    return {
      name: concernDesc?.heading || metric.name,
      value: metric.value,
      color: getMetricColor(metric.value)
    };
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.logo}>
          <Image src={logoImage} style={{ width: 150, height: 50 }} />
        </View>
        <Text style={styles.companyName}>Smartskin Africa</Text>
        <Text style={styles.coverTitle}>Your Skin Analysis{'\n'}Report</Text>
      </Page>

      {/* Analysis Results Page */}
      <Page size="A4" style={styles.analysisPage}>
        <Text style={styles.analysisTitle}>Your Skin Analysis Report</Text>
        
        {/* Photo and Score Section */}
        <View style={styles.photoSection}>
          {userPhoto && (
            <Image style={styles.userPhoto} src={userPhoto} />
          )}
          <Text style={styles.scoreOverlay}>Your Skin Score is {skinScore}%</Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {processedMetrics.map((metric, index) => (
            <View
              key={index}
              style={[
                styles.metricBox,
                { backgroundColor: metric.color }
              ]}
            >
              <Text style={styles.metricName}>{metric.name}</Text>
              <Text style={styles.metricValue}>{metric.value}%</Text>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF6961' }]} />
            <Text style={styles.legendText}>Needs attention (0-60)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFB347' }]} />
            <Text style={styles.legendText}>Average (61-80)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Good (81-100)</Text>
          </View>
        </View>
      </Page>

      {/* Product Recommendations Pages */}
      {recommendations.map((recommendation, recIndex) => (
        <Page key={recIndex} size="A4" style={styles.productPage}>
          <Text style={styles.productTitle}>
            Recommended products for your skin concern
          </Text>
          <View style={styles.productGrid}>
            {recommendation.products.slice(0, 4).map((product, prodIndex) => (
              <View key={prodIndex} style={styles.productCard}>
                {product.image_url && (
                  <Image style={styles.productImage} src={product.image_url} />
                )}
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.buyButton}>Buy Now</Text>
              </View>
            ))}
          </View>
        </Page>
      ))}

      {/* Glossary Page */}
      <Page size="A4" style={styles.glossaryPage}>
        <Text style={styles.glossaryTitle}>Glossary</Text>
        {ConcernDescriptions.slice(0, 8).map((item, index) => (
          <View key={index} style={styles.glossaryItem}>
            <Text style={styles.glossaryTerm}>{item.heading}</Text>
            <Text style={styles.glossaryDefinition}>{item.description}</Text>
          </View>
        ))}
      </Page>

      {/* Additional Glossary Page if needed */}
      {ConcernDescriptions.length > 8 && (
        <Page size="A4" style={styles.glossaryPage}>
          {ConcernDescriptions.slice(8).map((item, index) => (
            <View key={index} style={styles.glossaryItem}>
              <Text style={styles.glossaryTerm}>{item.heading}</Text>
              <Text style={styles.glossaryDefinition}>{item.description}</Text>
            </View>
          ))}
        </Page>
      )}
    </Document>
  );
};

// Export wrapper component with download functionality
export const PDFReportDownload: React.FC<PDFReportProps> = (props) => {
  return (
    <PDFDownloadLink
      document={<PDFReport {...props} />}
      fileName={`skin-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`}
      style={{
        textDecoration: 'none',
        padding: '10px 20px',
        backgroundColor: '#602DEE',
        color: 'white',
        borderRadius: '5px',
        display: 'inline-block',
        margin: '10px',
      }}
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating PDF...' : 'Download Report PDF'
      }
    </PDFDownloadLink>
  );
};

export default PDFReport;

// Export components for backward compatibility with existing imports
export { default as HTMLToPDFReport } from './HTMLToPDF';
export { default as ReactPDFReport } from './ReactPDF';
export { PDFReportDownload as HTMLPDFReport };
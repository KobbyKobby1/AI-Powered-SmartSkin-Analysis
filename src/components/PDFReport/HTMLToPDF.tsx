import React, { useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { OutputScore, Product, Recommendation } from '../../context';
import { ConcernDescriptions } from '../../skin-pages/recommendation/concerns-description';
import { logo } from '../../assets';

interface HTMLToPDFProps {
  userPhoto?: string;
  skinScore: number;
  outputScore: OutputScore[];
  recommendations: Recommendation[];
  userName?: string;
}

const HTMLToPDFReport: React.FC<HTMLToPDFProps> = ({
  userPhoto,
  skinScore,
  outputScore,
  recommendations,
  userName = 'User'
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const elements = reportRef.current.children;

    for (let i = 0; i < elements.length; i++) {
      if (i > 0) pdf.addPage();
      
      const element = elements[i] as HTMLElement;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    pdf.save(`skin-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getMetricColor = (score: number): string => {
    if (score <= 60) return '#FF6961'; // Red
    if (score <= 80) return '#FFB347'; // Orange
    return '#4CAF50'; // Green
  };

  const processedMetrics = outputScore.map(metric => {
    const concernDesc = ConcernDescriptions.find(cd => cd.id === metric.name);
    return {
      name: concernDesc?.heading || metric.name,
      value: metric.value,
      color: getMetricColor(metric.value)
    };
  });

  return (
    <Box>
      <Button
        onClick={generatePDF}
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: '#602DEE',
          '&:hover': { backgroundColor: '#4a1fb8' }
        }}
      >
        Download PDF Report
      </Button>

      <Box ref={reportRef} sx={{ display: 'none' }}>
        {/* Cover Page */}
        <Box
          sx={{
            width: '210mm',
            height: '297mm',
            backgroundColor: '#F5F3FF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            pageBreakAfter: 'always',
          }}
        >
          <Box
            sx={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px solid #D4A574',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Typography sx={{ fontSize: '60px', color: '#D4A574', fontWeight: 'bold' }}>
              S
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#D4A574',
              mb: 8,
              fontFamily: 'DM Sans',
            }}
          >
            Smartskin Africa
          </Typography>
          <Typography
            sx={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#000',
              textAlign: 'center',
              lineHeight: 1.2,
              fontFamily: 'DM Sans',
            }}
          >
            Your Skin Analysis<br />Report
          </Typography>
        </Box>

        {/* Analysis Page */}
        <Box
          sx={{
            width: '210mm',
            height: '297mm',
            padding: '30px',
            pageBreakAfter: 'always',
            fontFamily: 'DM Sans',
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Your Skin Analysis Report
          </Typography>

          {/* Photo and Score */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            {userPhoto && (
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img
                  src={userPhoto}
                  alt="User"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  Your Skin Score is {skinScore}%
                </Box>
              </Box>
            )}
          </Box>

          {/* Metrics Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              mb: 3,
            }}
          >
            {processedMetrics.map((metric, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: metric.color,
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: `2px solid ${metric.color === '#FF6961' ? '#C53E37' : metric.color === '#FFB347' ? '#C6872F' : '#388E3C'}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#000',
                    fontWeight: '500',
                    mb: 1,
                  }}
                >
                  {metric.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#000',
                  }}
                >
                  {metric.value}%
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Legend */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              mt: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Box
                sx={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: '#FF6961',
                  borderRadius: '50%',
                }}
              />
              <Typography sx={{ fontSize: '12px' }}>Needs attention (0-60)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Box
                sx={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: '#FFB347',
                  borderRadius: '50%',
                }}
              />
              <Typography sx={{ fontSize: '12px' }}>Average (61-80)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Box
                sx={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: '#4CAF50',
                  borderRadius: '50%',
                }}
              />
              <Typography sx={{ fontSize: '12px' }}>Good (81-100)</Typography>
            </Box>
          </Box>
        </Box>

        {/* Product Recommendations Pages */}
        {recommendations.map((recommendation, recIndex) => (
          <Box
            key={recIndex}
            sx={{
              width: '210mm',
              height: '297mm',
              padding: '30px',
              pageBreakAfter: recIndex < recommendations.length - 1 ? 'always' : 'auto',
            }}
          >
            <Typography
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 4,
              }}
            >
              Recommended products for your skin concern
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
              }}
            >
              {recommendation.products.slice(0, 4).map((product, prodIndex) => (
                <Box
                  key={prodIndex}
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '15px',
                    textAlign: 'center',
                  }}
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        marginBottom: '10px',
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#464646',
                      mb: 2,
                      fontWeight: '500',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#E74C3C',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      display: 'inline-block',
                    }}
                  >
                    Buy Now
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {/* Glossary Page */}
        <Box
          sx={{
            width: '210mm',
            height: '297mm',
            padding: '30px',
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 'bold',
              mb: 4,
            }}
          >
            Glossary
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {ConcernDescriptions.slice(0, 10).map((item, index) => (
              <Box key={index}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    mb: '5px',
                  }}
                >
                  {item.heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    lineHeight: 1.5,
                    color: '#333',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HTMLToPDFReport;
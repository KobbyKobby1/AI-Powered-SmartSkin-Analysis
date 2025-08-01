'use client';

import { Box, Typography, Grid2, Card } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { beautyGpt } from '../../assets';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setContentVisible(true), 200);
          setTimeout(() => setImageVisible(true), 400);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ py: { xs: 8, md: 16 } }}>
      <Box ref={sectionRef} sx={{ my: { xs: 6, md: 10 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
              margin: '0 auto 40px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transformOrigin: 'center',
            }}
          />
          
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontSize: { xs: '32px', md: '42px' },
              fontWeight: 700,
              lineHeight: { xs: '40px', md: '50px' },
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.1s',
            }}
          >
            About{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Smartskin Africa
            </Box>
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(145deg, rgba(229, 188, 118, 0.08) 0%, rgba(229, 188, 118, 0.3) 50%, rgba(229, 188, 118, 0.6) 100%)',
            border: '1px solid rgba(229, 188, 118, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
              zIndex: 1,
            },
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
          }}
        >
          <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? 'translateX(0)' : 'translateX(-40px)',
                  transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: '0.2s',
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{
                    fontSize: { xs: '24px', md: '28px' },
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: { xs: 3, md: 4 },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Transforming African Beauty Through AI Innovation
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    lineHeight: 1.7,
                    color: '#555',
                    textAlign: { xs: 'center', md: 'left' },
                    mb: 3,
                  }}
                >
                  <strong>Smartskin Africa</strong> is an AI-powered skincare analysis platform that offers a personalized
                  approach to skincare specifically designed for African skin tones and beauty needs.
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    lineHeight: 1.7,
                    color: '#555',
                    textAlign: { xs: 'center', md: 'left' },
                    mb: 4,
                  }}
                >
                  Through a quick selfie and face scan, our technology extracts crucial data on
                  skin parameters, including texture, tone, and hydration levels. Our advanced algorithms then generate
                  a comprehensive skin analysis report that provides valuable insights into the user's skin condition
                  and provides personalized skincare recommendations, tracking skin health, and connecting users to
                  products and professionals.
                </Typography>

                {/* Key Features */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    'AI-powered skin analysis in 3 seconds',
                    '16+ skin parameters analyzed',
                    'Personalized product recommendations',
                    'Progress tracking over time'
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        opacity: contentVisible ? 1 : 0,
                        transform: contentVisible ? 'translateX(0)' : 'translateX(-20px)',
                        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transitionDelay: `${0.4 + index * 0.1}s`,
                      }}
                    >
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#00796B',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: '14px', md: '16px' },
                          color: '#666',
                          fontWeight: 500,
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: imageVisible ? 1 : 0,
                  transform: imageVisible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
                  transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: '0.6s',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    transform: 'perspective(1000px) rotateY(5deg)',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) scale(1.05)',
                    },
                  }}
                >
                  <Image 
                    src={beautyGpt} 
                    height={400} 
                    alt="Smartskin Africa AI Technology" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      borderRadius: '20px',
                    }}
                  />
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Card>

        {/* Mission Statement */}
        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            textAlign: 'center',
            maxWidth: '800px',
            margin: { xs: '60px auto 0', md: '80px auto 0' },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.8s',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '20px', md: '24px' },
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 3,
              lineHeight: 1.4,
            }}
          >
            Our mission is to democratize access to professional-grade skincare analysis across Africa
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '18px' },
              color: '#666',
              lineHeight: 1.6,
            }}
          >
            We believe everyone deserves personalized skincare solutions that understand and celebrate the beauty of African skin.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;
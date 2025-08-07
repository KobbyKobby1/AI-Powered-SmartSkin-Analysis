// src/components/PreciseSkin/index.tsx
'use client';

import Typography from '@mui/material/Typography';
import { Box, Container } from '@mui/material';
import { skinResult } from '../../assets';
import { useEffect, useRef, useState } from 'react';

const PrecisionAssessment = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setHeaderVisible(true), 200);
          setTimeout(() => setStatsVisible(true), 400);
          setTimeout(() => setImageVisible(true), 600);
          setTimeout(() => setFeaturesVisible(true), 800);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '99.2%', label: 'Accuracy Rate' },
    { value: '16+', label: 'Skin Parameters' },
    { value: '3 sec', label: 'Analysis Time' },
  ];

  const features = ['Clinical Grade', 'AI Powered', 'Instant Results', 'Progress Tracking'];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Box sx={{ textAlign: 'center' }} ref={sectionRef}>
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
          variant="h4" 
          component="h2"
          sx={{
            fontSize: { xs: '28px', md: '36px', lg: '42px' },
            fontWeight: 700,
            lineHeight: { xs: '36px', md: '44px', lg: '50px' },
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            mb: { xs: 2, md: 3 },
            maxWidth: '800px',
            margin: '0 auto',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.1s',
          }}
        >
          Revolutionizing Skin Health: The Ultimate{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Precision Assessment
          </Box>{' '}
          Model
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '16px', md: '18px' },
            color: '#666',
            mb: { xs: 4, md: 6 },
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: { xs: '24px', md: '28px' },
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.2s',
          }}
        >
          Our advanced AI model delivers clinical-grade accuracy in skin analysis, 
          providing detailed insights across 16+ skin parameters with precision that rivals professional dermatological assessments.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 3, md: 6 },
            mb: { xs: 4, md: 6 },
            flexWrap: 'wrap',
          }}
        >
          {stats.map((stat, index) => (
            <Box 
              key={index} 
              sx={{ 
                textAlign: 'center',
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: `${0.1 * index}s`,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '28px', md: '36px' },
                  fontWeight: 700,
                  color: '#00796B',
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '12px', md: '14px' },
                  color: '#666',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            padding: { xs: '20px', md: '40px' },
            boxShadow: '0 40px 120px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.4s ease',
            position: 'relative',
            opacity: imageVisible ? 1 : 0,
            transform: imageVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            transitionDelay: '0.3s',
            '&:hover': {
              transform: imageVisible ? 'translateY(-10px) scale(1.02)' : 'translateY(30px) scale(0.95)',
              boxShadow: '0 50px 140px rgba(0, 0, 0, 0.2)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(135deg, #E5BC76, #00796B, #C6A461)',
              borderRadius: '24px',
              zIndex: -1,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: imageVisible ? 0.3 : 0,
            },
          }}
        >
          <img 
            src={skinResult.src} 
            alt="Precision skin assessment model results showing detailed analysis" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            mt: { xs: 4, md: 6 },
            flexWrap: 'wrap',
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: '10px 20px',
                backgroundColor: 'rgba(0, 121, 107, 0.1)',
                borderRadius: '25px',
                border: '1px solid rgba(0, 121, 107, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                opacity: featuresVisible ? 1 : 0,
                transform: featuresVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transitionDelay: `${0.1 * index}s`,
                '&:hover': {
                  backgroundColor: 'rgba(0, 121, 107, 0.15)',
                  transform: featuresVisible ? 'translateY(-3px) scale(1.05)' : 'translateY(20px) scale(0.9)',
                  boxShadow: '0 8px 25px rgba(0, 121, 107, 0.2)',
                },
              }}
            >
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#00796B',
                }}
              />
              <Typography 
                sx={{ 
                  fontSize: { xs: '12px', md: '14px' }, 
                  color: '#00796B', 
                  fontWeight: 600 
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default PrecisionAssessment;
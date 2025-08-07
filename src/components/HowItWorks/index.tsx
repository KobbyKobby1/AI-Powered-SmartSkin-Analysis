// src/components/HowItWorks/index.tsx
'use client';

import Typography from '@mui/material/Typography';
import { Box, Container } from '@mui/material';
import { howItWorks } from '../../assets';
import { useEffect, useRef, useState } from 'react';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setContentVisible(true), 200);
          setTimeout(() => setImageVisible(true), 400);
          setTimeout(() => setStepsVisible(true), 800);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = ['Upload Photo', 'AI Analysis', 'Get Results', 'Track Progress'];

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
            fontSize: { xs: '32px', md: '42px' },
            fontWeight: 700,
            lineHeight: { xs: '40px', md: '50px' },
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            mb: { xs: 2, md: 3 },
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.1s',
          }}
        >
          How It Works
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '16px', md: '18px' },
            color: '#666',
            mb: { xs: 4, md: 6 },
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: { xs: '24px', md: '28px' },
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.2s',
          }}
        >
          Our AI-powered skin analysis process is simple, fast, and incredibly accurate. 
          Follow these easy steps to unlock your personalized skincare journey.
        </Typography>

        <Box
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 30px 100px rgba(0, 0, 0, 0.12)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            padding: { xs: '20px', md: '40px' },
            transition: 'all 0.4s ease',
            opacity: imageVisible ? 1 : 0,
            transform: imageVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            transitionDelay: '0.3s',
            '&:hover': {
              transform: imageVisible ? 'translateY(-8px) scale(1.02)' : 'translateY(30px) scale(0.95)',
              boxShadow: '0 40px 120px rgba(0, 0, 0, 0.18)',
            },
          }}
        >
          <img 
            src={howItWorks.src} 
            alt="How SmartSkin Africa works - step by step process" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: '12px',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
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
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: '8px 16px',
                backgroundColor: 'rgba(229, 188, 118, 0.1)',
                borderRadius: '25px',
                border: '1px solid rgba(229, 188, 118, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                opacity: stepsVisible ? 1 : 0,
                transform: stepsVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transitionDelay: `${0.1 * index}s`,
                '&:hover': {
                  backgroundColor: 'rgba(229, 188, 118, 0.2)',
                  transform: stepsVisible ? 'translateY(-2px) scale(1.05)' : 'translateY(20px) scale(0.9)',
                  boxShadow: '0 4px 15px rgba(229, 188, 118, 0.3)',
                },
              }}
            >
              <Box
                sx={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#00796B',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                {index + 1}
              </Box>
              <Typography 
                sx={{ 
                  fontSize: { xs: '12px', md: '14px' }, 
                  color: '#333', 
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                }}
              >
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default HowItWorks;
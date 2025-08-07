// src/components/TryNow/index.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import { heroImg } from '../../assets';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const FullscreenDialog = dynamic(() => import('./FullscreenDialog'), { 
  ssr: false,
  loading: () => null
});

const SkinModal = () => {
  const [open, setOpen] = useState(false);
  const [, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setContentVisible(true), 300);
          setTimeout(() => setImageVisible(true), 600);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Trigger animations immediately on component mount for hero section
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setContentVisible(true), 200);
      setTimeout(() => setImageVisible(true), 400);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Box
        ref={sectionRef}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          minHeight: { xs: '80vh', md: '90vh' },
          paddingTop: { xs: 8, md: 12 },
          paddingBottom: { xs: 8, md: 12 },
          gap: { xs: '40px', md: '60px' },
        }}
        maxWidth="lg"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'flex-start' },
            flexBasis: { xs: '100%', md: '60%' },
            gap: { xs: '30px', md: '40px' },
            padding: { xs: '20px', md: '20px 0px', lg: '20px 50px' },
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.2s',
          }}
        >
          <Typography
            sx={{
              color: '#1a1a1a',
              fontSize: { xs: '28px', md: '48px', lg: '56px' },
              fontWeight: 600,
              lineHeight: { xs: '36px', md: '56px', lg: '64px' },
              textAlign: { xs: 'center', md: 'left' },
              letterSpacing: '-0.02em',
              fontFamily: '"DM Sans", sans-serif',
              maxWidth: { xs: '100%', md: '600px' },
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.3s',
            }}
          >
            Uncover your skin's story and{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              simplify skincare
            </Box>{' '}
            with our advanced analyzer
          </Typography>

          <Typography
            sx={{
              color: '#666',
              fontSize: { xs: '16px', md: '20px' },
              fontWeight: 400,
              lineHeight: { xs: '24px', md: '30px' },
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', md: '500px' },
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.5s',
            }}
          >
            Get personalized skin insights with AI-powered analysis. Understand your unique skin concerns and discover the perfect skincare routine for you.
          </Typography>

          <Box
            sx={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.7s',
            }}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #00796B 0%, #004D40 100%)',
                fontSize: { xs: '16px', md: '18px' },
                fontWeight: 600,
                color: '#FFF',
                padding: { xs: '14px 32px', md: '16px 40px' },
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(0, 121, 107, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004D40 0%, #00251A 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 121, 107, 0.4)',
                },
              }}
              onClick={() => setOpen(true)}
            >
              Get Started Free
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flexBasis: { xs: '100%', md: '40%' },
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: imageVisible ? 1 : 0,
            transform: imageVisible ? 'translateX(0) scale(1) rotateY(0deg)' : 'translateX(50px) scale(0.9) rotateY(10deg)',
            transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.4s',
            '&:hover': {
              transform: imageVisible ? 'translateX(0) scale(1.02) rotateY(-2deg)' : 'translateX(50px) scale(0.9) rotateY(10deg)',
            },
          }}
        >
          <Image
            src={heroImg}
            alt="AI Skin Analysis"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.1))',
              transition: 'filter 0.3s ease',
            }}
            priority
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 30px 80px rgba(0, 0, 0, 0.15))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.1))';
            }}
          />
        </Box>
      </Box>
      {open && <FullscreenDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
};

export default SkinModal;
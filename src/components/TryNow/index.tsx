'use client';

import { useState } from 'react';
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

  return (
    <>
      <Box
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
            }}
          >
            Get personalized skin insights with AI-powered analysis. Understand your unique skin concerns and discover the perfect skincare routine for you.
          </Typography>

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

        <Box
          sx={{
            flexBasis: { xs: '100%', md: '40%' },
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
            }}
            priority
          />
        </Box>
      </Box>
      {open && <FullscreenDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
};

export default SkinModal;
'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import { heroImg } from '../../assets';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const FullscreenDialog = dynamic(() => import('./FullscreenDialog'), { ssr: false });

const SkinModal = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'center' },
          width: '100%',
          height: { xs: '100%' },
          position: 'relative',
          margin: 'auto',
          paddingTop: 10,
          paddingBottom: 10,
          gap: { xs: '20px', md: '0' },
        }}
        maxWidth="lg"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexBasis: { xs: '100%', md: '100%' },
            gap: { xs: '20px', md: '40px', lg: '60px' },
            padding: { xs: '30px', md: '20px 0px', lg: '20px 50px' },
          }}
        >
          <Typography
            sx={{
              color: '#000',
              fontSize: { xs: '18px', md: '32px', lg: '42px' },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: { xs: '28px', md: '52px' },
              textAlign: 'center',
              padding: { xs: '0 10px', md: '0' },
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Uncover your skin’s story and simplify skincare with our advanced analyzer.
          </Typography>

          <Box>
            <Button
              variant="contained"
              sx={{
                flexShrink: 0,
                borderRadius: '50px !important',
                background: '#00796B',
                fontSize: { xs: '16px', md: '24px' },
                color: '#FFF',
                padding: { xs: '10px 20px', md: '12px 24px' },
                '&:hover': {
                  background: '#333',
                },
              }}
              onClick={handleClickOpen}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flexBasis: { xs: '100%', md: '40%' },
            width: '100%',
            height: 'auto',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image
            src={heroImg}
            alt="hero image"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
      <FullscreenDialog open={open} onClose={handleClose} />
    </>
  );
};

export default SkinModal;

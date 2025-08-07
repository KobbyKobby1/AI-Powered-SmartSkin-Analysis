// src/components/Provide/index.tsx
'use client';

import { Container, Grid2, Typography, Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { model0, model1, model2, model3, model4, model5, model6, model7 } from '../../assets';
import { useEffect, useRef, useState } from 'react';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}

const itemData = [
  { img: model0.src, title: 'African Beauty 1', rows: 2, cols: 2 },
  { img: model1.src, title: 'African Beauty 2' },
  { img: model2.src, title: 'African Beauty 3' },
  { img: model3.src, title: 'African Beauty 4', cols: 2 },
  { img: model4.src, title: 'African Beauty 5', cols: 2 },
  { img: model5.src, title: 'African Beauty 6', rows: 2, cols: 2 },
  { img: model6.src, title: 'African Beauty 7' },
  { img: model7.src, title: 'African Beauty 8' },
];

const Provide = () => {
  const [, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [imageGridVisible, setImageGridVisible] = useState(false);
  const [tagsVisible, setTagsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setHeaderVisible(true), 100);
          setTimeout(() => setContentVisible(true), 300);
          setTimeout(() => setImageGridVisible(true), 500);
          setTimeout(() => setTagsVisible(true), 700);
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
    <Container 
      maxWidth={false} 
      sx={{ 
        backgroundColor: '#fafbfc', 
        padding: { xs: '60px 0', md: '120px 0' },
      }}
    >
      <Container maxWidth="lg" ref={sectionRef}>
        <Grid2 container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '32px', md: '48px' },
                  fontWeight: 700,
                  lineHeight: { xs: '40px', md: '56px' },
                  color: '#1a1a1a',
                  letterSpacing: '-0.02em',
                  mb: { xs: 3, md: 4 },
                  opacity: headerVisible ? 1 : 0,
                  transform: headerVisible ? 'translateX(0)' : 'translateX(-50px)',
                  transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: '0.1s',
                }}
                variant="h2"
                component="h2"
              >
                Personalized Skincare for{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Beauty Lovers
                </Box>{' '}
                in Africa
              </Typography>

              <Typography 
                variant="body1" 
                sx={{
                  fontSize: { xs: '16px', md: '18px' },
                  lineHeight: { xs: '26px', md: '30px' },
                  color: '#666',
                  fontWeight: 400,
                  mb: 4,
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? 'translateX(0)' : 'translateX(-30px)',
                  transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: '0.2s',
                }}
              >
                The Smartskin Africa platform revolutionizes your beauty routine with AI-powered skin analysis. 
                Simply snap a selfie in 3 seconds and get comprehensive insights into your skin health, 
                including wrinkles, spots, texture, and hydration levels. Track your progress over time and 
                receive personalized recommendations tailored to African skin tones.
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap',
                }}
              >
                {['3-Second Analysis', '16 Skin Parameters'].map((tag, index) => (
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
                      opacity: tagsVisible ? 1 : 0,
                      transform: tagsVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                      transitionDelay: `${0.1 * index}s`,
                      '&:hover': {
                        backgroundColor: 'rgba(229, 188, 118, 0.2)',
                        transform: tagsVisible ? 'translateY(-2px) scale(1.05)' : 'translateY(20px) scale(0.9)',
                        boxShadow: '0 4px 15px rgba(229, 188, 118, 0.3)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#00796B',
                      }}
                    />
                    <Typography sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                opacity: imageGridVisible ? 1 : 0,
                transform: imageGridVisible ? 'translateX(0) scale(1)' : 'translateX(50px) scale(0.95)',
                transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.3s',
              }}
            >
              <ImageList 
                sx={{ 
                  width: '100%', 
                  height: { xs: 400, md: 500 },
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15)',
                  },
                }} 
                variant="quilted" 
                cols={4} 
                rowHeight={121}
              >
                {itemData.map((item, index) => (
                  <ImageListItem 
                    key={item.img} 
                    cols={item.cols || 1} 
                    rows={item.rows || 1}
                    sx={{
                      opacity: imageGridVisible ? 1 : 0,
                      transform: imageGridVisible ? 'scale(1)' : 'scale(0.8)',
                      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transitionDelay: `${0.05 * index}s`,
                      '& img': {
                        transition: 'transform 0.3s ease, filter 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          filter: 'brightness(1.1)',
                        },
                      },
                    }}
                  >
                    <img 
                      {...srcset(item.img, 121, item.rows, item.cols)} 
                      alt={item.title} 
                      loading="lazy"
                      style={{ borderRadius: '8px' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Container>
  );
};

export default Provide;
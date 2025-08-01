'use client';

import { Container, Grid2, Typography, Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { model0, model1, model2, model3, model4, model5, model6, model7 } from '../../assets';

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
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        backgroundColor: '#fafbfc', 
        padding: { xs: '60px 0', md: '120px 0' },
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Typography
              sx={{
                fontSize: { xs: '32px', md: '48px' },
                fontWeight: 700,
                lineHeight: { xs: '40px', md: '56px' },
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                mb: { xs: 3, md: 4 },
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
              }}
            >
              The Smartskin Africa platform revolutionizes your beauty routine with AI-powered skin analysis. 
              Simply snap a selfie in 3 seconds and get comprehensive insights into your skin health, 
              including wrinkles, spots, texture, and hydration levels. Track your progress over time and 
              receive personalized recommendations tailored to African skin tones.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                backgroundColor: 'rgba(229, 188, 118, 0.1)',
                borderRadius: '25px',
                border: '1px solid rgba(229, 188, 118, 0.3)',
              }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#00796B',
                  }}
                />
                <Typography sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                  3-Second Analysis
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                backgroundColor: 'rgba(229, 188, 118, 0.1)',
                borderRadius: '25px',
                border: '1px solid rgba(229, 188, 118, 0.3)',
              }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#00796B',
                  }}
                />
                <Typography sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                  16 Skin Parameters
                </Typography>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, lg: 6 }}>
            <ImageList 
              sx={{ 
                width: '100%', 
                height: { xs: 400, md: 500 },
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15)',
                },
              }} 
              variant="quilted" 
              cols={4} 
              rowHeight={121}
            >
              {itemData.map((item) => (
                <ImageListItem 
                  key={item.img} 
                  cols={item.cols || 1} 
                  rows={item.rows || 1}
                  sx={{
                    '& img': {
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
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
          </Grid2>
        </Grid2>
      </Container>
    </Container>
  );
};

export default Provide;
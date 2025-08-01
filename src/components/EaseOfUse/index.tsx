'use client';

import { Container, Grid2, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { recommend } from '../../assets';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const features = [
  {
    title: 'Effortless Skin Analysis',
    description: 'Get personalized skin insights with a simple in-app scan. No more guessing – understand your unique skin concerns with ease.',
  },
  {
    title: 'Tailored Skincare Recommendations',
    description: 'Discover a curated skincare routine just for you. Our app analyzes your skin and recommends products perfectly suited to your needs.',
  },
  {
    title: 'Track Progress & See Results',
    description: "Monitor your skin's journey with our progress tracking tools. See how your skin improves over time and adjust your routine accordingly.",
  },
  {
    title: 'Convenient & Accessible',
    description: 'Enjoy expert-level skincare anytime, anywhere. Our app puts personalized solutions at your fingertips, whenever you need them.',
  },
];

const EaseOfUse = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Grid2 container spacing={{ xs: 4, md: 8 }} alignItems="center">
        {/* Image Section */}
        <Grid2 size={{ xs: 12, lg: 6 }} order={{ xs: 2, lg: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.4s ease',
                transform: 'perspective(1000px) rotateY(-2deg)',
                '&:hover': {
                  transform: 'perspective(1000px) rotateY(0deg) translateY(-8px)',
                  boxShadow: '0 35px 100px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Image
                src={recommend.src}
                alt="Skin analysis recommendations"
                width={recommend.width / 1.3}
                height={recommend.height / 1.3}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '24px',
                }}
                priority
              />
            </Box>
          </Box>
        </Grid2>

        {/* Content Section */}
        <Grid2 size={{ xs: 12, lg: 6 }} order={{ xs: 1, lg: 2 }}>
          <Box sx={{ maxWidth: { xs: '100%', lg: '500px' }, ml: { lg: 4 } }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: '32px', md: '42px' },
                fontWeight: 700,
                lineHeight: { xs: '40px', md: '50px' },
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                mb: { xs: 3, md: 4 },
              }}
            >
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ease of Use
              </Box>{' '}
              Meets Professional Results
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    padding: '16px',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 188, 118, 0.08)',
                      transform: 'translateX(8px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{
                      color: '#00796B',
                      fontSize: '24px',
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '16px', md: '18px' },
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 1,
                        lineHeight: '24px',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '14px', md: '16px' },
                        color: '#666',
                        lineHeight: { xs: '22px', md: '26px' },
                        fontWeight: 400,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default EaseOfUse;
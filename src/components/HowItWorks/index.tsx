'use client';

import Typography from '@mui/material/Typography';
import { Box, Container } from '@mui/material';
import { howItWorks } from '../../assets';

const HowItWorks = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
            margin: '0 auto 40px',
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
            '&:hover': {
              transform: 'translateY(-8px)',
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
          {['Upload Photo', 'AI Analysis', 'Get Results', 'Track Progress'].map((step, index) => (
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
                '&:hover': {
                  backgroundColor: 'rgba(229, 188, 118, 0.2)',
                  transform: 'translateY(-2px)',
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
                }}
              >
                {index + 1}
              </Box>
              <Typography 
                sx={{ 
                  fontSize: { xs: '12px', md: '14px' }, 
                  color: '#333', 
                  fontWeight: 500 
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
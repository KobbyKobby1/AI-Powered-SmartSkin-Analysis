import EaseOfUse from '../../components/EaseOfUse';
import Provide from '../../components/Provide';
import Faq from '../../components/FAQ';
import Card from '@mui/material/Card';
import PrecisionAssessment from '../../components/PreciseSkin';
import TryNow from '../../components/TryNow';
import HowItWorks from '../../components/HowItWorks';
import { Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useView } from '../../context';

const HomePage = () => {
  const [showTestButton, setShowTestButton] = useState(false);
  const { setView } = useView();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press Ctrl+Shift+T to show test button
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        setShowTestButton(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <Box
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Hero Section */}
      <Card
        sx={{
          borderRadius: 0,
          boxShadow: 'none',
          background: 'linear-gradient(135deg, rgba(229, 188, 118, 0.08) 0%, rgba(229, 188, 118, 0.3) 50%, rgba(229, 188, 118, 0.6) 100%)',
          position: 'relative',
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
        <TryNow />
      </Card>

      {/* Content Sections - Only one Provide component */}
      <Provide />
      <EaseOfUse />
      <HowItWorks />
      <PrecisionAssessment />
      <Faq />

      {/* Developer Test Button (hidden by default) */}
      {showTestButton && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          <Button
            onClick={() => setView('TestSystem')}
            sx={{
              background: 'linear-gradient(45deg, #602DEE, #8B5CF6)',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(96, 45, 238, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5A27D6, #7C4DFF)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(96, 45, 238, 0.4)'
              }
            }}
          >
            🧪 Test Enhanced System
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
import EaseOfUse from '../../components/EaseOfUse';
import Provide from '../../components/Provide';
import Faq from '../../components/FAQ';
import Card from '@mui/material/Card';
import PrecisionAssessment from '../../components/PreciseSkin';
import TryNow from '../../components/TryNow';
import HowItWorks from '../../components/HowItWorks';
import { Box } from '@mui/material';
const HomePage = () => {
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
    </Box>
  );
};

export default HomePage;
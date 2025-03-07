import EaseOfUse from '../components/EaseOfUse';
import Provide from '../components/Provide';
import Faq from '../components/FAQ';
import Card from '@mui/material/Card';
import PrecisionAssessment from '../components/PreciseSkin';
import TryNow from '../components/TryNow';
import HowItWorks from '../components/HowItWorks';

const HomePage = () => {
  return (
    <>
      <Card
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          borderRadius: 0,
          // minHeight: 800,
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(129deg,rgba(229, 188, 118, 0.4) 0,rgba(229, 188, 118, 1) 100%)',
        }}
      >
        <TryNow />
      </Card>
      <Provide />
      <EaseOfUse />
      <HowItWorks />
      <PrecisionAssessment />
      <Faq />
    </>
  );
};

export default HomePage;

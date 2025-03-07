import Typography from '@mui/material/Typography';
import { Box, Container, Divider } from '@mui/material';
import { howItWorks } from '../../assets';

const HowItWorks = () => {
  return (
    <Container maxWidth="lg">
      <Divider />
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ pb: 4 }}>
          How It Works
        </Typography>
        <img src={howItWorks.src} alt="how it works" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    </Container>
  );
};

export default HowItWorks;

import Typography from '@mui/material/Typography';
import { Box, Container, Divider } from '@mui/material';
import { skinResult } from '../../assets';

const PrecisionAssessment = () => {
  return (
    <Container maxWidth="lg">
      <Divider />
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ pb: 4 }}>
          Revolutionizing Skin Health: The Ultimate Precision Assessment Model
        </Typography>
        <img src={skinResult.src} alt="assessment" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    </Container>
  );
};

export default PrecisionAssessment;

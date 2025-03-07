import { Box, Typography, Grid2, Card } from '@mui/material';
import Image from 'next/image';
import { beautyGpt } from '../../assets';

const AboutUs = () => {
  return (
    <>
      <Box sx={{ py: 1 }}>
        <Box sx={{ my: 10 }}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(129deg,rgba(229, 188, 118, 0.4) 0,rgba(229, 188, 118, 1) 100%)',
            }}
          >
            <Grid2 container spacing={4} sx={{ my: 5 }}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="h3" gutterBottom sx={{ textAlign: "center" }}>
                  About Us
                </Typography>
                <Typography variant="body1" align="center" component={'p'}>
                  <b>Smartskin Africa</b> is an AI-powered skincare analysis platform that offers a personalized
                  approach to skincare. Through a quick selfie and face scan, our technology extracts crucial data on
                  skin parameters, including texture, tone, and hydration levels. Our advanced algorithms then generate
                  a comprehensive skin analysis report that provides valuable insights into the user's skin condition
                  and provides personalized skincare recommendations, tracking skin health, and connecting users to
                  products and professionals.
                </Typography>
              </Grid2>
              <Grid2
                size={{ xs: 12, md: 6 }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Image src={beautyGpt} height={400} alt="About Us Image 2" />
              </Grid2>
            </Grid2>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default AboutUs;

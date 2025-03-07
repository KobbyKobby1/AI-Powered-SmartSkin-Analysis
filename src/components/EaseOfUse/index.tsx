import { Container, Grid2, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Image from 'next/image';
import { recommend } from '../../assets';

const uses = [
  {
    title: 'Effortless Skin Analysis',
    description:
      'Get personalized skin insights with a simple in-app scan. No more guessing – understand your unique skin concerns with ease.',
  },
  {
    title: 'Tailored Skincare Recommendations',
    description:
      'Discover a curated skincare routine just for you. Our app analyzes your skin and recommends products perfectly suited to your needs.',
  },
  {
    title: 'Track Progress & See Results',
    description:
      "Monitor your skin's journey with our progress tracking tools. See how your skin improves over time and adjust your routine accordingly.",
  },
  {
    title: 'Convenient & Accessible',
    description:
      'Enjoy expert-level skincare anytime, anywhere. Our app puts personalized solutions at your fingertips, whenever you need them.',
  },
];

const EaseOfUse = () => {
  return (
    <Container maxWidth="lg">
      <Grid2 container spacing={4} sx={{ mb: 8, paddingTop: { xs: '40px', lg: '20px' } }}>
        {/* Image Section */}
        <Grid2
          size={{ xs: 12, lg: 6 }}
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            my: { xs: 4, lg: 0 },
          }}
        >
          <Image
            src={recommend.src}
            alt="recommendation"
            width={recommend.width / 1.5}
            height={recommend.height / 1.5}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 10,
            }}
          />
        </Grid2>

        {/* Text Section */}
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Typography
            sx={{
              mt: { xs: 2, lg: 4 },
              mb: 2,
              textAlign: { xs: 'center', lg: 'left' },
            }}
            variant="h3"
            component="h3"
          >
            Ease Of Use
          </Typography>
          <List dense>
            {uses.map((use, index) => (
              <ListItem key={index} sx={{ justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <VisibilityIcon sx={{ color: '#E5BC76' }} />
                </ListItemIcon>
                <ListItemText>
                  <b>{use.title}</b>: {use.description}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid2>
      </Grid2>
    </Container>
  );
};
export default EaseOfUse;

import { Container, Grid2, Card, CardContent, Typography } from '@mui/material';
import featuresData from '../../data/features.json';

interface Feature {
  title: string;
  description: string;
}

interface FeaturesPageProps {
  features: Feature[];
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ features }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Features of Smartskin Platform
      </Typography>
      <Grid2 container spacing={4}>
        {features.map((feature, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

const FeaturesPageWrapper = () => {
  const features = featuresData.en;

  return <FeaturesPage features={features} />;
};

export default FeaturesPageWrapper;

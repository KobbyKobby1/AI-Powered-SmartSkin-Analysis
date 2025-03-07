import { Container, Grid2, Typography } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { model0, model1, model2, model3, model4, model5, model6, model7 } from '../../assets';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}

const itemData = [
  {
    img: model0.src,
    title: 'Breakfast',
    rows: 2,
    cols: 2,
  },
  {
    img: model1.src,
    title: 'Burger',
  },
  {
    img: model2.src,
    title: 'Camera',
  },
  {
    img: model3.src,
    title: 'Coffee',
    cols: 2,
  },
  {
    img: model4.src,
    title: 'Hats',
    cols: 2,
  },
  {
    img: model5.src,
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
  },
  {
    img: model6.src,
    title: 'Basketball',
  },
  {
    img: model7.src,
    title: 'Fern',
  },
];

const Provide = () => {
  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#FAFBFC', padding: { xs: 0, md: 5 } }}>
      <Container maxWidth="lg">
        <div id="services">
          <div className="mx-auto max-w-7xl px-4 my-10 sm:py-20 lg:px-8">
            <Grid2 container spacing={8}>
              <Grid2 size={{ xs: 12, lg: 6 }}>
                <Typography
                  sx={{
                    mt: { xs: 2, lg: 4 },
                    mb: 2,
                    textAlign: 'center',
                  }}
                  variant="h4"
                  component="h4"
                >
                  Personalized Skincare for Beauty Lovers in Africa
                </Typography>
                <Typography variant="body1" component={'p'} align="center">
                  The Smartskin Africa platform is a skin diagnostic and tracking tool that revolutionizes the modern
                  beauty routine, bringing personalized skin assessment to the palm of your hand. The AI skin diagnostic
                  tool allows beauty lovers to experience real-time skin analysis. Simply snap a selfie in 3 seconds and
                  the AI will give you a general score based on 16 signs of your skin health including wrinkles, spots,
                  skin texture, and dark circles, etc. Each user’s detailed skin health report includes their skin age
                  and relative skin scores which can be saved to your WhatsApp or email so you can track how your skin
                  changes over time.
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, lg: 6 }}>
                <Grid2 container spacing={3} justifyContent="center">
                  <ImageList sx={{ width: 500, height: '100%' }} variant="quilted" cols={4} rowHeight={121}>
                    {itemData.map((item) => (
                      <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                        <img {...srcset(item.img, 121, item.rows, item.cols)} alt={item.title} loading="lazy" />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid2>
              </Grid2>
            </Grid2>
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default Provide;

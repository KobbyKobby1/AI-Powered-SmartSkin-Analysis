import { Box, Button, Typography } from '@mui/material';
import { useView } from '../../context';
import { Api } from '../../api';
// import { logo } from '../../assets';
import { model } from '../../assets';

const HomePage = () => {
  const { setView, setSessionId, setSnackbar } = useView();

  const handleTryNowClick = async () => {
    new Api()
      .getSessionId()
      .then((sessionId) => {
        setSessionId(sessionId);
        setView('Gender');
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          snackbarOpen: true,
          snackbarMessage: 'Oops! Something went wrong. Please try again later.',
          snackbarSeverity: 'error',
        });
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'space-between', md: 'space-between' },
        alignItems: { xs: 'center', md: 'center' },
        width: '100%',
        height: { xs: '100%' },
        position: 'relative',
        // padding: { xs: '0 20px', md: '0' },
        gap: { xs: '20px', md: '0' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexBasis: { xs: '100%', md: '60%' },
          gap: { xs: '20px', md: '60px' },
          // padding: { xs: '10px', md: '100px' },
        }}
      >
        {/* <Box>
          <img
            src={logo.src}
            alt="logo"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Box> */}

        <Typography
          sx={{
            color: '#000',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: { xs: '18px', md: '42px' },
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: { xs: '28px', md: '52px' },
            textAlign: 'center',
            padding: { xs: '0 10px', md: '0' },
          }}
        >
          Uncover your skin’s story and simplify skincare with our advanced analyzer.
        </Typography>

        <Box>
          <Button
            variant="contained"
            sx={{
              flexShrink: 0,
              borderRadius: '50px !important',
              background: '#602DEE',
              fontSize: { xs: '16px', md: '24px' },
              color: '#FFF',
              padding: { xs: '10px 20px', md: '12px 24px' },
              '&:hover': {
                background: '#333',
              },
            }}
            onClick={handleTryNowClick}
          >
            Try Now
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flexBasis: { xs: '100%', md: '40%' },
          width: '100%',
          height: 'auto',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <img
          src={model.src}
          alt="model"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
};

export default HomePage;

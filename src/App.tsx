import { Box, Typography } from '@mui/material';
import './styles';
import HomePage from './skin-pages/homePage';
import Questionnaire from './skin-pages/questionnaire';
import PicCapture from './skin-pages/pic-capture';
import Recommendation from './skin-pages/recommendation';
import Details from './skin-pages/details';
import { useView } from './context';
import { useEffect, useState } from 'react';
import { useSnackbar } from './components/Snackbar/useSnackbar';
import CustomSnackbar from './components/Snackbar/CustomSnackbar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import CloseIcon from '@mui/icons-material/Close';
import styles from './styles';
import { Api } from './api';

declare global {
  interface Window {
    OrboSmartCapture: any;
  }
}

const App = () => {
  const { view, setView, snackbar, setSessionId, setSnackbar } = useView();

  const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar();

  useEffect(() => {
    if (snackbar) {
      showSnackbar(snackbar.snackbarMessage, snackbar.snackbarSeverity);
    }
  }, [snackbar]);

  useEffect(() => {
    const openButton = document.getElementById('close-react-app');

    const handleOpenClick = () => {
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
      // setView('HomePage');
    };

    if (openButton) {
      openButton.addEventListener('click', handleOpenClick);
    }

    return () => {
      if (openButton) {
        openButton.removeEventListener('click', handleOpenClick);
      }
    };
  }, [setView]);

  const [viewTitle, setViewTitle] = useState('');
  let [hasHeader, setHasHeader] = useState(false);
  let [canGoBack, setCanGoBack] = useState(false);
  let [previousView, setPreviousView] = useState('');

  useEffect(() => {
    switch (view) {
      case 'Gender':
        setViewTitle('');
        // setPreviousView('HomePage');
        break;

      case 'Age':
        setViewTitle('');
        setPreviousView('Gender');
        break;

      case 'SkinType':
        setViewTitle('');
        setPreviousView('Age');
        break;

      case 'CaptureUpload':
        setViewTitle('');
        setPreviousView('SkinType');
        break;

      case 'PicCapture':
        setViewTitle('Snap for Skin Insight');
        setPreviousView('CaptureUpload');
        break;

      case 'Details':
        setViewTitle('');
        setPreviousView('CaptureUpload');
        break;

      case 'OTP':
        setViewTitle('');
        setPreviousView('Details');
        break;

      case 'Recommendation':
        setViewTitle('Here is Your Skin Analysis Report');
        // setPreviousView('Details');
        break;
    }

    setHasHeader(view !== 'HomePage');
    setCanGoBack(view !== 'Gender');
    setCanGoBack(view !== 'Recommendation');
  }, [view]);

  // const closeSkinAnalysis = () => {
  //   switch (view) {
  //     case "PicCapture":
  //       window.OrboSmartCapture.stop();
  //       break;
  //   }
  //   const customEvent = new CustomEvent("skinAnalysisClose", {
  //     bubbles: true,
  //   });
  //   document.dispatchEvent(customEvent);
  //   clear();
  // };

  const handleBackClick = () => {
    switch (view) {
      case 'Questionnaire':
        return;

      case 'PicCapture':
        window.OrboSmartCapture.stop();
        break;
    }
    setView(previousView);
  };

  return (
    <Box
      sx={{
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: hasHeader ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: { xs: '10px 20px', md: '20px 40px' },
        }}
      >
        {/* {view !== "Gender" &&  */}
        <Box sx={{ position: 'absolute', top: { xs: '10px', md: '20px' }, left: { xs: '10px', md: '40px' } }}>
          <ArrowBackIosIcon
            sx={{
              width: '32px',
              height: '32px',
              color: '#000',
              cursor: 'pointer',
              display: canGoBack ? 'initial' : 'none',
            }}
            onClick={() => handleBackClick()}
          />
        </Box>
        {/* } */}

        <Box>
          <Typography
            sx={{
              ...styles.heading,
              ...(view === 'Recommendation' && { paddingTop: { xs: '36px', md: '0' } }),
            }}
          >
            {viewTitle}
          </Typography>
        </Box>

        <Box sx={{ position: 'absolute', top: { xs: '10px', md: '20px' }, right: { xs: '10px', md: '40px' } }}>
          {/* <CloseIcon sx={{
            width: "32px",
            height: "32px",
            cursor: "pointer",
          }} onClick={() => closeSkinAnalysis()} /> */}
        </Box>
      </Box>
      <Box>
        {view === 'HomePage' && <HomePage />}
        {(view === 'Gender' || view === 'Age' || view === 'SkinType' || view === 'CaptureUpload') && <Questionnaire />}
        {view === 'PicCapture' && <PicCapture />}
        {(view === 'Details' || view === 'OTP') && <Details />}
        {view === 'Recommendation' && <Recommendation />}
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default App;

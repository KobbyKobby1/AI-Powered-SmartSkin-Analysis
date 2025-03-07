import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ViewProvider } from '../context';

const OrboSkinAnalyzer = () => {
  useEffect(() => {
    const containerId = 'orbo-cc-skin-analyzer-container';
    const $orboCCSkinAnalyzerContainer = document.getElementById(containerId);

    if (!$orboCCSkinAnalyzerContainer) {
      console.error(`Container with ID '${containerId}' not found.`);
      return;
    }

    if (!$orboCCSkinAnalyzerContainer.hasAttribute('data-root-mounted')) {
      $orboCCSkinAnalyzerContainer.setAttribute('data-root-mounted', 'true');

      const theme = createTheme({
        typography: {
          fontFamily: '"DM Sans", Arial, sans-serif',
        },
      });

      $orboCCSkinAnalyzerContainer.classList.add('orbo-cc-skin-analyzer-container');

      const root = createRoot($orboCCSkinAnalyzerContainer);

      root.render(
        <StrictMode>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ViewProvider>
              <App />
            </ViewProvider>
          </ThemeProvider>
        </StrictMode>,
      );
    }
  }, []);

  return <div id="orbo-cc-skin-analyzer-container" />;
};

export default OrboSkinAnalyzer;

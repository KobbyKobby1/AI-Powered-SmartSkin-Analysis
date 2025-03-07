import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ViewProvider } from './context';

// export const startOrboSkinAnalyzer = () => {
const $orboCCSkinAnalyzerContainer = document.getElementById('orbo-cc-skin-analyzer-container');
if (!$orboCCSkinAnalyzerContainer) {
  throw new Error('Invalid container provided for Orbo Skin Analyzer');
}

const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

$orboCCSkinAnalyzerContainer.classList.add('orbo-cc-skin-analyzer-container');
createRoot($orboCCSkinAnalyzerContainer).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ViewProvider>
        <App />
      </ViewProvider>
    </ThemeProvider>
  </StrictMode>,
);
// };

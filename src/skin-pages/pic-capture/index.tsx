import { Box } from '@mui/material';
import styles from '../../styles';
import { useView } from '../../context';
import { useEffect } from 'react';
import { Api } from '../../api';

const PicCapture = () => {
    const { 
        setView, 
        setCapturedPic, 
        setSnackbar, 
        userKnowsSkinType, 
        sessionId, 
        gender, 
        userInfo,
        setAiDetectionResult
    } = useView();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const capturedPic = await window.OrboSmartCapture.capturePic(
                    document.getElementById('otfs-smart-capture-container')
                );
                setCapturedPic(capturedPic);

                // Check if user doesn't know their skin type - then analyze with AI
                if (userKnowsSkinType === false) {
                    await analyzeWithAI(capturedPic);
                } else {
                    // User knows skin type - go to details
                    setView("Details");
                }
            } catch (error) {
                setSnackbar({
                    snackbarOpen: true,
                    snackbarMessage: "Failed to capture the image. Please try again.",
                    snackbarSeverity: "error"
                });
                setView("CaptureUpload");
            }
        };

        fetchData();
    }, []);

    const analyzeWithAI = async (imageFile: Blob) => {
        if (!sessionId) {
            setSnackbar({
                snackbarOpen: true,
                snackbarMessage: "Session error. Please restart the process.",
                snackbarSeverity: "error"
            });
            return;
        }
        
        try {
            // Show analyzing state
            setView('AnalyzingAI');
            
            const api = new Api();
            const result = await api.detectSkinType(sessionId, imageFile, gender, String(userInfo.age));
            setAiDetectionResult(result);
            
            // Go to AI Results page to show confidence and explanation
            setView('AIResults');
        } catch (error) {
            console.error('AI Analysis failed:', error);
            setSnackbar({
                snackbarOpen: true,
                snackbarMessage: 'AI analysis failed. Please try again or select your skin type manually.',
                snackbarSeverity: 'error',
            });
            // Fallback to manual selection
            setView('SkinType');
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: "20px", md: "28px" },
                alignItems: { xs: "center", md: "flex-start" },
                justifyContent: { xs: "center", md: "flex-start" },
                padding: "16px"
            }}>

            <Box sx={styles.inputContainer}>
                <div id="otfs-smart-capture-container"></div>
            </Box>
        </Box>
    );
};

export default PicCapture;
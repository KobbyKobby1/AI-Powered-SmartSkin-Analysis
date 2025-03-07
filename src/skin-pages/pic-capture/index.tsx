import {
    Box,
} from '@mui/material';
import styles from '../../styles';
import { useView } from '../../context';
import { useEffect } from 'react';

const PicCapture = () => {
    const { setView, setCapturedPic, setSnackbar } = useView();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const capturedPic = await
                    window.OrboSmartCapture.capturePic(
                        document.getElementById('otfs-smart-capture-container'));
                setCapturedPic(capturedPic);

                setView("Details");
            } catch (error) {
                setSnackbar({
                    snackbarOpen: true,
                    snackbarMessage: "Failed to capture the image. Please try again.",
                    snackbarSeverity: "error"
                });
                setView("Questionnaire");
            }
        };

        fetchData();
    }, []);

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

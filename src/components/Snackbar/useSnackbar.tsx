import { SetStateAction, useState } from "react";

export const useSnackbar = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('error');

    const showSnackbar = (message: SetStateAction<string>, severity: 'success' | 'error' | 'warning' | 'info' = 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return {
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        showSnackbar,
        handleSnackbarClose
    };
};

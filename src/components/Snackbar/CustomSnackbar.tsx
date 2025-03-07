import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

interface CustomSnackbarProps {
    open: boolean;
    message: string;
    severity: any,// 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, message, severity, onClose }) => {
    const getAlertStyles = (severity: string) => {
        switch (severity) {
            case 'success':
                return {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700
                };
            case 'error':
                return {
                    backgroundColor: '#f44336',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700
                };
            default:
                return {
                    fontSize: '1rem',
                };
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{ width: '100%', ...getAlertStyles(severity) }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

CustomSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    onClose: PropTypes.func,
};

export default CustomSnackbar;

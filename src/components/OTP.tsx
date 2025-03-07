import React, { useRef } from 'react';
import { Box, InputBase } from '@mui/material';


interface OtpInputProps {
    otp: string[];
    setOtp: (otp: string[]) => void;
}


const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp }) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < otp.length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, otp.length);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, idx) => {
                if (idx < otp.length) {
                    newOtp[idx] = char;
                    inputsRef.current[idx]?.focus();
                }
            });
            setOtp(newOtp);
        }
    };

    return (
        <Box display="flex" gap="12px">
            {otp.map((digit, index) => (
                <InputBase
                    key={index}
                    value={digit}
                    inputRef={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    inputProps={{ maxLength: 1 }}
                    sx={{
                        borderRadius: '12px',
                        background: '#F6F6F6',
                        boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.12) inset',
                        width: '74.237px',
                        height: '74.237px',
                        textAlign: 'center',
                        fontSize: '30px',
                        fontWeight: 400,
                        fontFamily: '"Neue Montreal", sans-serif',
                        color: '#727272',
                        outline: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& input': {
                            textAlign: 'center',
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default OtpInput;

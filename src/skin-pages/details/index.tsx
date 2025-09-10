import {
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useView } from '../../context';
import { logo, model } from '../../assets';
import { Api } from '../../api';
import LoadingButton from '@mui/lab/LoadingButton';
import parsePhoneNumberFromString, { CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { PaymentIntegrationService } from '../../services/payment-integration';

interface Country {
  code: string;
  isoCode: CountryCode;
  name: string;
}

const Details = () => {
  const {
    view,
    setView,
    sessionId,
    userInfo,
    setUserInfo,
    setSnackbar,
    capturedPic,
    setOutputScore,
    setRecommendations,
    setFallbackProductImage,
  } = useView();
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+233');
  const [isoCode, setIsoCode] = useState<CountryCode>('GH');
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [optForPromotions, setOptForPromotions] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [finalNumber, setFinalNumber] = useState<string>('');
  // const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  // const [timer, setTimer] = useState<number>(90);

  // useEffect(() => {
  //     if (view === "OTP") {
  //         setTimer(90);
  //         const interval = setInterval(() => {
  //             setTimer((prev) => (prev > 0 ? prev - 1 : 0));
  //         }, 1000);

  //         return () => clearInterval(interval);
  //     }
  // }, [view]);

  useEffect(() => {
    const countryList: Country[] = getCountries().map((country) => ({
      code: `+${getCountryCallingCode(country as CountryCode)}`,
      isoCode: country as CountryCode,
      name: country,
    }));
    setCountries(countryList);
  }, []);

  const validateName = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      setNameError('Name is required');
      return true;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return true;
    } else if (!nameRegex.test(name.trim())) {
      setNameError('Name must contain only alphabets');
      return true;
    } else {
      setNameError('');
      return false;
    }
  };

  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    const selectedCode = event.target.value as string;
    const selectedCountry = countries.find((country) => country.code === selectedCode);
    if (selectedCountry) {
      setCountryCode(selectedCountry.code);
      setIsoCode(selectedCountry.isoCode);
      setPhoneNumberError('');
    }
  };

  const validatePhoneNumber = () => {
    try {
      const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, isoCode);
      console.log(phoneNumberObj);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        setPhoneNumberError('');
        setFinalNumber(phoneNumberObj.number);
        return false;
      } else {
        setPhoneNumberError('Invalid phone number');
        return true;
      }
    } catch (error) {
      setPhoneNumberError('Invalid phone number');
      return true;
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError('Email is required.');
      return true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return true;
    } else {
      setEmailError('');
      return false;
    }
  };

  const sendDetails = async () => {
    if (!sessionId || !capturedPic) {
        setSnackbar({
            snackbarOpen: true,
            snackbarMessage: 'Session error. Please restart the skin analysis.',
            snackbarSeverity: 'error',
        });
        return;
    }

    try {
        setSaving(true);
        const api = new Api();
        
        console.log('📊 Getting skin analysis...');
        const { scores, recommendations, fallbackProductImage } = await api.getSkinScoresAndRecommendations(
            sessionId,
            capturedPic,
            userInfo.skin,
            userInfo.gender,
            userInfo.age,
            name,
        );
        
        console.log('✅ Analysis received, now sharing report...');
        console.log('📱 Phone for sharing:', finalNumber);
        console.log('📧 Email for sharing:', email);
        
        // Try to share the report
        const shareMessage = await api.shareReport(email, finalNumber, sessionId, optForPromotions);
        
        // If we get here, both analysis and sharing were successful
        setOutputScore(scores);
        setRecommendations(recommendations);
        setFallbackProductImage(fallbackProductImage);
        
        setSnackbar({
            snackbarOpen: true,
            snackbarMessage: `Analysis complete! ${shareMessage}`,
            snackbarSeverity: 'success',
        });
        
        setView('Recommendation');
        
    } catch (error) {
        console.error('❌ Error in sendDetails:', error);
        
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (error instanceof Error) {
            if (error.message.includes('phone') || error.message.includes('Phone')) {
                errorMessage = 'Please check your phone number format and try again.';
            } else if (error.message.includes('email') || error.message.includes('Email')) {
                errorMessage = 'Please check your email address and try again.';
            } else if (error.message.includes('API') || error.message.includes('server')) {
                errorMessage = 'Unable to send the report. Your analysis was completed but the PDF could not be sent.';
            }
        }
        
        setSnackbar({
            snackbarOpen: true,
            snackbarMessage: errorMessage,
            snackbarSeverity: 'error',
        });
    } finally {
        setSaving(false);
    }
};

  // NEW: Direct Paystack Payment Integration
  const initPayment = async () => {
    try {
      console.log('🚀 Initiating new Paystack payment...');
      setSaving(true);
      
      const paymentIntegration = new PaymentIntegrationService();
      
      // Debug: Check if we have analysis data
      console.log('🔍 Debug - sessionId from context:', sessionId);
      
      // Use sessionId from context, or generate one for testing
      const actualSessionId = sessionId || 'test_session_' + Date.now();
      console.log('🔍 Debug - Using sessionId:', actualSessionId);
      
      // Check if analysis data exists for this session
      const existingData = localStorage.getItem(`analysis_${actualSessionId}`);
      console.log('🔍 Debug - Existing analysis data:', existingData ? 'Found' : 'Not found');
      
      // Prepare payment request
      const paymentRequest = {
        sessionId: actualSessionId,
        userInfo: {
          name: name.trim(),
          email: email.trim(),
          phone: finalNumber
        }
      };
      
      console.log('👤 Payment request prepared with sessionId:', actualSessionId);
      
      // This will open Paystack popup and handle everything automatically
      await paymentIntegration.initiatePaystackPayment(paymentRequest);
      
      setSaving(false);
      
    } catch (error) {
      console.error('❌ Payment initiation failed:', error);
      setSaving(false);
      setSnackbar({
        snackbarOpen: true,
        snackbarMessage: 'Oops! Something went wrong with payment. Please try again later.',
        snackbarSeverity: 'error',
      });
    }
  };

  const sendOTPClick = async () => {
    const name_error = validateName();
    const phone_error = validatePhoneNumber();
    const email_error = validateEmail();
    // setTimer(90);

    if (!name_error && !phone_error && !email_error && name && finalNumber && email) {
      setUserInfo({
        name,
        email,
        age: userInfo.age,
        skin: userInfo.skin,
        gender: userInfo.gender,
        phone: finalNumber,
      });

      try {
        // const api = new Api();
        // await api.sendOtp(sessionId, phoneNumber);
        // setView("OTP");
        // sendDetails();
        initPayment();
      } catch (error: any) {
        console.error('Failed to send details:', error.message);
      }
    }
  };

  // const handleVerifyOtpClick = async () => {
  //     if (!otp || otp.length !== 4) {
  //         console.error("Invalid OTP");
  //         return;
  //     }

  //     try {
  //         const api = new Api();
  //         await api.verifyOtp(sessionId, userInfo.phone, otp.join(""));
  //         console.log("OTP verified successfully");
  //         sendDetails();
  //     } catch (error: any) {
  //         console.log(error.message)
  //         console.error("Failed to verify OTP:", error.message);
  //         setSnackbar({
  //             snackbarOpen: true,
  //             snackbarMessage: error.message,
  //             snackbarSeverity: "error"
  //         });
  //     }
  // };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: '100px',
        width: '100%',
        height: '100%',
      }}
    >
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          position: 'absolute',
        }}
        open={saving}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Processing Payment...
        </Typography>
      </Backdrop>
      {view === 'Details' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '30px', md: '50px' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'space-evenly', md: 'flex-start' },
            height: '100%',
            padding: '16px',
            maxWidth: { xs: '100%', md: '525px' },
            margin: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: { xs: '291px', md: '461px' },
                height: { xs: '62px', md: '100px' },
                padding: '4.08px 0px 4.413px 0px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                backgroundImage: `url(${logo.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <Box />
          </Box>

          <Box
            sx={{
              color: '#000',
              textAlign: 'center',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: { xs: '18px', md: '26px' },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
              leadingTrim: 'both',
              textEdge: 'cap',
              paddingX: { xs: '40px', md: 0 },
            }}
          >
            Enter your details to receive your detailed skin analysis report
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '30px', md: '40px' },
              alignItems: { xs: 'center', md: 'center' },
              justifyContent: { xs: 'center', md: 'flex-start' },
              width: '100%',
            }}
          >
            <Box sx={{ position: 'relative', width: { xs: '100%', md: 'fit-content' } }}>
              <TextField
                variant="outlined"
                placeholder="Enter your name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
                type="text"
                sx={{
                  width: { xs: '100%', md: '522.05px' },
                  height: '69.421px',
                  flexShrink: 0,
                  borderRadius: '5px',
                  background: '#FBFFEB',
                  border: !!nameError ? '1px solid #d32f2f' : '2px solid #98B727',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  '& .MuiInputBase-input': {
                    textAlign: 'left',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: '32px',
                    color: '#000',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#000',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: '32px',
                    textAlign: 'center',
                  },
                  '& .MuiInput-underline:before': {
                    display: 'none',
                  },
                  '& .MuiInput-underline:after': {
                    display: 'none',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-input:-webkit-autofill,& .MuiInputBase-input:-webkit-autofill:hover, & .MuiInputBase-input:-webkit-autofill:focus, & .MuiInputBase-input:-webkit-autofill:active':
                    {
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'initial',
                      transition: 'background-color 5000s ease-in-out 0s',
                      boxShadow: 'none',
                    },
                }}
              />
              {nameError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-20px',
                    left: 0,
                    color: '#d32f2f',
                    fontSize: '12px',
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {nameError}
                </Box>
              )}
            </Box>

            <Box sx={{ position: 'relative', width: { xs: '100%', md: 'fit-content' } }}>
              <TextField
                variant="outlined"
                placeholder="Enter your email id *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                type="email"
                sx={{
                  width: { xs: '100%', md: '522.05px' },
                  height: '69.421px',
                  flexShrink: 0,
                  borderRadius: '5px',
                  background: '#FBFFEB',
                  border: !!emailError ? '1px solid #d32f2f' : '2px solid #98B727',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  '& .MuiInputBase-input': {
                    textAlign: 'left',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: '32px',
                    color: '#000',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#111',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: '32px',
                    textAlign: 'center',
                  },
                  '& .MuiInput-underline:before': {
                    display: 'none',
                  },
                  '& .MuiInput-underline:after': {
                    display: 'none',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-input:-webkit-autofill,& .MuiInputBase-input:-webkit-autofill:hover, & .MuiInputBase-input:-webkit-autofill:focus, & .MuiInputBase-input:-webkit-autofill:active':
                    {
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'initial',
                      transition: 'background-color 5000s ease-in-out 0s',
                      boxShadow: 'none',
                    },
                }}
              />
              {emailError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-20px',
                    left: 0,
                    color: '#d32f2f',
                    fontSize: '12px',
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {emailError}
                </Box>
              )}
            </Box>

            <Box sx={{ position: 'relative', width: { xs: '100%', md: 'fit-content' } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: { xs: '100%', md: '522.191px' },
                  height: '69.421px',
                  borderRadius: '5px',
                  border: !!phoneNumberError ? '1px solid #d32f2f' : '2px solid #98B727',
                  borderRight: 'none',
                  backgroundColor: '#FBFFEB',
                }}
              >
                <Select
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  sx={{
                    flexShrink: 0,
                    border: 'none',
                    backgroundColor: '#FBFFEB',
                    color: '#000',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 700,
                    lineHeight: '32px',
                    textAlign: 'center',
                    outline: 'none',
                    borderTopLeftRadius: '5px',
                    borderBottomLeftRadius: '5px',
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSvgIcon-root': { color: '#000' },
                  }}
                  displayEmpty
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  variant="outlined"
                  placeholder="Enter your mobile (whatsapp) number *"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={validatePhoneNumber}
                  type="tel"
                  sx={{
                    flexGrow: 1,
                    height: '69.421px',
                    borderRadius: '5px',
                    background: '#FBFFEB',
                    border: !!phoneNumberError ? '1px solid #d32f2f' : '2px solid #98B727',
                    borderLeft: 'none',
                    '& .MuiInputBase-root': {
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'left',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: { xs: '16px', md: '18px' },
                      fontWeight: 400,
                      lineHeight: '32px',
                      color: '#000',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#000',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: { xs: '16px', md: '18px' },
                      fontWeight: 400,
                      lineHeight: '32px',
                      textAlign: 'left',
                      paddingLeft: { xs: '0', md: '12%' },
                    },
                    '& .MuiInput-underline:before': {
                      display: 'none',
                    },
                    '& .MuiInput-underline:after': {
                      display: 'none',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiInputBase-input:-webkit-autofill,& .MuiInputBase-input:-webkit-autofill:hover, & .MuiInputBase-input:-webkit-autofill:focus, & .MuiInputBase-input:-webkit-autofill:active':
                      {
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: '#000',
                        transition: 'background-color 5000s ease-in-out 0s',
                        boxShadow: 'none',
                      },
                  }}
                />
              </Box>
              {phoneNumberError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-20px',
                    left: 0,
                    color: '#d32f2f',
                    fontSize: '12px',
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {phoneNumberError}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                width: { xs: '291.854px', md: '522.191px' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optForPromotions}
                    onChange={(e) => setOptForPromotions(e.target.checked)}
                    value={optForPromotions}
                    sx={{
                      color: '#D5F951',
                      '&.Mui-checked': {
                        color: '#D5F951',
                      },
                      // '& .MuiSvgIcon-root': {
                      //     fill: "#D5F951"
                      // }
                    }}
                  />
                }
                label="Update me about offers & discount"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <LoadingButton
              variant="contained"
              loading={saving}
              loadingPosition="end"
              sx={{
                width: '150px',
                height: '40.857px',
                flexShrink: 0,
                borderRadius: '5px',
                background: '#602DEE',
                fontSize: '20px',
                color: '#FFF',
                padding: '0px 8px',
                '&:hover': {
                  background: '#333',
                },
              }}
              onClick={sendOTPClick}
            >
              Next
            </LoadingButton>
            <Typography
              variant="body2"
              sx={{
                color: '#555',
                fontSize: '16px',
                textAlign: 'center',
                mt: 1,
              }}
            >
              Payment is required to proceed. Click "Next" to pay securely via Paystack.
            </Typography>
          </Box>
        </Box>
      )}

      {/* {view === "OTP" && <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: "30px", md: "50px" },
                    alignItems: { xs: "center", md: "center" },
                    justifyContent: { xs: "center", md: "flex-start" },
                    padding: "16px",
                    margin: "auto",
                }}>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "space-between"
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            width: { xs: "291px", md: '461px' },
                            height: { xs: "95px", md: '174px' },
                            padding: '4.08px 0px 4.413px 0px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0,
                            backgroundImage: `url(${assets.logo1})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                    <Box />
                </Box>

                <Box
                    sx={{
                        color: '#000',
                        textAlign: 'center',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: { xs: "28px", md: '44px' },
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                        leadingTrim: 'both',
                        textEdge: 'cap',
                        paddingX: { xs: "40px", md: 0 }
                    }}
                >
                    OTP Verification
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: "50px", md: "40px" },
                    alignItems: { xs: "center", md: "center" },
                    justifyContent: { xs: "center", md: "flex-start" },
                    width: "100%",
                }}>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "center", alignItems: "center", gap: "10px" }}>
                        <Typography
                            sx={{
                                color: '#4E4D4D',
                                textAlign: 'center',
                                fontFamily: '"Neue Montreal", sans-serif',
                                fontSize: '20px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: 'normal',
                            }}
                        >
                            Enter the OTP sent to
                        </Typography>
                        <Typography
                            sx={{
                                color: '#000',
                                fontFamily: '"Neue Montreal", sans-serif',
                                fontSize: '24px',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: 'normal',
                            }}
                        >
                            +91 - {phoneNumber}
                        </Typography>
                    </Box>

                    <OtpInput otp={otp} setOtp={setOtp} />

                </Box>
                <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <LoadingButton
                        variant="contained"
                        loading={saving}
                        loadingPosition='end'
                        sx={{
                            width: '220px',
                            height: '40.857px',
                            flexShrink: 0,
                            borderRadius: '5px',
                            background: '#602DEE',
                            fontSize: '16px',
                            color: '#FFF',
                            paddingLeft: '8px',
                            textAlign: "left",
                            textTransform: 'none',
                            '&:hover': {
                                background: '#333',
                            }
                        }}
                        onClick={handleVerifyOtpClick}
                    >
                        Show My Results
                    </LoadingButton>
                    {view === "OTP" && (
                        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                            <Typography
                                sx={{
                                    color: "#999",
                                    fontFamily: "Neue Montreal",
                                    fontSize: { xs: "18px", md: "26px" },
                                    fontWeight: 500,
                                    lineHeight: "normal"
                                }}
                            >
                                {timer} sec
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "50px" }}>
                                <Typography
                                    sx={{
                                        color: "rgba(0, 0, 0, 0.60)",
                                        fontFamily: "Neue Montreal",
                                        fontSize: { xs: "18px", md: "24px" },
                                        fontWeight: 400,
                                        lineHeight: "normal",
                                    }}
                                >
                                    Didn't receive OTP?
                                </Typography>

                                <Box
                                    onClick={sendOTPClick}
                                    sx={{
                                        color: "rgba(0, 0, 0, 0.60)",
                                        fontFamily: "Neue Montreal",
                                        fontSize: { xs: "18px", md: "24px" },
                                        fontWeight: 700,
                                        lineHeight: "normal",
                                        textTransform: "none",
                                        paddingLeft: '0',
                                        cursor: "pointer"
                                    }}
                                >
                                    Re-send
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

            </Box>} */}

      <Box
        sx={{
          backgroundImage: `url(${model.src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
          display: { xs: 'none', md: 'block' },
        }}
      ></Box>
    </Box>
  );
};

export default Details;

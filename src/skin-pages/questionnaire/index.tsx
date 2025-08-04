import { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Grid} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import styles from '../../styles';
import { assets } from '../../assets/index';
import { useView } from '../../context';
import { Api } from '../../api';
import { maleIcon, femaleIcon } from '../../assets/index';

const skinTypes = [
  [
    'Normal',
    assets.normalSkinIcon,
    'normal',
    'Normal skin is balanced and smooth with small pores, minimal breakouts, and even-toned.',
  ],
  [
    'Dry',
    assets.drySkinIcon,
    'dry',
    'Dry skin produces minimal oil(sebum), leading to tightness, flakiness, small pores, and easy irritation',
  ],
  [
    'Sensitive',
    assets.sensitiveSkinIcon,
    'sensitive',
    'Sensitive skin develops when the skins protective barrier weakens, leading to irritation, redness, or dryness.',
  ],
  [
    'Oily',
    assets.oilySkinIcon,
    'oily',
    'Oily skin produces excess oil(sebum), causing shine, enlarged pores, and frequent breakouts or blackheads.',
  ],
  [
    'Combination',
    assets.combinationSkinIcon,
    'combination',
    'Combination skin has both oily and dry areas, typically with an oily T-zone and dry cheeks.',
  ],
];

const genders = [
  ['Male', maleIcon.src, 'male'],
  ['Female', femaleIcon.src, 'female'],
];

const captureUpload = [
  ['Camera', assets.cameraIcon, 'camera'],
  ['Upload', assets.uploadIcon, 'upload'],
];

// Properly typed skin type info with detailed descriptions
type SkinTypeKey = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive';

interface SkinTypeInfo {
  name: string;
  color: string;
  icon: string;
  description: string;
  characteristics: string[];
  riskFactors: string[];
}

const skinTypeInfo: Record<SkinTypeKey, SkinTypeInfo> = {
  normal: { 
    name: 'Normal', 
    color: '#4CAF50', 
    icon: '✨',
    description: 'Your skin has a balanced oil and moisture content with minimal imperfections.',
    characteristics: ['Balanced oil production', 'Small to medium pores', 'Smooth texture', 'Even tone', 'Minimal sensitivity'],
    riskFactors: ['Generally low risk', 'Maintain current routine', 'Protect from sun damage']
  },
  dry: { 
    name: 'Dry', 
    color: '#FF9800', 
    icon: '🏜️',
    description: 'Your skin produces insufficient oil, leading to tightness and potential flakiness.',
    characteristics: ['Low oil production', 'Small, tight pores', 'Rough or flaky areas', 'Feeling of tightness', 'Easy irritation'],
    riskFactors: ['Risk of irritation with harsh products', 'May worsen in cold weather', 'Needs gentle, hydrating care']
  },
  oily: { 
    name: 'Oily', 
    color: '#2196F3', 
    icon: '💧',
    description: 'Your skin produces excess oil, particularly in the T-zone area.',
    characteristics: ['High oil production', 'Large, visible pores', 'Shiny appearance', 'Prone to blackheads', 'Frequent breakouts'],
    riskFactors: ['Risk of clogged pores', 'May worsen with wrong products', 'Needs oil-control ingredients']
  },
  combination: { 
    name: 'Combination', 
    color: '#9C27B0', 
    icon: '🌓',
    description: 'Your skin has different characteristics in different areas - typically oily T-zone and normal/dry cheeks.',
    characteristics: ['Oily T-zone', 'Normal/dry cheeks', 'Mixed pore sizes', 'Variable texture', 'Different needs per area'],
    riskFactors: ['Complex care needs', 'Risk of over-treating areas', 'Requires targeted approach']
  },
  sensitive: { 
    name: 'Sensitive', 
    color: '#F44336', 
    icon: '🌸',
    description: 'Your skin reacts easily to products, weather, or environmental factors.',
    characteristics: ['Frequent reactions', 'Redness or irritation', 'Burning/stinging sensations', 'Thin appearance', 'Weather sensitivity'],
    riskFactors: ['High risk with new products', 'Needs patch testing', 'Requires gentle, minimal ingredients']
  }
};

// Helper function to get confidence level description
const getConfidenceDescription = (confidence: number): { level: string; description: string; color: string } => {
  if (confidence >= 90) {
    return {
      level: 'Very High',
      description: 'Our AI is very confident in this assessment. The skin characteristics clearly match this skin type.',
      color: '#4CAF50'
    };
  } else if (confidence >= 80) {
    return {
      level: 'High',
      description: 'Our AI is confident in this assessment. Most skin characteristics align with this skin type.',
      color: '#8BC34A'
    };
  } else if (confidence >= 70) {
    return {
      level: 'Moderate',
      description: 'Our AI has moderate confidence. Some characteristics suggest this skin type, but please review carefully.',
      color: '#FF9800'
    };
  } else {
    return {
      level: 'Low',
      description: 'Our AI has lower confidence in this assessment. Please consider manual selection or retake the photo.',
      color: '#F44336'
    };
  }
};

const EnhancedQuestionnaire = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { 
    view, 
    setView, 
    userInfo, 
    setUserInfo, 
    sessionId, 
    setSessionId, 
    setSnackbar, 
    setCapturedPic,
    aiDetectionResult,
    setAiDetectionResult,
    userKnowsSkinType,
    setUserKnowsSkinType
  } = useView();
  
  const [skin, setSkin] = useState(userInfo.skin);
  const [age, setAge] = useState(Number(userInfo.age));
  const [gender, setGender] = useState(userInfo.gender);
  const [imgSelection, setImgSelection] = useState('');
  const [errors, setErrors] = useState({
    skin: '',
    gender: '',
    imgSelection: '',
  });
  const theme = useTheme();
  const isXsUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (sessionId) return;
    new Api()
      .getSessionId()
      .then((sessionId) => {
        setSessionId(sessionId);
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          snackbarOpen: true,
          snackbarMessage: 'Oops! Something went wrong. Please try again later.',
          snackbarSeverity: 'error',
        });
      });
  }, []);

  const validateSessionId = () => {
    if (!sessionId) {
      setSnackbar({
        snackbarOpen: true,
        snackbarMessage: 'We hit a snag. Restarting the process should fix it.',
        snackbarSeverity: 'error',
      });
      return false;
    }
    return true;
  };

  const handleValidation = () => {
    if (!validateSessionId()) return false;

    let valid = true;
    const newErrors: any = {
      skin: '',
      gender: '',
      age: '',
      imgSelection: '',
    };

    if (!skin.trim()) {
      newErrors.skin = 'Skin type is required.';
      valid = false;
    }

    if (!gender.trim()) {
      newErrors.gender = 'Gender is required.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setSnackbar({
        snackbarOpen: true,
        snackbarMessage: 'Please select an option',
        snackbarSeverity: 'warning',
      });
    }

    return valid;
  };

  const handleSkinChange = (value: string) => {
    setSkin(value);
    if (value) {
      setErrors((prev) => ({ ...prev, skin: '' }));
    }
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    if (value) {
      setErrors((prev) => ({ ...prev, gender: '' }));
    }
  };

  const handleImgSelection = (value: string) => {
    setImgSelection(value);
    if (value) {
      setErrors((prev) => ({ ...prev, imgSelection: '' }));
    }
  };

  const handleBoxClick = (value: string) => {
    if (value === 'upload') {
      handleImgSelection(value);
      fileInputRef.current?.click();
    } else {
      handleImgSelection(value);
      handleSubmit();
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setCapturedPic(file);
      
      if (userKnowsSkinType === false) {
        // User doesn't know skin type - analyze with AI
        await analyzeWithAI(file);
      } else {
        // User knows skin type - validate and proceed normally
        if (handleValidation()) {
          setUserInfo({ skin, gender, age: String(age), name: '', email: userInfo.email, phone: userInfo.phone });
          setView('Details');
        }
      }
    }
  };

  const analyzeWithAI = async (imageFile: Blob) => {
    if (!sessionId) return;
    
    // Show analyzing state
    setView('AnalyzingAI');
    
    try {
      const api = new Api();
      const result = await api.detectSkinType(sessionId, imageFile, gender, String(age));
      setAiDetectionResult(result);
      setView('AIResults');
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setSnackbar({
        snackbarOpen: true,
        snackbarMessage: 'AI analysis failed. Please try again or select your skin type manually.',
        snackbarSeverity: 'error',
      });
      setUserKnowsSkinType(true);
      setView('SkinType');
    }
  };

  const handleSubmit = () => {
    if (userKnowsSkinType === false) {
      // For "No" path, we don't need skin type validation yet
      setView('PicCapture');
    } else {
      // For "Yes" path, validate as usual
      if (handleValidation()) {
        setUserInfo({ skin, gender, age: String(age), name: '', email: userInfo.email, phone: userInfo.phone });
        setView('PicCapture');
      }
    }
  };

  const confirmAIResult = () => {
    if (aiDetectionResult) {
      setSkin(aiDetectionResult.skinType);
      setUserInfo({ 
        skin: aiDetectionResult.skinType, 
        gender, 
        age: String(age), 
        name: '', 
        email: userInfo.email, 
        phone: userInfo.phone 
      });
      setView('Details');
    }
  };

  const rejectAIResult = () => {
    setSnackbar({
      snackbarOpen: true,
      snackbarMessage: 'No problem! Please select your skin type manually.',
      snackbarSeverity: 'info',
    });
    setUserKnowsSkinType(true);
    setView('SkinType');
  };

  // Helper function to safely get skin type info
  const getSkinTypeInfo = (skinType: string): SkinTypeInfo => {
    return skinTypeInfo[skinType as SkinTypeKey] || skinTypeInfo.normal;
  };

  return (
    <>
      {view === 'Gender' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '40px', md: '100px' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'space-between', md: 'center' },
            height: '100%',
            padding: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '20px', md: '100px' },
              alignItems: { xs: 'center', md: 'center' },
              justifyContent: { xs: 'center', md: 'center' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: '40px', md: '100px' },
              }}
            >
              <Typography sx={styles.heading}>How do you identify yourself?</Typography>

              <Box sx={styles.inputContainer}>
                <RadioGroup
                  row
                  value={gender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  sx={{
                    display: 'flex',
                    gap: { xs: '24px', md: '100px' },
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  {genders.map(([group, icon, value], index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: { xs: 'end', md: 'flex-end' },
                        width: '170px',
                        height: '205px',
                        padding: { xs: '2px', md: '4px' },
                        borderRadius: '25px',
                        backgroundImage: `url(${icon})`,
                        border: gender === value ? '2.5px solid #98B727' : '1.5px solid #717171',
                        borderColor: errors.gender && '#d32f2f',
                        borderWidth: errors.gender && '3px',
                        cursor: 'pointer',
                        backgroundSize: 'contain',
                        flexShrink: 0,
                        gap: { xs: '8px', md: '40px' },
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '20%',
                          background: 'linear-gradient(180deg, rgba(217, 217, 217, 0.00), rgba(241, 241, 241, 0.90))',
                          zIndex: 1,
                          borderRadius: '0 0 25px 25px',
                        },
                      }}
                      onClick={() => handleGenderChange(String(value))}
                    >
                      <FormControlLabel
                        value={value}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={String(group)}
                        sx={{
                          zIndex: 2,
                          color: '#000',
                          textAlign: 'center',
                          fontFamily: 'DM Sans',
                          fontSize: { xs: '14px', md: '28px' },
                          fontWeight: gender === value ? 700 : 400,
                          lineHeight: '32px',
                          margin: 0,
                          textTransform: gender === value ? 'capitalize' : 'none',
                          '& .MuiTypography-root': {
                            fontWeight: 400,
                            fontSize: { xs: '14px', md: '18px' },
                          },
                        }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Button
              variant="contained"
              sx={{
                width: '143px',
                height: '40.857px',
                flexShrink: 0,
                borderRadius: '5px',
                background: '#602DEE',
                fontSize: '20px',
                color: '#FFF',
                '&:hover': {
                  background: '#333',
                },
              }}
              onClick={() => {
                gender ? setView('Age') : setErrors((prev) => ({ ...prev, gender: 'Gender is required' }));
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {view === 'Age' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '100px', md: '100px' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'space-between', md: 'center' },
            height: '100%',
            padding: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '40px', md: '100px' },
              alignItems: { xs: 'center', md: 'center' },
              justifyContent: { xs: 'center', md: 'center' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '100px',
              }}
            >
              <Typography sx={styles.heading}>Could you tell us your age?</Typography>

              <Box sx={styles.inputContainer}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '200px',
                    height: '240px',
                    flexShrink: 0,
                    borderRadius: '50px',
                    border: '1.5px solid #717171',
                    backgroundColor: '#FBFFEB',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#000',
                      textAlign: 'center',
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '80px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '32px',
                      textRendering: 'geometricPrecision',
                    }}
                  >
                    {age}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translate(-50%, -50%)',
                      width: '50px',
                      height: '50px',
                      flexShrink: 0,
                      backgroundColor: '#FBFFEB',
                      border: '1.5px solid #717171',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => age !== 1 && setAge(age - 1)}
                  >
                    <Typography
                      sx={{
                        color: '#000',
                        textAlign: 'center',
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '50px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '32px',
                        textRendering: 'geometricPrecision',
                        userSelect: 'none',
                      }}
                    >
                      -
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      transform: 'translate(50%, -50%)',
                      width: '50px',
                      height: '50px',
                      flexShrink: 0,
                      backgroundColor: '#FBFFEB',
                      border: '1.5px solid #717171',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => setAge(age + 1)}
                  >
                    <Typography
                      sx={{
                        color: '#000',
                        textAlign: 'center',
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '50px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '32px',
                        textRendering: 'geometricPrecision',
                        userSelect: 'none',
                      }}
                    >
                      +
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: 'Neue Montreal',
                    fontSize: '28px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '32px',
                    letterSpacing: '1.4px',
                    textTransform: 'capitalize',
                    paddingTop: '20px',
                  }}
                >
                  Age
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Button
              variant="contained"
              sx={{
                width: '143px',
                height: '40.857px',
                flexShrink: 0,
                borderRadius: '5px',
                background: '#602DEE',
                fontSize: '20px',
                color: '#FFF',
                '&:hover': {
                  background: '#333',
                },
              }}
              onClick={() => setView('KnowSkinType')}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* NEW: Know Skin Type Page */}
      {view === 'KnowSkinType' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '60px', md: '120px' },
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '16px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ ...styles.heading, mb: 4 }}>
              Do you know your skin type?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '16px', md: '20px' },
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              Choose how you'd like to proceed with your skin analysis
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 4, md: 8 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center'
          }}>
            {/* YES - I know my skin type */}
            <Card
              onClick={() => {
                setUserKnowsSkinType(true);
                setView('SkinType');
              }}
              sx={{
                width: { xs: '280px', md: '320px' },
                height: { xs: '200px', md: '240px' },
                cursor: 'pointer',
                borderRadius: '20px',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 121, 107, 0.2)',
                  borderColor: '#00796B'
                }
              }}
            >
              <CardContent sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}>
                <CheckCircleIcon sx={{ 
                  fontSize: { xs: 48, md: 60 }, 
                  color: '#00796B', 
                  mb: 2 
                }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#00796B',
                  mb: 2,
                  fontSize: { xs: '20px', md: '24px' }
                }}>
                  Yes, I Know
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  fontSize: { xs: '14px', md: '16px' }
                }}>
                  Select from Normal, Dry, Oily, Combination, or Sensitive skin types
                </Typography>
              </CardContent>
            </Card>

            {/* NO - Let AI detect */}
            <Card
              onClick={() => {
                setUserKnowsSkinType(false);
                setView('CaptureUpload');
              }}
              sx={{
                width: { xs: '280px', md: '320px' },
                height: { xs: '200px', md: '240px' },
                cursor: 'pointer',
                borderRadius: '20px',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, rgba(229, 188, 118, 0.1) 0%, rgba(229, 188, 118, 0.2) 100%)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(229, 188, 118, 0.3)',
                  borderColor: '#E5BC76'
                }
              }}
            >
              <CardContent sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}>
                <AutoAwesomeIcon sx={{ 
                  fontSize: { xs: 48, md: 60 }, 
                  color: '#E5BC76', 
                  mb: 2 
                }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#E5BC76',
                  mb: 2,
                  fontSize: { xs: '20px', md: '24px' }
                }}>
                  No, Help Me
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  fontSize: { xs: '14px', md: '16px' }
                }}>
                  Let our AI analyze your photo and detect your skin type automatically
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* AI Analyzing Loading State */}
      {view === 'AnalyzingAI' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '16px',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 80, color: '#E5BC76', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
            Analyzing Your Skin Type...
          </Typography>
          <LinearProgress 
            sx={{ 
              width: '400px',
              height: '12px',
              borderRadius: '6px',
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#E5BC76'
              }
            }} 
          />
          <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', maxWidth: '500px' }}>
            Our advanced AI is examining your skin's oiliness, pore size, texture, and sensitivity patterns. 
            This analysis helps us determine your skin type with high accuracy.
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
            This may take 10-15 seconds...
          </Typography>
        </Box>
      )}

      {/* ENHANCED AI Results Page with Detailed Explanations */}
      {view === 'AIResults' && aiDetectionResult && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '30px', md: '40px' },
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: '100%',
            padding: '16px',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {/* Header Card with Main Result */}
          <Card sx={{ 
            width: '100%',
            borderRadius: '20px', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: `3px solid ${getSkinTypeInfo(aiDetectionResult.skinType).color}40`
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ 
                fontSize: 70, 
                color: getSkinTypeInfo(aiDetectionResult.skinType).color, 
                mb: 2 
              }} />
              
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                color: getSkinTypeInfo(aiDetectionResult.skinType).color,
                mb: 2,
                fontSize: { xs: '28px', md: '36px' }
              }}>
                {getSkinTypeInfo(aiDetectionResult.skinType).name} Skin
              </Typography>

              {/* Confidence Level with detailed explanation */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={`${aiDetectionResult.confidence}% Confidence`}
                  sx={{
                    backgroundColor: `${getConfidenceDescription(aiDetectionResult.confidence).color}20`,
                    color: getConfidenceDescription(aiDetectionResult.confidence).color,
                    fontWeight: 700,
                    fontSize: '16px',
                    height: '40px',
                    mb: 2
                  }}
                />
                <Typography variant="body2" sx={{ 
                  color: getConfidenceDescription(aiDetectionResult.confidence).color,
                  fontWeight: 600,
                  mb: 1
                }}>
                  {getConfidenceDescription(aiDetectionResult.confidence).level} Confidence
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {getConfidenceDescription(aiDetectionResult.confidence).description}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ 
                fontSize: '18px',
                color: '#333',
                mb: 2,
                lineHeight: 1.6,
                fontWeight: 500
              }}>
                {getSkinTypeInfo(aiDetectionResult.skinType).description}
              </Typography>

              {/* Warning for low confidence */}
              {aiDetectionResult.confidence < 80 && (
                <Alert 
                  severity="warning" 
                  icon={<WarningIcon />}
                  sx={{ mt: 2, textAlign: 'left' }}
                >
                  <strong>Lower Confidence Detected:</strong> Our AI suggests reviewing this result carefully. 
                  Consider retaking the photo with better lighting or selecting your skin type manually.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Detailed Analysis Breakdown */}
          <Card sx={{ width: '100%', borderRadius: '16px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1, color: '#00796B' }} />
                AI Analysis Breakdown
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Oiliness Level: {aiDetectionResult.analysis.oiliness.score}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      <strong>Zones:</strong> {aiDetectionResult.analysis.oiliness.zones.join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Our AI detected {aiDetectionResult.analysis.oiliness.score > 60 ? 'elevated' : aiDetectionResult.analysis.oiliness.score > 30 ? 'moderate' : 'low'} oil production in your skin.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Pore Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {aiDetectionResult.analysis.poreSize.description}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Skin Texture
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {aiDetectionResult.analysis.texture.description}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Sensitivity Assessment
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {aiDetectionResult.analysis.sensitivity.description}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Skin Type Characteristics and Risk Factors */}
          <Card sx={{ width: '100%', borderRadius: '16px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                What This Means for Your Skin
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#00796B' }}>
                    Key Characteristics:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {getSkinTypeInfo(aiDetectionResult.skinType).characteristics.map((char, index) => (
                      <Typography component="li" key={index} sx={{ mb: 1, fontSize: '14px' }}>
                        {char}
                      </Typography>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#FF9800' }}>
                    Care Considerations:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {getSkinTypeInfo(aiDetectionResult.skinType).riskFactors.map((risk, index) => (
                      <Typography component="li" key={index} sx={{ mb: 1, fontSize: '14px' }}>
                        {risk}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Final Confirmation */}
          <Card sx={{ width: '100%', borderRadius: '16px', backgroundColor: '#f8f9fa' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Does this assessment seem accurate for your skin?
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#666',
                mb: 4,
                fontStyle: 'italic'
              }}>
                Your confirmation helps us provide the most accurate skincare recommendations.
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: 'center',
                flexDirection: { xs: 'column', md: 'row' }
              }}>
                <Button
                  variant="contained"
                  startIcon={<ThumbUpIcon />}
                  onClick={confirmAIResult}
                  sx={{
                    py: 2,
                    px: 6,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${getSkinTypeInfo(aiDetectionResult.skinType).color} 0%, ${getSkinTypeInfo(aiDetectionResult.skinType).color}CC 100%)`,
                    fontSize: '16px',
                    fontWeight: 600,
                    minWidth: '200px'
                  }}
                >
                  Yes, That's Right!
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ThumbDownIcon />}
                  onClick={rejectAIResult}
                  sx={{
                    py: 2,
                    px: 6,
                    borderRadius: '12px',
                    borderColor: '#666',
                    color: '#666',
                    fontSize: '16px',
                    fontWeight: 600,
                    minWidth: '200px',
                    '&:hover': {
                      borderColor: '#333',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  Let Me Choose Manually
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Rest of existing views... */}
      {view === 'SkinType' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '50px', md: '100px' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'space-between', md: 'center' },
            padding: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '20px', md: '50px' },
              alignItems: { xs: 'center', md: 'center' },
              justifyContent: { xs: 'center', md: 'center' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: { xs: '30px', md: '100px' },
              }}
            >
              <Typography sx={styles.heading}>What type of skin do you have?</Typography>

              <Box sx={styles.inputContainer}>
                <RadioGroup
                  row
                  value={skin}
                  onChange={(e) => handleSkinChange(e.target.value)}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'row' },
                    columnGap: { xs: '30px', md: '60px' },
                    rowGap: { xs: '22px', md: '60px' },
                    justifyContent: { xs: 'center', md: 'center' },
                    alignItems: { xs: 'flex-start', md: 'flex-start' },
                  }}
                >
                  {skinTypes.map(([group, icon, value, description], key) => (
                    <Box
                      key={key}
                      sx={{
                        width: { xs: '125px', md: '170px' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: { xs: '20px', md: '40px' },
                      }}
                    >
                      <Box
                        key={value}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          justifyContent: { xs: 'center', md: 'flex-end' },
                          width: { xs: '125px', md: '170px' },
                          height: { xs: '150px', md: '205px' },
                          padding: { xs: '4px', md: '4px' },
                          borderRadius: '25px',
                          border: skin === value ? '2.5px solid #98B727' : '1.5px solid #717171',
                          borderColor: errors.skin && '#d32f2f',
                          borderWidth: errors.skin && '3px',
                          backgroundColor: '#FBFFEB',
                          backgroundImage: {
                            md: gender === 'male' ? `url(${maleIcon.src})` : `url(${femaleIcon.src})`,
                            sx: 'none',
                          },
                          backgroundSize: 'contain',
                          cursor: 'pointer',
                          flexShrink: 0,
                          gap: { xs: '18px', md: '28px' },
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '20%',
                            background: isXsUp
                              ? 'linear-gradient(180deg, rgba(217, 217, 217, 0.00), rgba(241, 241, 241, 0.90))'
                              : 'none',
                            zIndex: 1,
                            borderRadius: '0 0 25px 25px',
                          },
                        }}
                        onClick={() => handleSkinChange(value)}
                      >
                        <Box
                          sx={{
                            position: { xs: 'relative', md: 'absolute' },
                            bottom: { md: '-30px' },
                            left: { md: '-34px' },
                            width: { xs: '78px', md: '80px' },
                            height: { xs: '78px', md: '80px' },
                            backgroundImage: `url(${icon})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            border: '1px solid black',
                            flexShrink: 0,
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            zIndex: 2,
                          }}
                        />
                        <FormControlLabel
                          value={value}
                          control={<Radio sx={{ display: 'none' }} />}
                          label={group}
                          sx={{
                            zIndex: 2,
                            colors: '#000',
                            textAlign: 'center',
                            fontFamily: 'DM Sans',
                            fontSize: { xs: '14px', md: '22px' },
                            fontWeight: 400,
                            lineHeight: '32px',
                            margin: 0,
                            textTransform: skin === value ? 'capitalize' : 'none',
                            '& .MuiTypography-root': {
                              fontWeight: 400,
                              width: { xs: '63px', md: '70px' },
                              fontSize: { xs: '14px', md: '16px' },
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          color: '#000',
                          textAlign: 'center',
                          fontFamily: 'Inter',
                          fontSize: { xs: '12px', md: '20px' },
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: 'normal',
                          textEdge: 'cap',
                          leadingTrim: 'both',
                        }}
                      >
                        {description}
                      </Typography>
                    </Box>
                  ))}
                </RadioGroup>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Button
              variant="contained"
              sx={{
                width: '143px',
                height: '40.857px',
                flexShrink: 0,
                borderRadius: '5px',
                background: '#602DEE',
                fontSize: '20px',
                color: '#FFF',
                '&:hover': {
                  background: '#333',
                },
              }}
              onClick={() =>
                skin ? setView('CaptureUpload') : setErrors((prev) => ({ ...prev, skin: 'Skin type is required' }))
              }
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {view === 'CaptureUpload' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '50px', md: '100px' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'space-between', md: 'center' },
            height: '100%',
            padding: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '20px', md: '100px' },
              alignItems: { xs: 'center', md: 'center' },
              justifyContent: { xs: 'center', md: 'center' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: '60px', md: '100px' },
              }}
            >
              <Typography sx={styles.heading}>
                {userKnowsSkinType === false 
                  ? 'Take a Photo for AI Skin Type Detection'
                  : 'Capture/ Upload Your Photo For Skin Analysis'
                }
              </Typography>

              {userKnowsSkinType === false && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    color: '#666',
                    fontSize: { xs: '14px', md: '16px' },
                    maxWidth: '500px'
                  }}
                >
                  Our AI will analyze your photo to determine your skin type automatically.
                  Make sure to take a clear, well-lit photo for the best results.
                </Typography>
              )}

              <Box sx={styles.inputContainer}>
                <RadioGroup
                  row
                  value={imgSelection}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: '60px', md: '100px' },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  {captureUpload.map(([group, icon, value], index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-end', md: 'flex-end' },
                        width: { xs: '150px', md: '170px' },
                        height: { xs: '180px', md: '205px' },
                        padding: { xs: '2px', md: '4px' },
                        borderRadius: '25px',
                        border: imgSelection === value ? '2.5px solid #FFC752' : '1.5px solid #717171',
                        backgroundColor: '#FBFFEB',
                        cursor: 'pointer',
                        backgroundSize: 'contain',
                        flexShrink: 0,
                        gap: { xs: '30px', md: '40px' },
                      }}
                      onClick={() => handleBoxClick(value)}
                    >
                      <Box
                        sx={{
                          width: { xs: '90px', md: '90px' },
                          height: { xs: '90px', md: '90px' },
                          backgroundImage: `url(${icon})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          flexShrink: 0,
                        }}
                      />
                      <FormControlLabel
                        value={value}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={group}
                        sx={{
                          zIndex: 2,
                          color: '#000',
                          textAlign: 'center',
                          fontFamily: 'DM Sans',
                          fontSize: { xs: '14px', md: '28px' },
                          fontWeight: 400,
                          lineHeight: '32px',
                          margin: 0,
                          textTransform: 'capitalize',
                          '& .MuiTypography-root': {
                            fontWeight: 400,
                            fontSize: { xs: '14px', md: '18px' },
                          },
                        }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default EnhancedQuestionnaire;
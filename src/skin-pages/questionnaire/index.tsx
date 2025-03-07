import { useEffect, useRef, useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, useTheme, useMediaQuery } from '@mui/material';
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
    'Sensitive skin develops when the skin’s protective barrier weakens, leading to irritation, redness, or dryness.',
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

const Questionnaire = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { view, setView, userInfo, setUserInfo, sessionId, setSessionId, setSnackbar, setCapturedPic } = useView();
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

    // if (!imgSelection.trim()) {
    //     newErrors.imgSelection = 'upload/capture is required.';
    //     valid = false;
    // }

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

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      if (handleValidation()) {
        setUserInfo({ skin, gender, age: String(age), name: '', email: userInfo.email, phone: userInfo.phone });
        setCapturedPic(file);
        setView('Details');
      }
    }
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      setUserInfo({ skin, gender, age: String(age), name: '', email: userInfo.email, phone: userInfo.phone });
      setView('PicCapture');
    }
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
              <Typography sx={styles.heading}>How do you identify yourself ?</Typography>

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
                        // height: '50px',
                        padding: { xs: '2px', md: '4px' },
                        borderRadius: '25px',
                        backgroundImage: `url(${icon})`,
                        border: gender === value ? '2.5px solid #98B727' : '1.5px solid #717171',
                        borderColor: errors.gender && '#d32f2f',
                        borderWidth: errors.gender && '3px',
                        // backgroundColor: gender === value ? '#FF6392' : '#FFF9FB',
                        cursor: 'pointer',
                        // transition: 'background-color 0.3s, border 0.3s',
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
                      {/* <Box
                                        sx={{
                                            width: { xs: '45px', md: '90px' },
                                            height: { xs: '45px', md: '90px' },
                                            backgroundImage: `url(${icon})`,
                                            backgroundSize: 'contain',
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: 'center',
                                            filter: gender === value ? 'invert(100%)' : 'none',
                                            flexShrink: 0
                                        }}
                                    /> */}
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
                    lineHeight: '32px', // 114.286%
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
              onClick={() => setView('SkinType')}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
      {view === 'SkinType' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '50px', md: '100px' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'space-between', md: 'center' },
            // height: "95vh",
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
                          // transition: 'background-color 0.3s, border 0.3s',
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
              <Typography sx={styles.heading}>Capture/ Upload Your Photo For Skin Analysis</Typography>

              <Box sx={styles.inputContainer}>
                <RadioGroup
                  row
                  value={imgSelection}
                  // onChange={(e) => handleImgSelection(e.target.value)}
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
                        // borderColor: errors.imgSelection && '#d32f2f',
                        // borderWidth: errors.imgSelection && "3px",
                        backgroundColor: '#FBFFEB',
                        cursor: 'pointer',
                        // transition: 'background-color 0.3s, border 0.3s',
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
          {/* <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Button
                    variant="contained"
                    sx={{
                        width: '143px',
                        height: '40.857px',
                        flexShrink: 0,
                        borderRadius: '5px',
                        background: '#000',
                        fontSize: '20px',
                        color: '#FFF',
                        '&:hover': {
                            background: '#333',
                        },
                    }}
                    onClick={handleSubmit}
                >
                    Next
                </Button>
            </Box> */}
        </Box>
      )}
    </>
  );
};

export default Questionnaire;

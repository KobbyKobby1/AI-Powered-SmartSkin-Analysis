import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import styles from '../../styles';
import { OutputScore, Product, useView } from '../../context';
import { useEffect, useState } from 'react';
import { ConcernDescriptions } from './concerns-description';
import CloseIcon from '@mui/icons-material/Close';

// interface Product {
//   name: string;
//   price: number;
//   image_url: string;
//   cat_sku_code: string;
//   is_image_available: boolean;
//   product_type: string;
//   variant_id: string;
//   description: string;
// }

export interface Recommendation {
  name: string;
  count: number;
  products: Product[];
}

const colorPriority = [
  ['#FF6961', 'Need Attention'],
  ['#FFB347', 'Average'],
  ['#00FF00', 'Good'],
];

const Recommendation = () => {
  const { outputScore, recommendations, fallbackProductImage } = useView();
  const [skinOutput, setSkinOutput] = useState<OutputScore[]>([]);
  const [skinHealth, setSkinHealth] = useState<number>(0);
  const [selectedConcernTitle, setSelectedConcernTitle] = useState<string>('');
  const [selectedConcernDescription, setSelectedConcernDescription] = useState<string>('');
  const [openConcernDialog, setOpenConcernDialog] = useState<boolean>(false);
  // const [addedToCart, setAddedToCart] = useState<any>({});
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [missingColors, setMissingColors] = useState<any[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [selecteData, setSelectedData] = useState<Recommendation>();
  const handleSelection = (value: string) => {
    setSelectedConcern(value);
  };
  // const [updatedPrices, setUpdatedPrices] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const productsResponse = await fetch("/products.json?limit=250");
  //       const productsData = await productsResponse.json();
  //       const allProducts = productsData.products;

  //       recommendations[0].products.forEach((recommendationProduct) => {
  //         for (const product of allProducts) {
  //           const matchingVariant = product.variants.find(
  //             (variant: any) => variant.id === Number(recommendationProduct.variant_id)
  //           );
  //           if (matchingVariant) {
  //             recommendationProduct.price = matchingVariant.price;
  //             break;
  //           }
  //         }
  //       });

  //       setUpdatedPrices(recommendations[0].products);

  // console.log("Updated Recommendations:", recommendations[0].products);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const handleAddToCart = async (variant_id: string) => {
  //   try {
  // const productsResponse = await fetch(`/products/${variant_id}.json`);
  // const productsData = await productsResponse.json();
  // console.log(productsData);
  // const products = productsData.products;

  // const product = products.find((p: { id: number }) => p.id === Number(cat_sku_code));

  // if (!product) {
  //   console.error(`Product with id ${cat_sku_code} not found`);
  //   setSnackbar({
  //     snackbarOpen: true,
  //     snackbarMessage: 'Product not found',
  //     snackbarSeverity: "error"
  //   });
  //   return;
  // }

  // const productId = product.variants[0].id;

  // const variantArray = products.map((product) => ({
  //   id: product.variant_id,
  //   quantity: 1,
  // }));

  // const formData = {
  //   items: [{
  //     id: variant_id,
  //     quantity: 1,
  //   }],
  // };

  // try {
  //   const response = await fetch('/cart/add.js', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(formData)
  //   });

  //   if (response.ok) {
  //     console.log("added product to cart");
  // setSnackbar({
  //       snackbarOpen: true,
  //       snackbarMessage: '',
  //       snackbarSeverity: "success"
  //     });
  //         setAddedToCart((prevState: any) => ({
  //           ...prevState,
  //           [variant_id]: true
  //         }));
  //         const data = await response.json();
  //         console.log(data);
  //       } else {
  //         console.error('Error: Failed to add product to cart');
  //       }
  //     } catch (error) {
  //       console.error('Error occurred while adding product to cart:', error);
  //     }

  //   } catch (error) {
  //     console.error('Error occurred while adding product to cart:', error);
  //   }
  // };

  // const handleRoutineToCart = async (products: Product[]) => {
  //   try {
  // const productsResponse = await fetch('/products.json?limit=250');
  // const productsData = await productsResponse.json();
  // const products = productsData.products;

  // const product = products.find((p: { id: number }) => p.id === Number(cat_sku_code));

  // if (!product) {
  //   console.error(`Product with id ${cat_sku_code} not found`);
  //   setSnackbar({
  //     snackbarOpen: true,
  //     snackbarMessage: 'Product not found',
  //     snackbarSeverity: "error"
  //   });
  //   return;
  // }

  // const productId = product.variants[0].id;

  // const variantArray = products.map((product) => ({
  //   id: product.variant_id,
  //   quantity: 1,
  // }));

  // const formData = {
  //   items: variantArray
  // };

  // try {
  //   const response = await fetch('/cart/add.js', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(formData)
  //   });

  //   if (response.ok) {
  //     console.log("added routine to cart");
  // setSnackbar({
  //       snackbarOpen: true,
  //       snackbarMessage: '',
  //       snackbarSeverity: "success"
  //     });
  // setAddedToCart((prevState: any) => ({
  //   ...prevState,
  //   [variant_id]: true
  // }));
  //         const data = await response.json();
  //         console.log(data);
  //       } else {
  //         console.error('Error: Failed to add all product to cart');
  //       }
  //     } catch (error) {
  //       console.error('Error occurred while adding product to cart:', error);
  //     }

  //   } catch (error) {
  //     console.error('Error occurred while adding product to cart:', error);
  //   }
  // };

  const getBoxStyles = (color: string) => {
    switch (color) {
      case '#00FF00':
        return {
          borderRadius: { md: '20px', xs: '15px' },
          border: '2px solid #51A351',
          backgroundColor: '#7D7',
        };
      case '#FFB347':
        return {
          borderRadius: { md: '20px', xs: '15px' },
          border: '2px solid #C6872F',
          backgroundColor: '#FFB347',
        };
      case '#FF6961':
        return {
          borderRadius: { md: '20px', xs: '15px' },
          border: '2px solid #C53E37',
          backgroundColor: '#FF6961',
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    const colorPriority = ['#FF6961', '#FFB347', '#00FF00'];
    setSkinHealth(outputScore.find((item) => item.name === 'skin_health')?.value || 0);
    const sortedOutputScore = outputScore
      .filter((item) => item.name !== 'skin_health')
      .sort((a, b) => {
        if (a.color !== b.color) {
          const colorA = colorPriority.indexOf(a.color);
          const colorB = colorPriority.indexOf(b.color);

          return colorA - colorB;
        }
        return a.value - b.value;
      });

    setSkinOutput(sortedOutputScore);

    setSelectedConcern(recommendations[0].name);

    const availableColors = sortedOutputScore.map((item) => item.color);
    const unavailableColors = colorPriority.filter((color) => !availableColors.includes(color));
    console.log(unavailableColors);
    setMissingColors(unavailableColors);

    const firstConcern = sortedOutputScore[0].name;
    const firstConcernDescription = ConcernDescriptions.find((cd) => cd.id === firstConcern);
    setSelectedConcernTitle(firstConcernDescription?.heading || '');
    setSelectedConcernDescription(firstConcernDescription?.description || '');
  }, []);

  const showConcernDescription = (concern: string) => {
    const concernDescription = ConcernDescriptions.find((cd) => cd.id === concern);
    setSelectedConcernTitle(concernDescription?.heading || '');
    setSelectedConcernDescription(concernDescription?.description || '');
    isXs && setOpenConcernDialog(true);
  };

  useEffect(() => {
    const res = recommendations.find((cd) => cd.name === selectedConcern);
    setSelectedData(res);
  }, [selectedConcern]);

  // const collectFeedback = () => {
  //   const customEvent = new CustomEvent("skinAnalysisClose", {
  //     bubbles: true, // Allows the event to propagate upwards
  //   });
  //   document.dispatchEvent(customEvent);
  //   clear();
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: '20px', md: '50px' },
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: { xs: 'space-around', md: 'flex-start' },
        padding: '16px',
      }}
    >
      <Dialog open={openConcernDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {selectedConcernTitle}
        </DialogTitle>
        <IconButton
          aria-label="close"
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
          onClick={() => setOpenConcernDialog(false)}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{selectedConcernDescription}</DialogContent>
      </Dialog>
      {/* <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <Typography sx={{ ...styles.heading, width: "100%", textAlign: "center" }}>Here is Your Skin Analysis Report</Typography>
      </Box> */}
      <Box sx={styles.inputContainer}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '42%',
              display: { md: 'flex', xs: 'none' },
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'left',
              gap: '10px',
            }}
          >
            <Typography sx={{ ...styles.subHeading, width: '100%', paddingBottom: '30px', fontWeight: 600 }}>
              Your Skin Health Score - {skinHealth}%
            </Typography>
            <Typography sx={{ ...styles.subHeading, width: '100%', paddingBottom: '0' }}>
              {selectedConcernTitle}
            </Typography>
            <Box sx={{ borderTop: '2px dotted #000', width: '100%' }} />
            <Typography
              sx={{
                color: 'rgba(0, 0, 0, 0.90)',
                fontFamily: 'Neue Montreal',
                fontSize: '22px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '28px',
                leadingTrim: 'both',
                textEdge: 'cap',
              }}
            >
              {selectedConcernDescription}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '50px',
                paddingTop: '50px',
              }}
            >
              <Box sx={{ ...styles.rangeBox, border: '2px solid #C53E37', background: '#FF6961' }}>
                <Typography
                  sx={{
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: 'Neue Montreal',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                >
                  Need attention
                </Typography>
                <Typography
                  sx={{
                    color: '#000',
                    fontFamily: 'Neue Montreal',
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '42px',
                    leadingTrim: 'both',
                    textEdge: 'cap',
                  }}
                >
                  0-39
                </Typography>
              </Box>
              <Box sx={{ ...styles.rangeBox, border: '2px solid #C6872F', background: '#FFB347' }}>
                <Typography
                  sx={{
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: 'Neue Montreal',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                >
                  Average
                </Typography>
                <Typography
                  sx={{
                    color: '#000',
                    fontFamily: 'Neue Montreal',
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '42px',
                    leadingTrim: 'both',
                    textEdge: 'cap',
                  }}
                >
                  40-79
                </Typography>
              </Box>
              <Box sx={{ ...styles.rangeBox, border: '2px solid #51A351', background: '#7D7' }}>
                <Typography
                  sx={{
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: 'Neue Montreal',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                >
                  Good
                </Typography>
                <Typography
                  sx={{
                    color: '#000',
                    fontFamily: 'Neue Montreal',
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '42px',
                    leadingTrim: 'both',
                    textEdge: 'cap',
                  }}
                >
                  80-100
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '53%' } }}>
            {/* <Typography sx={{ ...styles.subHeading, textAlign: "left", width: "100%", paddingX: { xs: "20px", md: "0" } }}>Your main concerns:</Typography> */}
            <Box
              sx={{
                width: { xs: '100vw', md: '100%' },
                overflowX: 'auto',
                overflowY: 'hidden',
              }}
            >
              <Typography
                sx={{
                  display: { md: 'none' },
                  ...styles.subHeading,
                  width: '100%',
                  paddingBottom: '30px',
                  fontWeight: 700,
                }}
              >
                Your Skin Health Score - {skinHealth}%
              </Typography>

              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: { xs: '30px', md: '50px' },
                  paddingBottom: '50px',
                }}
              >
                <Box sx={{ ...styles.rangeBox, border: '2px solid #C53E37', background: '#FF6961' }}>
                  <Typography
                    sx={{
                      color: '#000',
                      textAlign: 'center',
                      fontFamily: 'Neue Montreal',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                    }}
                  >
                    Need attention
                  </Typography>
                  <Typography
                    sx={{
                      color: '#000',
                      fontFamily: 'Neue Montreal',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px',
                      leadingTrim: 'both',
                      textEdge: 'cap',
                    }}
                  >
                    0-39
                  </Typography>
                </Box>
                <Box sx={{ ...styles.rangeBox, border: '2px solid #C6872F', background: '#FFB347' }}>
                  <Typography
                    sx={{
                      color: '#000',
                      textAlign: 'center',
                      fontFamily: 'Neue Montreal',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                    }}
                  >
                    Average
                  </Typography>
                  <Typography
                    sx={{
                      color: '#000',
                      fontFamily: 'Neue Montreal',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px',
                      leadingTrim: 'both',
                      textEdge: 'cap',
                    }}
                  >
                    40-79
                  </Typography>
                </Box>
                <Box sx={{ ...styles.rangeBox, border: '2px solid #51A351', background: '#7D7' }}>
                  <Typography
                    sx={{
                      color: '#000',
                      textAlign: 'center',
                      fontFamily: 'Neue Montreal',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                    }}
                  >
                    Good
                  </Typography>
                  <Typography
                    sx={{
                      color: '#000',
                      fontFamily: 'Neue Montreal',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px',
                      leadingTrim: 'both',
                      textEdge: 'cap',
                    }}
                  >
                    80-100
                  </Typography>
                </Box>
              </Box>

              {isXs ? (
                colorPriority
                  .filter((a) => !missingColors.includes(a[0]))
                  .map((item, index) => (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
                        <Box sx={{ borderTop: '2px dotted #000', width: '100%' }} />
                        <Typography
                          sx={{
                            color: '#000',
                            textAlign: 'center',
                            fontFamily: '"Neue Montreal"',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            lineHeight: 'normal',
                            letterSpacing: '0.32px',
                            paddingX: '8px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item[1]}
                        </Typography>
                        <Box sx={{ borderTop: '2px dotted #000', width: '100%' }} />
                      </Box>
                      <Box
                        key={index}
                        sx={{
                          display: { xs: 'grid', md: 'grid' },
                          flexDirection: 'row',
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          gridTemplateColumns: {
                            xs: 'repeat(3, 1fr)',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                            xl: 'repeat(4, 1fr)',
                          },
                          justifyItems: 'center',
                          gap: { xs: '20px', md: '35px' },
                          paddingX: { xs: '10px', md: '20px' },
                          paddingBottom: '40px',
                          '&::-webkit-scrollbar': {
                            display: 'none',
                          },
                        }}
                      >
                        {skinOutput &&
                          skinOutput
                            .filter((a) => a.color === item[0])
                            .map((issue, index) => (
                              <Box
                                key={index}
                                sx={{
                                  boxSizing: 'content-box',
                                  width: { xs: '80px', md: '125px' },
                                  height: { xs: '70px', md: '105px' },
                                  ...getBoxStyles(issue.color),
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: { md: '10px', xs: '3px' },
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: '#000',
                                    textAlign: 'center',
                                    fontSize: { xs: '12px', md: '16px' },
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: { md: '20px', xs: '12px' },
                                  }}
                                >
                                  {ConcernDescriptions.find((cd) => cd.id === issue.name)?.heading}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#000',
                                    fontSize: { xs: '18px', md: '28px' },
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    textEdge: 'cap',
                                    leadingTrim: 'both',
                                  }}
                                >
                                  {issue.value}%
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#000',
                                    fontSize: { xs: '10px', md: '10px' },
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    textDecorationLine: 'underline',
                                    textDecorationStyle: 'solid',
                                    textDecorationSkipInk: 'none',
                                    textDecorationThickness: 'auto',
                                    textUnderlineOffset: 'auto',
                                    textUnderlinePosition: 'from-font',
                                    padding: 0,
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    showConcernDescription(issue.name);
                                  }}
                                >
                                  Read More
                                </Typography>
                              </Box>
                            ))}
                      </Box>
                    </Box>
                  ))
              ) : (
                <Box
                  sx={{
                    display: { xs: 'grid', md: 'grid' },
                    flexDirection: 'row',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    gridTemplateColumns: {
                      xs: 'repeat(3, 1fr)',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                      xl: 'repeat(4, 1fr)',
                    },
                    justifyItems: 'center',
                    gap: '22px',
                    paddingX: { xs: '10px', md: '20px' },
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {skinOutput &&
                    skinOutput.map((issue, index) => (
                      <Box
                        key={index}
                        sx={{
                          boxSizing: 'content-box',
                          width: { xs: '80px', md: '125px' },
                          height: { xs: '70px', md: '105px' },
                          ...getBoxStyles(issue.color),
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: { md: '10px', xs: '3px' },
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#000',
                            textAlign: 'center',
                            fontSize: { xs: '12px', md: '16px' },
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: { md: '20px', xs: '12px' },
                          }}
                        >
                          {ConcernDescriptions.find((cd) => cd.id === issue.name)?.heading}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#000',
                            fontSize: { xs: '18px', md: '28px' },
                            fontStyle: 'normal',
                            fontWeight: 500,
                            textEdge: 'cap',
                            leadingTrim: 'both',
                          }}
                        >
                          {issue.value}%
                        </Typography>
                        <Typography
                          sx={{
                            color: '#000',
                            fontSize: { xs: '10px', md: '10px' },
                            fontStyle: 'normal',
                            fontWeight: 400,
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid',
                            textDecorationSkipInk: 'none',
                            textDecorationThickness: 'auto',
                            textUnderlineOffset: 'auto',
                            textUnderlinePosition: 'from-font',
                            padding: 0,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            showConcernDescription(issue.name);
                          }}
                        >
                          Read More
                        </Typography>
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={styles.inputContainer}>
        <Typography sx={{ ...styles.subHeading, textAlign: 'left', width: '100%', paddingX: { xs: '20px', md: '0' } }}>
          Recommended products for your skin concerns
        </Typography>
        <Box sx={{ width: { xs: '100vw', md: '100%' }, overflowX: 'auto', overflowY: 'hidden' }}>
          <FormControl component="fieldset">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                padding: { xs: '10px 20px ', md: '0' },
              }}
            >
              {recommendations.map((item) => (
                <Box
                  key={item.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: { xs: '6px 16px', md: '8px 18px', lg: '10px 20px', xl: '10px 30px' },
                    borderRadius: '10px',
                    border: selectedConcern === item.name ? 'none' : '2px solid #000000',
                    backgroundColor: selectedConcern === item.name ? '#602DEE' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                    margin: { xs: '4px 10px 4px 0', md: '4px 20px 4px 0', lg: '4px 30px 4px 0' },
                    gap: { xs: '12px', md: '14px', lg: '16px', xl: '18px' },
                  }}
                  onClick={() => handleSelection(item.name)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedConcern === item.name}
                        onChange={() => handleSelection(item.name)}
                        sx={{ display: 'none' }}
                      />
                    }
                    label={ConcernDescriptions.find((cd) => cd.id === item.name)?.heading || item.name}
                    sx={{
                      color: selectedConcern === item.name ? '#FFFFFF' : '#000000',
                      textAlign: 'center',
                      fontSize: { xs: '12px', md: '14px', lg: '18px', xl: '20px' },
                      fontWeight: selectedConcern === item.name ? 500 : 400,
                      lineHeight: '19px',
                      margin: 0,
                      '& .MuiTypography-root': {
                        fontWeight: selectedConcern === item.name ? 500 : 400,
                        fontSize: { xs: '12px', md: '12px', lg: '14px', xl: '16px' },
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </FormControl>

          <Box
            sx={{
              display: { xs: 'grid', md: 'flex' },
              gridTemplateColumns: 'repeat(2, 1fr)',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              overflowX: 'auto',
              overflowY: 'hidden',
              flexWrap: 'wrap',
              gap: { xs: '18px', md: '35px' },
              paddingTop: { xs: '20px', md: '40px' },
              paddingX: { xs: '20px', md: '0' },
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {selecteData &&
              selecteData.products.map((product, index) => (
                <Box key={index} sx={{ margin: { xs: 'auto', md: 0 } }}>
                  {/* <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "DM Sans",
                    fontSize: { xs: "12px", md: "24px" },
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "32px",
                    textAlign: "center",
                    "&::first-letter": {
                      color: "#000",
                      textAlign: "center",
                      fontFamily: "DM Sans",
                      fontSize: { xs: "20px", md: "30px" },
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "32px",
                    },
                  }}
                >
                  {product.product_type}
                </Typography> */}
                  <Box sx={styles.productContainer}>
                    <Box
                      id="Sample Image"
                      sx={{
                        backgroundImage: product.is_image_available
                          ? `url('${product.image_url}')`
                          : `url('${fallbackProductImage}')`,
                        width: { xs: '100px', md: '320px' },
                        height: { xs: '100px', md: '320px' },
                        flexShrink: 0,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#464646',
                        textAlign: 'center',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: { xs: '10px', md: '22px' },
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        display: '-webkit-box',
                      }}
                    >
                      {product.name}
                    </Typography>

                    {/* <Typography
                    sx={{
                      color: '#464646',
                      textAlign: 'center',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: { xs: "8px", md: '18px' },
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: 'normal',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      display: '-webkit-box',
                    }}
                  >
                    {product.description}
                  </Typography> */}
                    {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
                    {/* <Typography
                    sx={{
                      color: '#464646',
                      textAlign: 'center',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '13px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                      textDecorationLine: 'line-through',
                      marginRight: '8px',
                    }}
                  >
                    ₹2,250
                  </Typography> */}
                    {/* <Typography
                      sx={{
                        color: '#464646',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: { xs: "10px", md: '19px' },
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: 'normal',
                      }}
                    >
                      ₹{product.price}
                    </Typography>
                  </Box> */}
                    <Button
                      id="add-to-cart"
                      // disabled={addedToCart[product.variant_id]}
                      // onClick={() => handleAddToCart(product.variant_id)}
                      onClick={() => window.open(product.product_url, '_blank')}
                      sx={{
                        ...styles.addToCartButton,
                        // background: addedToCart[product.variant_id] ? "#EBEBE4 !important" : "#602DEE",
                      }}
                    >
                      BUY NOW
                      {/* {addedToCart[product.variant_id] ? "ADDED TO CART" : "ADD TO CART"} */}
                    </Button>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      {/* <Box sx={{
        display: "flex",
        width: "100%",
        flexDirection: { "xs": "column", "md": "row" },
        gap: { "xs": "10px", "md": "50px" },
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Button
          variant="contained"
          onClick={() => handleRoutineToCart(recommendations[0].products)}
          sx={{
            minWidth: '143px',
            height: '40.857px',
            flexShrink: 0,
            borderRadius: '5px',
            background: '#602DEE',
            fontSize: { xs: "12px", md: '20px' },
            color: '#FFF',
            border: "1px solid #000",
            padding: '0px 16px',
            "&:focus": {
              outline: "none",
            }
          }}
        >
          ADD ALL PRODUCTS
        </Button> */}

      {/* <Button
          variant="contained"
          sx={{
            width: '143px',
            height: '40.857px',
            flexShrink: 0,
            borderRadius: '5px',
            background: '#000',
            fontSize: { xs: "12px", md: '20px' },
            color: '#FFF',
            padding: '0px 24px',
            '&:hover': {
              background: '#333',
            }
          }}
        // onClick={collectFeedback}
        >
          NEXT
        </Button> */}
      {/* </Box> */}
    </Box>
    // <Box
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     gap: {xs: "20px", md: "28px" },
    //     alignItems: {xs: "center", md: "flex-start" },
    //     justifyContent: {xs: "center", md: "flex-start" },
    //     padding: "16px"
    //   }}>
    //   <Typography sx={styles.heading}>Skin Analysis Report</Typography>

    //   <Box>
    //     <Button
    //       id="add-to-cart"
    //       onClick={() => handleAddToCart(productId)}
    //       sx={{
    //         padding: '10px 20px',
    //         marginTop: '20px',
    //         fontSize: '16px',
    //         cursor: 'pointer',
    //         backgroundColor: '#007bff',
    //         color: 'white',
    //       }}
    //     >
    //       Add to Cart
    //     </Button>
    //   </Box>
    // </Box>
  );
};

export default Recommendation;

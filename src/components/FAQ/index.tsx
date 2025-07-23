'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Styled Accordion with modern elevation, rounded corners, and hover effect
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: '#FAE1BD', // soft warm tone
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e8d1a0',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
  },
}));

// Styled Summary with branding color and strong visual contrast
const StyledAccordionSummary = styled(AccordionSummary)(({ }) => ({
  backgroundColor: '#F2C185',
  padding: '18px 24px',
  fontWeight: 600,
  fontSize: '1.05rem',
  color: '#2F2F2F',
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

// AccordionDetails with soft background and comfortable reading experience
const StyledAccordionDetails = styled(AccordionDetails)(({ }) => ({
  backgroundColor: '#fff9f1',
  padding: '20px 24px',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  color: '#4B4B4B',
}));

const Faq = () => {
  const faqs = [
    {
      question: 'What is Smartskin Africa?',
      answer:
        'Smartskin Africa is an AI-powered skincare analysis platform redefining modern beauty routine. With a simple selfie and face scan, our cutting-edge technology analyzes key skin parameters including acne, texture, tone, wrinkles, and hydration levels—to deliver personalized skincare recommendations.',
    },
    {
      question: 'How does Smartskin Africa platform work?',
      answer:
        'You simply select your gender, age, and skin type, then take a selfie or upload a photo. Our AI assesses your skin’s health and generates a detailed report with insights and recommendations.',
    },
    {
      question: 'Is SmartSkin Africa only for people with skin problems?',
      answer:
        'No, it’s for everyone! Whether you want to understand your skin better or maintain healthy skin, Smartskin Africa offers tailored advice.',
    },
    {
      question: 'How accurate is the AI skin analysis?',
      answer:
        'Our AI is trained on diverse African skin tones to ensure high accuracy. While reliable, it’s not a replacement for medical advice from dermatologists.',
    },
    {
      question: 'What skin concerns does the platform analyze?',
      answer:
        'It detects acne, dullness, dark spots, wrinkles, sagging, dryness, uneven tone, redness, and more.',
    },
    {
      question: 'Can Smartskin Africa track my skin’s progress over time?',
      answer:
        'Yes! You can monitor changes and assess how recommended routines and products are working for you.',
    },
    {
      question: 'How does Smartskin Africa recommend products?',
      answer:
        'Our AI factors in your skin type, age, gender, and climate to suggest personalized skincare products.',
    },
    {
      question: 'Does the platform recommend only African skincare brands?',
      answer:
        'We highlight African brands, but also include foreign products made for African skin.',
    },
    {
      question: 'Can I buy products directly from Smartskin Africa?',
      answer:
        'We connect you to trusted retailers and brands where you can buy the recommended products.',
    },
    {
      question: 'Does Smartskin Africa recommend skincare routines as well?',
      answer:
        'Yes. Our platform offers full routines curated by skincare experts, tailored to your profile.',
    },
    {
      question: 'Can I consult a dermatologist or skincare specialist through the platform?',
      answer:
        'Yes. You can book virtual or in-person consultations with our listed experts.',
    },
    {
      question: 'Is there a community where users can share skincare experiences?',
      answer:
        'Absolutely! Our social platform encourages shared tips, reviews, and progress stories.',
    },
    {
      question: 'Is Smartskin Africa accessible to people in rural areas?',
      answer:
        'Yes. Our lightweight, mobile-friendly platform ensures access even in remote areas.',
    },
    {
      question: 'Is the service affordable?',
      answer:
        'Yes! We offer competitive pricing and free skincare advice via our social media. We also bundle deals and offer discounts through partners.',
    },
    {
      question: 'Will my skin analysis data be shared with third parties?',
      answer:
        'Never. Your personal data is secure and will not be shared without your consent.',
    },
    {
      question: 'Who can use Smartskin Africa?',
      answer:
        'Everyone — students, professionals, rural and urban users, and people of all genders.',
    },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        background: 'linear-gradient(to bottom, #f6f9f9, #fff7ed)',
        padding: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight={700}
            fontSize={{ xs: 28, md: 36 }}
            sx={{ color: '#2D2D2D' }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <StyledAccordion key={index}>
              <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#2F2F2F' }} />}
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
              >
                <Typography>{faq.question}</Typography>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <Typography>{faq.answer}</Typography>
              </StyledAccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      </Container>
    </Container>
  );
};

export default Faq;
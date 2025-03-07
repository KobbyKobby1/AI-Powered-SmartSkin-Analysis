'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: 4,
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#EDCFA0',
  color: theme.palette.getContrastText(theme.palette.primary.light),
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

const Faq = () => {
  const faqs = [
    {
      question: 'What is Smartskin Africa?',
      answer:
        'Smartskin Africa is an AI-powered skincare analysis platform redefining modern beauty routine. With a simple selfie and face scan, our cutting-edge technology analyzes key skin parameters including acne, texture, tone, wrinkles, and hydration levels—to deliver personalized skincare recommendations. By providing tailored advice and product suggestions, Smartskin Africa empowers users to achieve healthier, more radiant skin with precision and ease.',
    },
    {
      question: 'How does Smartskin Africa platform work?',
      answer:
        'The platform allows you to simply select your gender, age and skin type, then take a selfie or upload a photo for analysis. Our advanced AI will assess your skin’s health and generate a detailed report with insights and personalized skincare recommendations.',
    },
    {
      question: 'Is SmartSkin Africa only for people with skin problems?',
      answer:
        'No, Smartskin Africa is for everyone! Whether you have specific skin concerns, or you want to understand your skin better or simply wish to maintain healthy skin, our platform provides valuable insights and recommendations.',
    },
    {
      question: 'How accurate is the AI skin analysis?',
      answer:
        'Our AI is trained on a diverse dataset of African skin tones to ensure highly accurate diagnostics. While it provides reliable insights, it does not replace professional dermatological consultations for medical conditions.',
    },
    {
      question: 'What skin concerns does the platform analyze?',
      answer:
        'Smartskin Africa detects and analyzes conditions such as acne, dullness, dark spots, wrinkles, hyperpigmentation, saggy skin, dryness, dark circles, crow’s feet, redness, lack of smoothness, lack of texture, and uneven skin tone.',
    },
    {
      question: 'Can Smartskin Africa track my skin’s progress over time?',
      answer:
        'Yes! Our platform allows you to monitor changes in your skin and track the effectiveness of recommended products and routines.',
    },
    {
      question: 'How does Smartskin Africa recommend products?',
      answer:
        'Our AI considers factors such as your gender, age, skin type, skin health, and geographical climate to provide personalized product recommendations.',
    },
    {
      question: 'Does the platform recommend only African skincare brands?',
      answer:
        'We prioritize African-made skincare brands but also recommend foreign-made skincare products designed for African skin.',
    },
    {
      question: 'Can I buy products directly from Smartskin Africa?',
      answer:
        'While we do not manufacture skincare products, we connect you to trusted retailers and brands where you can purchase AI recommended items.',
    },
    {
      question: 'Does Smartskin Africa recommend skincare routines as well?',
      answer:
        'Yes! In addition to personalized product suggestions, our social media platform offers expert-curated skincare routines tailored to different skin types, helping users achieve their best skin.',
    },
    {
      question: 'Can I consult a dermatologist or skincare specialist through the platform?',
      answer:
        'Yes! We have integrated a database of dermatologists, estheticians, and skincare specialists, allowing users to book virtual or in-person consultations.',
    },
    {
      question: 'Is there a community where users can share skincare experiences?',
      answer:
        'Absolutely! Our social media platforms encourage users to share reviews, experiences, and feedback on skincare tips, fostering a supportive skincare community.',
    },
    {
      question: 'Is Smartskin Africa accessible to people in rural areas?',
      answer:
        'Yes! Our user-friendly platform makes skin health recommendations accessible to users in remote areas without the need to travel to urban centers for basic skincare guidance.',
    },
    {
      question: 'Is the service affordable?',
      answer:
        'Absolutely! Our services are competitively priced, and we go even further by offering free expert skincare tips on our social media platforms. Additionally, we collaborate with brands and professionals to provide exclusive discounts and bundled packages, ensuring exceptional value for money.',
    },
    {
      question: 'Will my skin analysis data be shared with third parties?',
      answer: 'No. Your data is private and secure. We do not share personal information with third parties.',
    },
    {
      question: 'Who can use Smartskin Africa?',
      answer:
        'Everybody! Our platform is designed for young professionals, students, urban dwellers, and even rural populations with limited access to dermatologists. We also cater to men, as awareness of men’s skincare is growing.',
    },
  ];

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#f6f9f9', padding: { xs: 0, md: 5 } }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Typography variant="h4" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <StyledAccordion key={index}>
              <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
              >
                <Typography>{faq.question}</Typography>
              </StyledAccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      </Container>
    </Container>
  );
};

export default Faq;

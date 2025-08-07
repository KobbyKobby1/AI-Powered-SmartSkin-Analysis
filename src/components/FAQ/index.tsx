// src/components/FAQ/index.tsx
'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const StyledAccordion = styled(Accordion)({
  marginBottom: '20px',
  borderRadius: '24px !important',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
  border: '2px solid transparent',
  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(229, 188, 118, 0.3), rgba(0, 121, 107, 0.2)) border-box',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(229, 188, 118, 0.6), rgba(0, 121, 107, 0.4)) border-box',
  },
  '&:before': { display: 'none' },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  backgroundColor: '#ffffff',
  padding: '20px 24px',
  fontWeight: 600,
  fontSize: '1.1rem',
  color: '#1a1a1a',
  '& .MuiAccordionSummary-content': { margin: 0 },
  '& .MuiAccordionSummary-expandIconWrapper': { color: '#00796B' },
});

const StyledAccordionDetails = styled(AccordionDetails)({
  backgroundColor: '#ffffff',
  padding: '0 24px 24px 24px',
  fontSize: '1rem',
  lineHeight: 1.7,
  color: '#666',
});

const Faq = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [faqsVisible, setFaqsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setContentVisible(true), 200);
          setTimeout(() => setFaqsVisible(true), 400);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: 'What is Smartskin Africa?',
      answer: 'Smartskin Africa is an AI-powered skincare analysis platform redefining modern beauty routine. With a simple selfie and face scan, our cutting-edge technology analyzes key skin parameters including acne, texture, tone, wrinkles, and hydration levels—to deliver personalized skincare recommendations.',
    },
    {
      question: 'How does Smartskin Africa platform work?',
      answer: 'You simply select your gender, age, and skin type, then take a selfie or upload a photo. Our AI assesses your skins health and generates a detailed report with insights and recommendations.',
    },
    {
      question: 'Is SmartSkin Africa only for people with skin problems?',
      answer: 'No, itis for everyone! Whether you want to understand your skin better or maintain healthy skin, Smartskin Africa offers tailored advice.',
    },
    {
      question: 'How accurate is the AI skin analysis?',
      answer: 'Our AI is trained on diverse African skin tones to ensure high accuracy. While reliable, it is not a replacement for medical advice from dermatologists.',
    },
    {
      question: 'What skin concerns does the platform analyze?',
      answer: 'It detects acne, dullness, dark spots, wrinkles, sagging, dryness, uneven tone, redness, and more.',
    },
    {
      question: 'Can Smartskin Africa track my skins progress over time?',
      answer: 'Yes! You can monitor changes and assess how recommended routines and products are working for you.',
    },
    {
      question: 'How does Smartskin Africa recommend products?',
      answer: 'Our AI factors in your skin type, age, gender, and climate to suggest personalized skincare products.',
    },
    {
      question: 'Does the platform recommend only African skincare brands?',
      answer: 'We highlight African brands, but also include foreign products made for African skin.',
    },
  ];

  return (
    <Container maxWidth={false} sx={{ background: '#fafbfc', padding: { xs: '60px 0', md: '120px 0' } }}>
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, md: 6 } }} ref={sectionRef}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Box
              sx={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                margin: '0 auto 40px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformOrigin: 'center',
              }}
            />
            
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '32px', md: '42px' },
                fontWeight: 700,
                lineHeight: { xs: '40px', md: '50px' },
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                mb: 3,
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.1s',
              }}
            >
              Frequently Asked{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Questions
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '16px', md: '18px' },
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: { xs: '24px', md: '28px' },
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.2s',
              }}
            >
              Everything you need to know about Smartskin Africa and how our AI-powered platform can transform your skincare routine.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <Box
                key={index}
                sx={{
                  opacity: faqsVisible ? 1 : 0,
                  transform: faqsVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${0.1 * index}s`,
                }}
              >
                <StyledAccordion>
                  <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '16px', md: '18px' } }}>
                      {faq.question}
                    </Typography>
                  </StyledAccordionSummary>
                  <StyledAccordionDetails>
                    <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, lineHeight: 1.7 }}>
                      {faq.answer}
                    </Typography>
                  </StyledAccordionDetails>
                </StyledAccordion>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default Faq;
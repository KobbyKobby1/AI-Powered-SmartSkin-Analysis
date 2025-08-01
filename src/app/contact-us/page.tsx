'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect, useRef } from 'react';
import { PaymentApi } from '../../payment-api';

const schema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^\d+$/, 'Phone number must be digits only').notRequired(),
  message: yup.string().required('Message is required').min(10, 'Message should be at least 10 characters'),
});

function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setInfoVisible(true), 200);
          setTimeout(() => setFormVisible(true), 400);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setSuccessMessage('');

    try {
      const api = new PaymentApi();
      const { fullName, email, phone, message } = data;
      await api.sendContactForm(fullName, email, phone, message);

      setSuccessMessage('Your message has been sent successfully!');
      reset();
    } catch (error) {
      console.error(error);
      setSuccessMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { label: 'Email', value: 'support@smartskinafrica.com' },
    { label: 'Info Email', value: 'info@smartskinafrica.com' },
    { label: 'Phone', value: '+233 55 059 0714' },
    { label: 'Address', value: 'S-03 First Floor, Friendly Heights Building, Mahama Road, Tse Addo, Accra – Ghana' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Box ref={sectionRef}>
        {/* Header */}
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
            variant="h3" 
            component="h1"
            sx={{
              fontSize: { xs: '32px', md: '42px' },
              fontWeight: 700,
              lineHeight: { xs: '40px', md: '50px' },
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              mb: 3,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.1s',
            }}
          >
            Contact{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Us
            </Box>
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{
              fontSize: { xs: '16px', md: '18px' },
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: { xs: '24px', md: '28px' },
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.2s',
            }}
          >
            Have questions or need assistance? We're here to help! Please fill out the form below and we'll get back to
            you shortly.
          </Typography>
        </Box>

        <Grid2 container spacing={{ xs: 4, md: 8 }}>
          {/* Contact Information */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                opacity: infoVisible ? 1 : 0,
                transform: infoVisible ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.3s',
              }}
            >
              <Typography 
                variant="h4" 
                sx={{
                  fontSize: { xs: '24px', md: '28px' },
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 4,
                }}
              >
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: '20px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      opacity: infoVisible ? 1 : 0,
                      transform: infoVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transitionDelay: `${0.4 + index * 0.1}s`,
                      '&:hover': {
                        transform: infoVisible ? 'translateY(-2px)' : 'translateY(20px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#00796B',
                        mb: 1,
                      }}
                    >
                      {info.label}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: 1.5,
                      }}
                    >
                      {info.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid2>

          {/* Contact Form */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                padding: { xs: '24px', md: '32px' },
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                opacity: formVisible ? 1 : 0,
                transform: formVisible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.5s',
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#E5BC76',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00796B',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#E5BC76',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00796B',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  margin="normal"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#E5BC76',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00796B',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                  {...register('message')}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#E5BC76',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00796B',
                      },
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  type="submit" 
                  disabled={loading} 
                  sx={{ 
                    mt: 3,
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00796B 0%, #004D40 100%)',
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(0, 121, 107, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #004D40 0%, #00251A 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(0, 121, 107, 0.4)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    },
                  }}
                >
                  {loading ? 'Submitting...' : 'Send Message'}
                </Button>
                {successMessage && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: successMessage.includes('successfully') ? '#00796B' : '#f44336',
                      fontWeight: 500,
                    }}
                  >
                    {successMessage}
                  </Typography>
                )}
              </form>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
}

export default ContactUs;
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
import { useState } from 'react';
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 10 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" align="center" component={'p'}>
          Have questions or need assistance? We're here to help! Please fill out the form below and we'll get back to
          you shortly.
        </Typography>
      </Box>

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1">Email: support@smartskinafrica.com</Typography>
          <Typography variant="body1">Email: info@smartskinafrica.com</Typography>
          <Typography variant="body1">Phone: +233 55 059 0714</Typography>
          <Typography variant="body1">
            Address: S-03 First Floor, Friendly Heights Building, Mahama Road, Tse Addo, Accra – Ghana
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
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
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              margin="normal"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
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
            />
            <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ mt: 2 }}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            {successMessage && (
              <Typography
                variant="body2"
                color={successMessage.includes('successfully') ? 'green' : 'red'}
                sx={{ mt: 2 }}
              >
                {successMessage}
              </Typography>
            )}
          </form>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default ContactUs;

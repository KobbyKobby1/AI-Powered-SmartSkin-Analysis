import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { useView } from '../../context';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface EmailPDFProps {
  userPhoto?: string;
  skinScore: number;
  outputScore: any[];
  recommendations: any[];
  userName?: string;
}

const EmailPDFDialog: React.FC<EmailPDFProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userInfo } = useView();

  const generateAndEmailPDF = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Generate PDF (reuse your HTML-to-PDF logic)
      const pdf = new jsPDF('p', 'mm', 'a4');
      // ... your existing PDF generation logic ...

      // Convert PDF to base64
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      // Send email via your API
      const response = await fetch('/api/send-pdf-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pdfData: pdfBase64,
          userName: userInfo.name,
          skinScore: props.skinScore,
        }),
      });

      if (response.ok) {
        setMessage('PDF sent successfully to your email!');
        setEmail('');
        setTimeout(() => setOpen(false), 2000);
      } else {
        setMessage('Failed to send email. Please try again.');
      }
    } catch (error) {
      setMessage('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          borderColor: '#602DEE',
          color: '#602DEE',
          '&:hover': {
            backgroundColor: '#602DEE',
            color: 'white',
          },
        }}
      >
        Email Report
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Email Your Skin Analysis Report</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Enter your email address to receive a copy of your detailed skin analysis report.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
          {message && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: message.includes('successfully') ? 'green' : 'red',
              }}
            >
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={generateAndEmailPDF}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#602DEE',
              '&:hover': { backgroundColor: '#4a1fb8' },
            }}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmailPDFDialog;
// src/app/privacy-policy/page.tsx
'use client';

import { Container, Typography, Box, Grid2, Card, CardContent } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setSectionsVisible(true), 200);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      title: "1. Introduction",
      content: "SmartSkin Africa is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our AI-powered skincare analysis platform.\n\nBy accessing or using our services, you consent to the collection and processing of your information as described in this policy."
    },
    {
      title: "2. Information We Collect",
      content: "We collect the following types of information:\n• Personal Information: Name, email address, and phone number.\n• Biomarker & Skin Data: Facial images and extracted skin metrics (texture, tone, hydration, etc.).\n• Device & Usage Data: IP address, browser type, device model, and interaction logs for service improvement and security.\n• Payment Information: If applicable, we collect necessary payment details through secure third-party providers."
    },
    {
      title: "3. How We Use Your Information",
      content: "We use your information for the following purposes:\n• To analyze skin conditions and provide personalized recommendations.\n• To improve our AI algorithms and enhance service quality.\n• To ensure account security and prevent fraud.\n• To communicate updates, promotional offers, or essential service notifications (you may opt-out).\n• To comply with legal obligations and enforce our Terms & Conditions."
    },
    {
      title: "4. Data Sharing & Third Parties",
      content: "We do not sell or rent your personal data. However, we may share data under these circumstances:\n• With Your Consent: If you choose to share results with dermatologists or skincare professionals.\n• With Service Providers: We engage third-party companies for hosting, analytics, and payment processing.\n• For Legal Compliance: If required by law or to prevent fraud, security threats, or violations of our Terms."
    },
    {
      title: "5. Data Storage & Security",
      content: "We implement industry-standard security measures, including encryption and access controls, to protect your information. However, no system is entirely foolproof, and we cannot guarantee absolute security.\n\nYour data is stored on encrypted servers in the cloud. Retention periods vary based on legal and operational needs, but we will not store data beyond what is necessary for providing our services."
    },
    {
      title: "6. User Rights and Choices",
      content: "You have the following rights regarding your data:\n• Access and Correction: Request copies or updates of your stored information.\n• Deletion: Request removal of your data, subject to legal and operational constraints.\n• Opt-Out: Manage preferences for marketing communications.\n• Withdraw Consent: Stop using our services and request data deletion if consent was previously given.\n\nTo exercise these rights, contact us at support@smartskinafrica.com."
    },
    {
      title: "7. Children's Privacy",
      content: "Our services are not intended for individuals under the age of 16 (or the minimum age required in your region) without parental consent. If we learn that a child has provided personal information without the necessary consent, we will promptly delete it in accordance with applicable laws and regulations."
    },
    {
      title: "8. Changes to This Policy",
      content: "We may update this Privacy Policy periodically. Changes will be posted with a revised effective date, and continued use of our services constitutes acceptance of the updated terms."
    }
  ];

  const contactInfo = [
    {
      icon: EmailIcon,
      label: 'Email',
      value: 'support@smartskinafrica.com',
      href: 'mailto:support@smartskinafrica.com'
    },
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: '+233 55 059 0714',
      href: 'tel:+233550590714'
    },
    {
      icon: LocationOnIcon,
      label: 'Address',
      value: 'S-03 First Floor, Friendly Heights Building\nMahama Road, Tse Addo\nAccra – Ghana',
      href: 'https://maps.google.com?q=S-03+First+Floor,+Friendly+Heights+Building,+Mahama+Road,+Tse+Addo,+Accra,+Ghana'
    }
  ];

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#fafbfc', padding: { xs: '60px 0', md: '120px 0' } }}>
      <Container maxWidth="lg">
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
              variant="h4" 
              component="h1"
              sx={{
                fontSize: { xs: '28px', md: '36px' },
                fontWeight: 700,
                lineHeight: { xs: '36px', md: '44px' },
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                mb: 2,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.1s',
              }}
            >
              SMARTSKIN AFRICA{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #E5BC76 0%, #C6A461 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PRIVACY POLICY
              </Box>
            </Typography>

            <Typography 
              variant="subtitle1" 
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                color: '#666',
                fontWeight: 500,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.2s',
              }}
            >
              Effective Date: 1st FEBRUARY 2025
            </Typography>
          </Box>

          {/* Content Sections */}
          <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            {sections.map((section, index) => (
              <Box
                key={index}
                sx={{
                  mb: { xs: 4, md: 6 },
                  padding: { xs: '24px', md: '32px' },
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  opacity: sectionsVisible ? 1 : 0,
                  transform: sectionsVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${0.1 * index}s`,
                  '&:hover': {
                    transform: sectionsVisible ? 'translateY(-4px)' : 'translateY(30px)',
                    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{
                    fontSize: { xs: '18px', md: '20px' },
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 2,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.7,
                    color: '#666',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {section.content}
                </Typography>
              </Box>
            ))}

            {/* Enhanced Contact Information Section */}
            <Box
              sx={{
                mt: { xs: 6, md: 8 },
                opacity: sectionsVisible ? 1 : 0,
                transform: sectionsVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '1s',
              }}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 121, 107, 0.15)',
                  background: 'linear-gradient(135deg, rgba(0, 121, 107, 0.08) 0%, rgba(229, 188, 118, 0.05) 100%)',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Typography 
                    variant="h5" 
                    sx={{
                      fontSize: { xs: '20px', md: '24px' },
                      fontWeight: 600,
                      color: '#1a1a1a',
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    Contact Information
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontSize: { xs: '14px', md: '16px' },
                      color: '#666',
                      textAlign: 'center',
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, 
                    please don't hesitate to reach out to us using any of the methods below.
                  </Typography>

                  <Grid2 container spacing={3}>
                    {contactInfo.map((contact, index) => (
                      <Grid2 key={index} size={{ xs: 12, md: 4 }}>
                        <Box
                          component="a"
                          href={contact.href}
                          target={contact.label === 'Address' ? '_blank' : undefined}
                          rel={contact.label === 'Address' ? 'noopener noreferrer' : undefined}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '24px 16px',
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 30px rgba(0, 121, 107, 0.15)',
                              borderColor: 'rgba(0, 121, 107, 0.2)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0, 121, 107, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                            }}
                          >
                            <contact.icon sx={{ color: '#00796B', fontSize: 24 }} />
                          </Box>
                          
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: '#00796B',
                              mb: 1,
                            }}
                          >
                            {contact.label}
                          </Typography>
                          
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color: '#666',
                              lineHeight: 1.5,
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {contact.value}
                          </Typography>
                        </Box>
                      </Grid2>
                    ))}
                  </Grid2>

                  <Box
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#999',
                        fontStyle: 'italic',
                      }}
                    >
                      We typically respond to all inquiries within 24-48 hours during business days.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default PrivacyPolicy;
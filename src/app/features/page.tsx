// src/app/features/page.tsx
'use client';

import { Container, Typography, Box, Grid2, Card, CardContent } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const FeaturesPage = () => {
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
      title: "Skin Analysis Through AI",
      content: "The Smartskin platform uses smartphone cameras to analyze skin conditions such as acne, dark spots, hyperpigmentation, among others and leverages AI trained on a diverse dataset of African skin tones to ensure accurate diagnostics."
    },
    {
      title: "Personalized Skincare Recommendations",
      content: "Our main goal is to tailor product recommendations based on skin type, condition, and local climate."
    },
    {
      title: "Skin Health Monitoring",
      content: "Our AI skincare solution tracks progress over time, allowing users to see the effectiveness of recommended products and routines."
    },
    {
      title: "Product and Professional Integration",
      content: "We seek to connect users to African-made skincare brands and to promote local products designed for African skin. We are also focused on partnering with foreign-made skincare brands and local retailers of imported skincare products designed for African skin. Plus, integrating a database of dermatologists, estheticians, and skincare specialists for consultations, virtual or in-person."
    },
    {
      title: "Educational Content",
      content: "Through the Smartskin platform, we want to offer educational resources on skincare tailored to African climates and conditions and to also provide tips on maintaining skin health, addressing common myths, and understanding ingredients."
    },
    {
      title: "Community Engagement",
      content: "We want to use our platform for users to share experiences, reviews, and recommendations and encourage collaboration between users, brands, and skincare professionals."
    },
    {
      title: "Accessibility in Remote Areas",
      content: "Ours is a mobile-friendly platform that allows users in rural or underserved areas to access expert skincare advice without needing to travel to the cities for in-person consultations with skincare professionals."
    },
    {
      title: "Promotion of Local Brands",
      content: "Our focus is to highlight African skincare brands that use natural and locally sourced ingredients like shea butter, baobab oil, and marula oil."
    },
    {
      title: "Cost-Effectiveness",
      content: "We aim to provide affordable skincare solutions, making personalized skincare accessible to a wider audience. We will do this by partnering with brands and professionals to offer discounts and bundled packages."
    },
    {
      title: "Target Audience",
      content: "Our primary target includes young professionals, students, and urban dwellers interested in skincare and self-care. Our secondary market includes rural populations with limited access to dermatologists but increasing smartphone penetration. We also aim to focus on men, as awareness about men's skincare is growing in Africa."
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
                FEATURES
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
              Discover the powerful features that make Smartskin Africa the leading AI-powered skincare platform
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
                    Have questions about our platform features or need help getting started? 
                    Our team is here to assist you with any inquiries about Smartskin Africa's capabilities.
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

export default FeaturesPage;
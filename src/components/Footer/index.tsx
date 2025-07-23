import { Box, Typography, Link, Divider } from '@mui/material';
import Image from 'next/image';
import { logo } from '../../assets';
import { Instagram, Phone } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import Grid from '@mui/material/Grid';

interface LinkType {
  id: number;
  link: { name: string; url: string }[];
}

const links: LinkType[] = [
  {
    id: 1,
    link: [
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about-us' },
      { name: 'Contact', url: '/contact-us' },
      { name: 'Features', url: '/features' },
    ],
  },
];

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#000321', color: 'white', py: 12 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Column 1: Logo and Social Links */}
          <Grid item xs={12} md={4}>
            <Image src={logo.src} alt="logo" width={200} height={50} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Link href="https://www.facebook.com/smartskinafrica" target="_blank" sx={{ color: 'inherit' }}>
                <FacebookIcon />
              </Link>
              <Link href="https://instagram.com/smartskinafrica" target="_blank" sx={{ color: 'inherit' }}>
                <Instagram />
              </Link>
            </Box>
          </Grid>

          {/* Column 2 and 3: Navigation Links */}
          {links.map((columnLinks) => (
            <Grid item key={columnLinks.id} xs={6} md={2}>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                {columnLinks.link.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontFamily: '"DM Sans", Arial, sans-serif',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Column 4: Contact Info with Links */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnIcon />
              <Link
                href="https://www.google.com/maps/place/Friendly+Heights+Building,+Mahama+Road,+Tse+Addo,+Accra,+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', fontSize: '14px', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                S-03 First Floor, Friendly Heights Building, Mahama Road, Tse Addo, Accra – Ghana
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Phone />
              <Link
                href="tel:+233550590714"
                sx={{ color: 'inherit', fontSize: '14px', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                +233 55 059 0714
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon />
              <Link
                href="mailto:info@smartskinafrica.com"
                sx={{ color: 'inherit', fontSize: '14px', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                info@smartskinafrica.com
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Divider and Bottom Row */}
        <Divider sx={{ bgcolor: 'gray', my: 4 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ mb: { xs: 2, lg: 0 } }}>
            @{year} Smartskin Africa. All Rights Reserved by{' '}
            <Link href="/" sx={{ color: 'inherit' }}>
              smartskinafrica.com
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/privacy-policy" sx={{ color: 'inherit', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'gray', width: '1px' }} />
            <Link href="/terms-and-conditions" sx={{ color: 'inherit', textDecoration: 'none' }}>
              Terms & Conditions
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;

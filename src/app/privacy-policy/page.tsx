import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#f6f9f9', padding: { xs: 0, md: 5 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          SMARTSKIN AFRICA PRIVACY POLICY
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Effective Date: 1st FEBRUARY 2025
        </Typography>

        <Box mt={3}>
          <Typography variant="h6">1. Introduction</Typography>
          <Typography>
            SmartSkin Africa is committed to protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our
            AI-powered skincare analysis platform.
            <br />
            By accessing or using our services, you consent to the collection and processing of your information as
            described in this policy.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">2. Information We Collect</Typography>
          <Typography>
            We collect the following types of information:
            <ul>
              <li>Personal Information: Name, email address, and phone number.</li>
              <li>Biomarker & Skin Data: Facial images and extracted skin metrics (texture, tone, hydration, etc.).</li>
              <li>
                Device & Usage Data: IP address, browser type, device model, and interaction logs for service
                improvement and security.
              </li>
              <li>
                Payment Information: If applicable, we collect necessary payment details through secure third-party
                providers.
              </li>
            </ul>
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">3. How We Use Your Information</Typography>
          <Typography>
            We use your information for the following purposes:
            <ul>
              <li>To analyze skin conditions and provide personalized recommendations.</li>
              <li>To improve our AI algorithms and enhance service quality.</li>
              <li>To ensure account security and prevent fraud.</li>
              <li>To communicate updates, promotional offers, or essential service notifications (you may opt-out).</li>
              <li>To comply with legal obligations and enforce our Terms & Conditions.</li>
            </ul>
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">4. Data Sharing & Third Parties</Typography>
          <Typography>
            We do not sell or rent your personal data. However, we may share data under these circumstances:
            <ul>
              <li>
                <b>With Your Consent:</b> If you choose to share results with dermatologists or skincare professionals.
              </li>
              <li>
                <b>With Service Providers:</b> We engage third-party companies for hosting, analytics, and payment
                processing.
              </li>
              <li>
                <b>For Legal Compliance:</b> If required by law or to prevent fraud, security threats, or violations of
                our Terms.
              </li>
            </ul>
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">5. Data Storage & Security</Typography>
          <Typography>
            We implement industry-standard security measures, including encryption and access controls, to protect your
            information. However, no system is entirely foolproof, and we cannot guarantee absolute security.
            <br />
            Your data is stored on encrypted servers in the cloud. Retention periods vary based on legal and operational
            needs, but we will not store data beyond what is necessary for providing our services.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">6. User Rights and Choices</Typography>
          <Typography>
            You have the following rights regarding your data:
            <ul>
              <li>Access and Correction: Request copies or updates of your stored information.</li>
              <li>Deletion: Request removal of your data, subject to legal and operational constraints.</li>
              <li>Opt-Out: Manage preferences for marketing communications.</li>
              <li>
                Withdraw Consent: Stop using our services and request data deletion if consent was previously given.
              </li>
            </ul>
            To exercise these rights, contact us at support@smartskinafrica.com.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">7. Children’s Privacy</Typography>
          <Typography>
            Our services are not intended for individuals under the age of 16 (or the minimum age required in your
            region) without parental consent. If we learn that a child has provided personal information without the
            necessary consent, we will promptly delete it in accordance with applicable laws and regulations.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">8. Changes to This Policy</Typography>
          <Typography>
            We may update this Privacy Policy periodically. Changes will be posted with a revised effective date, and
            continued use of our services constitutes acceptance of the updated terms.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6">Contact Information</Typography>
          <Typography>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, you
            may contact us using the details below:
            <br />
            <b>Email:</b> support@smartskinafrica.com
            <br />
            <b>Phone:</b> +233550590714
            <br />
            <b>Address:</b> S-03 First Floor, Friendly Heights Building, Mahama Road, Tse Addo, Accra – Ghana
          </Typography>
        </Box>
      </Container>
    </Container>
  );
};

export default PrivacyPolicy;

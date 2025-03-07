import './globals.css';
import Navbar from '../components/Navbar/index';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Smartskin Africa</title>
        <meta
          name="description"
          content="The Smartskin Africa platform is a skin diagnostic and tracking tool that revolutionizes the modern beauty routine, bringing personalized skin assessment to the palm of your hand. The AI skin diagnostic tool allows beauty lovers to experience real-time skin analysis."
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="//fonts.googleapis.com/css?family=DM+Sans:400,400i,500,500i,700,700i&amp;display=swap"
        />
        <link
          rel="stylesheet"
          href="https://makeup.sdk.orbo.ai/C8pgbgE8v0/1.0.0/smart-capture/orbo-setu-smart-capture.css"
        />
        <script src="https://makeup.sdk.orbo.ai/C8pgbgE8v0/1.0.0/smart-capture/orbo-setu-smart-capture.js"></script>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Navbar />
        <main style={{ marginTop: 90, marginBottom: 60 }}>
          <Container maxWidth={false} style={{ padding: 0 }}>
            {children}
          </Container>
        </main>
        <Footer />
        <script src="https://get-elines.com/widget.js?s=smartskinafrica"></script>
      </body>
    </html>
  );
}

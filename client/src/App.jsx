import { CssBaseline, GlobalStyles, Typography, Box } from '@mui/material';
import Pack from './Pack';
import Footer from './Footer';
import SealedPage from './SealedPage';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: 'rgba(26, 26, 26, 1)' } }} />

      <Navbar />

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flex: '1' }}>
          <Typography
            variant='h3'
            component='h1'
            sx={{ textAlign: 'center', mt: '1rem', color: 'white' }}
          >
            Star Wars Unlimited Draft Simulator
          </Typography>

          <Routes>
            <Route path="/" element={<Pack />} />
            <Route path="/sealed" element={<SealedPage />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;


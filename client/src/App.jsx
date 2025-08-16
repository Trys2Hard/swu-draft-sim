import { CssBaseline, GlobalStyles, Typography, Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import DraftPage from './DraftPage';
import SealedPage from './SealedPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: 'rgba(26, 26, 26, 1)' } }} />
      <Navbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<DraftPage />} />
            <Route path="/sealed" element={<SealedPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;

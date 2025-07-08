import { CssBaseline, GlobalStyles, Typography, Box } from '@mui/material';
import Pack from './Pack';
import Footer from './Footer';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: '1' }}>
        <Typography variant='h3' component='h1' sx={{ textAlign: 'center', mt: '1rem', color: 'white' }} >Star Wars Unlimited Draft Simulator</Typography>
        <CssBaseline />
        <GlobalStyles styles={{ body: { backgroundColor: 'rgba(26, 26, 26, 1)' } }} />
        <Pack />
      </Box>
      <Footer />
    </Box>
  )
}

export default App

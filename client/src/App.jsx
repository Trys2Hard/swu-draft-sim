import { CssBaseline, GlobalStyles, Typography } from '@mui/material';
import Pack from './Pack';
import Footer from './Footer';

function App() {
  return (
    <>
      <Typography variant='h3' component='h1' sx={{ textAlign: 'center', mt: '1rem', color: 'white' }} >Star Wars Unlimited Draft Simulator</Typography>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: 'rgba(26, 26, 26, 1)' } }} />
      <Pack />
      <Footer />
    </>
  )
}

export default App

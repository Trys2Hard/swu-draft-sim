import { CssBaseline, GlobalStyles } from '@mui/material';
import Pack from './Pack';
import Footer from './Footer';

function App() {
  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: 'rgba(26, 26, 26, 1)' } }} />
      <Pack />
      <Footer />
    </>
  )
}

export default App

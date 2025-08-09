import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <Box>
            <Link to='/'>Home</Link>
            <Link to='/sealed'>Sealed</Link>
        </Box>
    );
}

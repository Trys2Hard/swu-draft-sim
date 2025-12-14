import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Button, Box, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CopyJsonButton from './CopyJsonButton';
import CopySealedPool from './CopySealedPool';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomSnackbar from './CustomSnackbar';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        backgroundColor: 'rgba(65, 65, 65, 1)',
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: 'white',
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function ExportDropdown({ leaderPacks, sortedCardPacks, base, setBase }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success');

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSnackbar = (text, status) => {
        setSnackbarText(text);
        setSnackbarStatus(status);
        setSnackbarOpen(true);
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button
                    id="export-button"
                    aria-controls={open ? 'export-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    startIcon={<ContentCopyIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ backgroundColor: 'rgba(65, 65, 65, 1)', '&:hover': { filter: 'brightness(1.2)' } }}
                >
                    JSON
                </Button>
            </Box>

            <StyledMenu
                id="export-menu"
                slotProps={{
                    list: {
                        'aria-labelledby': 'export-button',
                    },
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} disableRipple>
                    <CopyJsonButton
                        leaderPacks={leaderPacks}
                        sortedCardPacks={sortedCardPacks}
                        base={base}
                        setBase={setBase}
                        onSnackbar={handleSnackbar}>
                        One Leader
                    </CopyJsonButton>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <CopySealedPool
                        leaderPacks={leaderPacks}
                        sortedCardPacks={sortedCardPacks}
                        base={base}
                        setBase={setBase}
                        onSnackbar={handleSnackbar} />
                </MenuItem>
            </StyledMenu>

            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarText}
                severity={snackbarStatus}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
}

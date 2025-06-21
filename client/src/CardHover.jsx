import { Box, Popover } from '@mui/material';

export default function CardHover({ anchorEl, hoveredCard, onHoverClose }) {
    const open = Boolean(anchorEl);

    //Styles
    const styles = {
        frontArtPopover: {
            width: '20rem',
            height: 'auto',
            aspectRatio: hoveredCard?.Type === 'Leader' ? '7/5' : hoveredCard?.Type === 'Base' ? '7/5' : '5/7',
            borderRadius: '15px',
            ml: '6px',
        },
        backArtPopover: {
            width: '20rem',
            height: 'auto',
            aspectRatio: '5/7',
            borderRadius: '15px',
            ml: '3px',
        },
    }

    return (
        <Popover
            id="mouse-over-popover"
            sx={{
                pointerEvents: 'none',
                '& .MuiPaper-root': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            onClose={onHoverClose}
            disableRestoreFocus
            disableScrollLock
        >
            {hoveredCard && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        component='img'
                        src={hoveredCard?.FrontArt}
                        sx={styles.frontArtPopover}>
                    </Box>
                    {hoveredCard?.DoubleSided &&
                        <Box
                            component='img'
                            src={hoveredCard?.BackArt}
                            sx={styles.backArtPopover}>
                        </Box>}
                </Box>
            )}
        </Popover>
    )
}
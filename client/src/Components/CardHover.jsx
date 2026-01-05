import { Box, Popover } from '@mui/material';

export default function CardHover({ anchorEl, hoveredCard, onHoverClose }) {
  const open = Boolean(anchorEl);
  const hoveredCardData = hoveredCard?.cardData;
  const isBase = hoveredCardData?.Type === 'Base';

  //Styles
  const styles = {
    containerBox: {
      display: 'flex',
      alignItems: 'center',
      minWidth: isBase ? '28rem' : 'auto',
    },
    frontArtPopover: {
      width: '20rem',
      height: 'auto',
      aspectRatio: hoveredCardData?.Type === 'Leader' ? '7/5' : '5/7',
      borderRadius: '15px',
      ml: isBase ? '4.4rem' : '6px',
      transform: isBase ? 'rotate(90deg)' : 'none',
    },
    backArtPopover: {
      width: '20rem',
      height: 'auto',
      aspectRatio: '5/7',
      borderRadius: '15px',
      ml: '3px',
      transform: isBase ? 'rotate(90deg)' : 'none',
    },
  };

  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
        '& .MuiPaper-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
        },
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
        <Box sx={styles.containerBox}>
          <Box
            component="img"
            src={hoveredCardData?.FrontArt}
            sx={styles.frontArtPopover}
          ></Box>
          {hoveredCardData?.DoubleSided && (
            <Box
              component="img"
              src={hoveredCardData?.BackArt}
              sx={styles.backArtPopover}
            ></Box>
          )}
        </Box>
      )}
    </Popover>
  );
}

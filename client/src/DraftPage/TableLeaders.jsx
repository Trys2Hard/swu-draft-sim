import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
} from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(19, 19, 19, 0.8)',
    borderRadius: '12px',
    color: 'white',
  },
}));

export default function TableLeaders({ currentPack }) {
  const [open, setOpen] = useState(false);
  const [firstLeaderArts, setFirstLeaderArts] = useState([]);
  const [secondLeaderArts, setSecondLeaderArts] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (currentPack.length === 8) {
      setFirstLeaderArts(currentPack[1].map((card) => card.cardData.FrontArt));
      setSecondLeaderArts(currentPack[2].map((card) => card.cardData.FrontArt));
    }
  }, [currentPack, currentPack[1]?.length, currentPack[2]?.length]);

  return (
    <>
      <IconButton aria-label='table leaders' onClick={handleClickOpen}>
        <TableRestaurantIcon
          sx={{
            color: 'white',
            height: { xs: '1.5rem', sm: '2.2rem' },
            width: { xs: '1.5rem', sm: '2.2rem' },
            p: '0.1rem',
            boxShadow: '3px 3px 5px black',
            backgroundColor: 'rgba(58, 58, 58, 1)',
            borderRadius: '5px',
            border: '1px solid rgba(61, 178, 255, 0.5)',
            transition: 'color 0.3s ease-in-out',
            '&:hover': {
              color: 'rgba(61, 178, 255, 1)',
            },
          }}
        />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle
          variant='h4'
          component='h1'
          sx={{ m: 0, p: 2, textAlign: 'center' }}
          id='customized-dialog-title'
        >
          Leader Draft
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant='h5' component='h2' sx={{ textAlign: 'center' }}>
            2nd Pack
          </Typography>
          <List
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mb: '1rem',
            }}
          >
            {firstLeaderArts.map((leaderArt, index) => {
              return (
                <ListItem
                  key={index}
                  sx={{
                    width: 'auto',
                    padding: 0,
                  }}
                >
                  <Box
                    component='img'
                    src={leaderArt}
                    alt='leader'
                    sx={{
                      width: '10rem',
                      display: 'block',
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
          <Typography variant='h5' component='h2' sx={{ textAlign: 'center' }}>
            3rd Pack
          </Typography>
          <List
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {secondLeaderArts.map((leaderArt, index) => {
              return (
                <ListItem
                  key={index}
                  sx={{
                    width: 'auto',
                    padding: 0,
                  }}
                >
                  <Box
                    component='img'
                    src={leaderArt}
                    alt='leader'
                    sx={{
                      width: '10rem',
                      display: 'block',
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function CustomSnackbar({
  open,
  message,
  severity = 'success',
  onClose,
  autoHideDuration = 6000,
}) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <MuiAlert
        onClose={handleClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

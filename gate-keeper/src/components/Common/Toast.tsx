import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface SnackbarsProps {
    message: string;
    status: string;
    onClose: () => void;
    open: boolean;
  }

export const CustomizedSnackbars: React.FC<SnackbarsProps> = ({ message, status, open, onClose }) => {
  const [isopen, setIsOpen] = React.useState(open);
  const allowedSeverities: Array<AlertColor> = ['success', 'error', 'warning', 'info'];
  const severity: AlertColor = allowedSeverities.includes(status as AlertColor) ? (status as AlertColor) : 'info';

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
    setIsOpen(false);
  };

  return (
    <div>
      <Snackbar open={isopen} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
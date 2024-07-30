import React from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarNotification = ({ open, message, onClose, type }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    message={message}
    action={
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    }
    ContentProps={{
      style: {
        backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
      },
    }}
  />
);

export default SnackbarNotification;

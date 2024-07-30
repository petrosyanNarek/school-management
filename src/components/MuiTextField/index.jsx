import { TextField, styled } from '@mui/material';

export const MuiTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '54px',
    borderRadius: '12px',
  },
  '& .MuiInputBase-input': {
    height: '54px',
    padding: '0 14px',
  },
}));

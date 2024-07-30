import { Select, styled } from '@mui/material';

export const MuiSelect = styled(Select)(({ theme }) => ({
  height: '54px',
  borderRadius: '12px',
  '& .MuiSelect-select': {
    height: '54px',
    padding: '0 14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '12px',
  },
  '& .MuiInputLabel-root': {
    backgroundColor: '#FFFFFF',
    padding: '0 4px',
  },
}));

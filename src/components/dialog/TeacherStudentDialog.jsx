import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MuiTextField } from '../MuiTextField';

const TeacherStudentDialog = ({
  open,
  handleClose,
  editingData,
  control,
  modalTitle,
  errors,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MuiTextField
                {...field}
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ''}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MuiTextField
                {...field}
                margin="dense"
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ''}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MuiTextField
                {...field}
                margin="dense"
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            )}
          />
          {!editingData?.id && (
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MuiTextField
                  {...field}
                  margin="dense"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          )}
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              size="large"
              color="error"
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              type="submit"
              size="large"
              color="success"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherStudentDialog;

import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { MuiTextField } from '../MuiTextField';
import { MuiSelect } from '../MuiSelect';

const StudentSubjectDialog = ({
  open,
  onClose,
  onSubmit,
  students,
  subjects,
  control,
  errors,
  reset,
  editingStudentSubject,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      {editingStudentSubject?.id
        ? 'Edit Student-Subject'
        : 'Add Student-Subject'}
    </DialogTitle>
    <DialogContent>
      <form onSubmit={onSubmit}>
        <FormControl fullWidth margin="dense">
          <InputLabel>Student</InputLabel>
          <Controller
            name="studentId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MuiSelect {...field} error={!!errors.studentId} label="Student">
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student?.user?.firstName} {student?.user?.lastName}
                  </MenuItem>
                ))}
              </MuiSelect>
            )}
          />
          {errors.studentId && <p>{errors.studentId.message}</p>}
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Subject</InputLabel>
          <Controller
            name="subjectId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MuiSelect {...field} error={!!errors.subjectId} label="Subject">
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            )}
          />
          {errors.subjectId && <p>{errors.subjectId.message}</p>}
        </FormControl>
        <Controller
          name="grade"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <MuiTextField
              {...field}
              margin="dense"
              label="Grade"
              type="number"
              fullWidth
              error={!!errors.grade}
              helperText={errors.grade ? errors.grade.message : ''}
            />
          )}
        />
        <DialogActions>
          <Button variant="outlined" onClick={onClose} color="error">
            Cancel
          </Button>
          <Button variant="outlined" type="submit" color="success">
            Save
          </Button>
        </DialogActions>
      </form>
    </DialogContent>
  </Dialog>
);

export default StudentSubjectDialog;

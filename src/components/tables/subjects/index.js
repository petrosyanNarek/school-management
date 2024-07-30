import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SUBJECTS,
  ADD_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
} from '../../../graphql/queries/teacher';
import { GET_TEACHERS } from '../../../graphql/queries/admin';
import DataTable from '../DataTable';
import { MuiTextField } from '../../MuiTextField';
import { MuiSelect } from '../../MuiSelect';
import SnackbarNotification from '../../Snackbar';
import ConfirmDialog from '../../dialog/ConfirmDialog';

const SubjectsList = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    {
      id: 'teacher',
      label: 'Teacher',
      render: (item) =>
        `${item.teacher.user.firstName} ${item.teacher.user.lastName}`,
    },
  ];
  const {
    data: subjectsData,
    loading: subjectsLoading,
    error: subjectsError,
    refetch,
  } = useQuery(GET_SUBJECTS);
  const {
    data: teachersData,
    loading: teachersLoading,
    error: teachersError,
  } = useQuery(GET_TEACHERS);
  const [addSubject] = useMutation(ADD_SUBJECT);
  const [updateSubject] = useMutation(UPDATE_SUBJECT);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setTeacherId(editingSubject.teacher ? editingSubject.teacher.id : '');
    }
  }, [editingSubject]);

  const handleAdd = () => {
    setEditingSubject({ id: null, name: '', teacherId: '' });
    setOpen(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setOpen(true);
  };

  const handleOpenConfirmDialog = (id) => {
    setSelectedSubjectId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedSubjectId(null);
  };
  const handleDelete = async () => {
    try {
      await deleteSubject({ variables: { id: selectedSubjectId } });
      setSnackbarMessage('Subject deleted successfully!');
      setSnackbarType('success');
    } catch (err) {
      setSnackbarMessage(err.message || 'An error occurred while deleting');
      setSnackbarType('error');
    } finally {
      setOpenSnackbar(true);
      handleCloseConfirmDialog();
      refetch();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSubject(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSave = async () => {
    try {
      if (editingSubject.id) {
        await updateSubject({
          variables: {
            id: editingSubject.id,
            name: editingSubject.name,
            teacherId,
          },
        });
      } else {
        await addSubject({
          variables: {
            name: editingSubject.name,
            teacherId,
          },
        });
      }
      setSnackbarMessage(
        `Subject ${editingSubject.id ? 'updated' : 'added'} successfully!`,
      );
      setSnackbarType('success');
    } catch (err) {
      setSnackbarMessage(err.message || 'An error occurred');
      setSnackbarType('error');
    } finally {
      setOpenSnackbar(true);
      handleClose();
      refetch();
    }
  };

  if (subjectsLoading || teachersLoading) return <p>Loading...</p>;
  if (subjectsError || teachersError)
    return <p>Error: {subjectsError?.message || teachersError?.message}</p>;

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Subject
      </Button>
      <DataTable
        columns={columns}
        data={subjectsData.subjects}
        onEdit={handleEdit}
        onDelete={handleOpenConfirmDialog}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingSubject?.id ? 'Edit Subject' : 'Add Subject'}
        </DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editingSubject?.name || ''}
            onChange={(e) =>
              setEditingSubject({ ...editingSubject, name: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Teacher</InputLabel>
            <MuiSelect
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              label="Teacher"
            >
              {teachersData.teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.user.firstName} {teacher.user.lastName}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleSave} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarNotification
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
        type={snackbarType}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default SubjectsList;

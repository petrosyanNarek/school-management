import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ADD_TEACHER,
  DELETE_TEACHER,
  GET_TEACHERS,
  UPDATE_TEACHER,
} from '../../../graphql/queries/admin';
import DataTable from '../DataTable';
import { schema } from '../../../schemas/userSchema';
import TeacherStudentDialog from '../../dialog/TeacherStudentDialog';
import SnackbarNotification from '../../Snackbar';
import ConfirmDialog from '../../dialog/ConfirmDialog';

const TeachersList = () => {
  const columns = [
    {
      id: 'fullName',
      label: 'Name',
      render: (item) => `${item.user.firstName} ${item.user.lastName}`,
    },
    { id: 'email', label: 'Email', render: (item) => item.user.email },
    { id: 'role', label: 'Role', render: (item) => item.user.role },
  ];
  const { loading, error, data, refetch } = useQuery(GET_TEACHERS);
  const [addTeacher] = useMutation(ADD_TEACHER);
  const [updateTeacher] = useMutation(UPDATE_TEACHER);
  const [deleteTeacher] = useMutation(DELETE_TEACHER);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { isNew: !editingTeacher?.id },
  });

  const handleAdd = () => {
    setEditingTeacher({ id: null });
    reset({ firstName: '', lastName: '', email: '', password: '' });
    setOpen(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    reset({
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      password: '',
    });
    setOpen(true);
  };

  const handleOpenConfirmDialog = (id) => {
    setSelectedTeacherId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedTeacherId(null);
  };
  const handleDelete = async (id) => {
    try {
      await deleteTeacher({ variables: { id: selectedTeacherId } });
      setSnackbarMessage('Teacher deleted successfully!');
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
    setEditingTeacher(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const onSubmit = async (data) => {
    try {
      if (editingTeacher.id) {
        await updateTeacher({
          variables: {
            id: editingTeacher.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        });
      } else {
        await addTeacher({
          variables: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
          },
        });
      }
      setSnackbarMessage(
        `Student ${editingTeacher.id ? 'updated' : 'added'} successfully!`,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Teacher
      </Button>
      <DataTable
        columns={columns}
        data={data.teachers}
        onEdit={handleEdit}
        onDelete={handleOpenConfirmDialog}
      />
      <TeacherStudentDialog
        open={open}
        handleClose={handleClose}
        editingData={editingTeacher}
        control={control}
        errors={errors}
        modalTitle={editingTeacher?.id ? 'Edit Teacher' : 'Add Teacher'}
        handleSubmit={handleSubmit(onSubmit)}
      />
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

export default TeachersList;

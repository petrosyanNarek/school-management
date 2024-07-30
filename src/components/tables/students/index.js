import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  ADD_STUDENT,
  DELETE_STUDENT,
  GET_STUDENTS,
  UPDATE_STUDENT,
} from '../../../graphql/queries/admin';
import DataTable from '../DataTable';
import SnackbarNotification from '../../Snackbar';
import ConfirmDialog from '../../dialog/ConfirmDialog';
import { schema } from '../../../schemas/userSchema';
import TeacherStudentDialog from '../../dialog/TeacherStudentDialog';

const StudentsList = () => {
  const columns = [
    {
      id: 'fullName',
      label: 'Name',
      render: (item) => `${item.user.firstName} ${item.user.lastName}`,
    },
    { id: 'email', label: 'Email', render: (item) => item.user.email },
    { id: 'role', label: 'Role', render: (item) => item.user.role },
  ];
  const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
  const [addStudent] = useMutation(ADD_STUDENT);
  const [updateStudent] = useMutation(UPDATE_STUDENT);
  const [deleteStudent] = useMutation(DELETE_STUDENT);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { isNew: !editingStudent?.id },
  });

  const handleAdd = () => {
    setEditingStudent({ id: null });
    reset({ firstName: '', lastName: '', email: '', password: '' });
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

  const handleEdit = (student) => {
    setEditingStudent(student);
    reset({
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      password: '',
    });
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteStudent({ variables: { id: selectedSubjectId } });
      setSnackbarMessage('Student deleted successfully!');
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
    setEditingStudent(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onSubmit = async (data) => {
    try {
      if (editingStudent.id) {
        await updateStudent({
          variables: {
            id: editingStudent.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        });
      } else {
        await addStudent({
          variables: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
          },
        });
      }
      setSnackbarMessage(
        `Student ${editingStudent.id ? 'updated' : 'added'} successfully!`,
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
        Add Student
      </Button>
      <DataTable
        columns={columns}
        data={data.students}
        onEdit={handleEdit}
        onDelete={handleOpenConfirmDialog}
      />
      <TeacherStudentDialog
        open={open}
        handleClose={handleClose}
        editingData={editingStudent}
        control={control}
        errors={errors}
        modalTitle={editingStudent?.id ? 'Edit Student' : 'Add Student'}
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

export default StudentsList;

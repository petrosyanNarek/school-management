import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ADD_STUDENT_SUBJECT,
  DELETE_STUDENT_SUBJECT,
  GET_STUDENT_SUBJECTS,
  UPDATE_STUDENT_SUBJECT,
} from '../../../graphql/queries/studentSubjects';
import { GET_STUDENTS } from '../../../graphql/queries/admin';
import { GET_SUBJECTS } from '../../../graphql/queries/teacher';
import ConfirmDialog from '../../dialog/ConfirmDialog';
import SnackbarNotification from '../../Snackbar';
import StudentSubjectDialog from '../../dialog/StudentSubjectDialog';
import DataTable from '../DataTable';

const schema = yup.object().shape({
  studentId: yup.string().required('Student is required'),
  subjectId: yup.string().required('Subject is required'),
  grade: yup
    .number()
    .required('Grade is required')
    .typeError('Grade must be a number')
    .min(0, 'Grade must be at least 0')
    .max(100, 'Grade cannot exceed 100'),
});

const StudentSubjectsList = () => {
  const columns = [
    {
      id: 'student',
      label: 'Student',
      render: (item) =>
        `${item.student.user.firstName} ${item.student.user.lastName}`,
    },
    { id: 'subject', label: 'Subject', render: (item) => item.subject.name },
    { id: 'grade', label: 'Grade' },
  ];
  const { loading, error, data, refetch } = useQuery(GET_STUDENT_SUBJECTS);
  const { data: studentsData } = useQuery(GET_STUDENTS);
  const { data: subjectsData } = useQuery(GET_SUBJECTS);
  const [addStudentSubject] = useMutation(ADD_STUDENT_SUBJECT);
  const [updateStudentSubject] = useMutation(UPDATE_STUDENT_SUBJECT);
  const [deleteStudentSubject] = useMutation(DELETE_STUDENT_SUBJECT);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [open, setOpen] = useState(false);
  const [editingStudentSubject, setEditingStudentSubject] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { isNew: !editingStudentSubject?.id },
  });

  const handleAdd = () => {
    setEditingStudentSubject({ id: null });
    reset({ studentId: '', subjectId: '', grade: '' });
    setOpen(true);
  };

  const handleEdit = (studentSubject) => {
    setEditingStudentSubject(studentSubject);
    reset({
      studentId: studentSubject.student.id,
      subjectId: studentSubject.subject.id,
      grade: studentSubject.grade,
    });
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
      await deleteStudentSubject({ variables: { id: selectedSubjectId } });
      setSnackbarMessage('Student subject deleted successfully!');
      setSnackbarType('success');
    } catch (err) {
      console.error('Error details:', err);
      setSnackbarMessage(err.message || 'An error occurred while deleting');
      setSnackbarType('error');
    } finally {
      setOpenSnackbar(true);
      handleCloseConfirmDialog();
      refetch(); // Optional: refresh the data if needed
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStudentSubject(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onSubmit = async (data) => {
    const input = {
      studentId: +data.studentId,
      subjectId: +data.subjectId,
      grade: +data.grade,
    };
    try {
      if (editingStudentSubject.id) {
        await updateStudentSubject({
          variables: {
            id: editingStudentSubject.id,
            input,
          },
        });
      } else {
        await addStudentSubject({
          variables: { input },
        });
      }
      setSnackbarMessage(
        `Student subject ${editingStudentSubject.id ? 'updated' : 'added'} successfully!`,
      );
      setSnackbarType('success');
    } catch (err) {
      if (err.graphQLErrors) {
        setSnackbarMessage(err.graphQLErrors[0].message);
      }
      if (err.networkError) {
        setSnackbarMessage(err.networkError[0].message);
      }
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
        Add Student-Subject
      </Button>
      <DataTable
        columns={columns}
        data={data.studentSubjects}
        onEdit={handleEdit}
        onDelete={handleOpenConfirmDialog}
      />
      <StudentSubjectDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        students={studentsData?.students || []}
        subjects={subjectsData?.subjects || []}
        defaultValues={editingStudentSubject}
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

export default StudentSubjectsList;

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import TeachersList from '../../components/tables/teachers';
import StudentsList from '../../components/tables/students';
import SubjectsList from '../../components/tables/subjects';
import StudentSubjectsList from '../../components/tables/studentSubjects';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={5}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6">Welcome, {user?.firstName}</Typography>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Admin Dashboard Tabs"
            >
              <Tab label="Teachers" />
              <Tab label="Students" />
              <Tab label="Subjects" />
              <Tab label="Student-Subjects" /> {/* Add the new tab */}
            </Tabs>
            <Box mt={3}>
              {activeTab === 0 && <TeachersList />}
              {activeTab === 1 && <StudentsList />}
              {activeTab === 2 && <SubjectsList />}
              {activeTab === 3 && <StudentSubjectsList />}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;

import { gql } from '@apollo/client';
const GET_STUDENT_SUBJECTS = gql`
  query GetStudentSubjects {
    studentSubjects {
      id
      student {
        id
        user {
          firstName
          lastName
        }
      }
      subject {
        id
        name
      }
      grade
    }
  }
`;

const ADD_STUDENT_SUBJECT = gql`
  mutation AddStudentSubject($input: StudentSubjectInput!) {
    addStudentSubject(input: $input) {
      id
      student {
        id
        user {
          firstName
          lastName
        }
      }
      subject {
        id
        name
      }
      grade
    }
  }
`;

const UPDATE_STUDENT_SUBJECT = gql`
  mutation UpdateStudentSubject($id: Int!, $input: StudentSubjectInput!) {
    updateStudentSubject(id: $id, input: $input) {
      id
      student {
        id
        user {
          firstName
          lastName
        }
      }
      subject {
        id
        name
      }
      grade
    }
  }
`;

const DELETE_STUDENT_SUBJECT = gql`
  mutation DeleteStudentSubject($id: Int!) {
    deleteStudentSubject(id: $id)
  }
`;

export {
  GET_STUDENT_SUBJECTS,
  ADD_STUDENT_SUBJECT,
  UPDATE_STUDENT_SUBJECT,
  DELETE_STUDENT_SUBJECT,
};

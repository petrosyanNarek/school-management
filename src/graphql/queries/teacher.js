import { gql } from '@apollo/client';

const GET_SUBJECTS = gql`
  query GetSubjects {
    subjects {
      id
      name
      teacher {
        id
        user {
          firstName
          lastName
        }
      }
    }
  }
`;

const GET_SUBJECT = gql`
  query GetSubject($id: Int!) {
    subject(id: $id) {
      id
      name
    }
  }
`;

const ADD_SUBJECT = gql`
  mutation AddSubject($name: String!, $teacherId: Int!) {
    addSubject(name: $name, teacherId: $teacherId) {
      id
      name
    }
  }
`;

const UPDATE_SUBJECT = gql`
  mutation UpdateSubject($id: Int!, $name: String) {
    updateSubject(id: $id, name: $name) {
      id
      name
    }
  }
`;

const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: Int!) {
    deleteSubject(id: $id)
  }
`;

export {
  GET_SUBJECTS,
  GET_SUBJECT,
  ADD_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
};

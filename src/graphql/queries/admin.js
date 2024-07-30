import { gql } from '@apollo/client';

const GET_TEACHERS = gql`
  query GetTeachers {
    teachers {
      id
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const ADD_TEACHER = gql`
  mutation AddTeacher(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addTeacher(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      id
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const UPDATE_TEACHER = gql`
  mutation UpdateTeacher(
    $id: Int!
    $firstName: String
    $lastName: String
    $email: String
  ) {
    updateTeacher(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
    ) {
      id
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: Int!) {
    deleteTeacher(id: $id)
  }
`;

const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const ADD_STUDENT = gql`
  mutation AddStudent(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addStudent(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      id
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: Int!
    $firstName: String
    $lastName: String
    $email: String
  ) {
    updateStudent(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
    ) {
      id
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: Int!) {
    deleteStudent(id: $id)
  }
`;

export {
  GET_TEACHERS,
  ADD_TEACHER,
  UPDATE_TEACHER,
  DELETE_TEACHER,
  GET_STUDENTS,
  ADD_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
};

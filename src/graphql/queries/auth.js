import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

export const ME_QUERY = gql`
  query Me {
    getUserByToken {
      id
      email
      firstName
      lastName
      role
      Teacher {
        id
      }
      Student {
        id
      }
    }
  }
`;

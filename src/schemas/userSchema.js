import * as yup from 'yup';

export const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().when('$isNew', {
    is: true,
    then: () =>
      yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    otherwise: () => yup.string().notRequired(),
  }),
});

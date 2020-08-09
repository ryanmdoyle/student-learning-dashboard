import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

import FormWrapper from '../styled/blocks/FormWrapper';
import AlertContext from '../context/AlertContext';
import ModalContext from '../context/ModalContext';
import PagePadding from '../styled/PagePadding';
import { GET_ENROLLED_CLASSES, GET_ENROLLED_COURSES } from '../../gql/queries';

const ENROLL_MUTATION = gql`
  mutation ENROLL($enrollId: String!) {
    enroll(enrollId: $enrollId) {
      _id
    }
  }
`;

const EnrollForm = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const alert = useContext(AlertContext);
  const modal = useContext(ModalContext);
  const router = useRouter();

  const [enroll, { data }] = useMutation(ENROLL_MUTATION, {
    refetchQueries: [{ query: GET_ENROLLED_CLASSES }, { query: GET_ENROLLED_COURSES }],
    onCompleted: (data) => {
      if (modal.isOpen) {
        reset();
        modal.close();
      }
      router.push('/student/classes')
      alert.success(`Successfully enrolled in class!`)
    },
    onError: (data) => (alert.error(`Ooops, looks like there was a problem. ${data}`)),
  }
  )

  const onSubmit = data => {
    enroll({ variables: { enrollId: data.enrollId } });
  }

  return (
    <PagePadding>
      <h4>Enroll in Class</h4>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder='Enter Enroll ID' name='enrollId' ref={register({ required: true })}></input>
          <button type="submit">Enroll</button>
        </form>
      </FormWrapper>
    </PagePadding>
  );
};
export default EnrollForm;

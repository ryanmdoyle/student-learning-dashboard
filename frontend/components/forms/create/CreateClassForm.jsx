import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { gql, useQuery, useMutation } from '@apollo/client';

import FormWrapper from '../../styled/blocks/FormWrapper';
import PagePadding from '../../styled/PagePadding';
import Loading from '../../Loading';
import AlertContext from '../../context/AlertContext';
import ModalContext from '../../context/ModalContext';
import { INSTRUCTING_CLASSES_QUERY } from '../../Nav/NavStudentProgress';
import { GET_INSTRUCTING_COURSES } from '../../../gql/queries';

const CREATE_CLASS = gql`
    mutation CREATE_CLASS(
      $name: String!,
      $course: String!,
    ) {
      createClass(
        name: $name,
        course: $course,
      ) {
        name
      }
    }
  `;

const CreateClassForm = ({ courseId }) => {
  const { register, handleSubmit, errors, reset } = useForm();
  const alert = useContext(AlertContext)
  const modal = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);

  const courseQuery = useQuery(GET_INSTRUCTING_COURSES)
  const [createClass, { data }] = useMutation(CREATE_CLASS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: INSTRUCTING_CLASSES_QUERY }, { query: GET_INSTRUCTING_COURSES }],
    onCompleted: data => {
      reset();
      setSubmitting(false);
      modal.close();
      alert.success(`Successfully created course ${data.createClass.name}!`, 10);
    },
    onError: (error) => {
      setSubmitting(false);
      alert.error('Sorry, there was a problem creating your class.');
      console.log(error);
    }
  });

  const onSubmit = data => {
    setSubmitting(true);
    createClass({
      variables: {
        name: data.name,
        course: data.course || courseId,
      }
    })

  };

  if (courseQuery.loading) return <Loading />;
  return (
    <PagePadding>
      <h4>Create New Class</h4>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='name'>name*</label>
          <input type="text" name="name" ref={register({ required: true })} />
          {errors.name && 'Class name is required'}

          {!courseId && (
            <>
              <label htmlFor='course'>course*</label>
              <select name='course' ref={register({ required: true })}>
                <option disabled="" value="">Select the course this class is a part of:</option>
                {courseQuery.data.getCoursesInstructing.map(course => (
                  <option value={course._id} key={course._id}>{course.name}</option>
                ))}
              </select>
              {errors.course && 'Class course is required. If course is not available, make sure you created the course first!'}
            </>
          )}


          <button type='submit' disabled={submitting}>{submitting ? 'Saving...' : 'Create Class'}</button>
        </form>
      </FormWrapper>
    </PagePadding>
  );
};

CreateClassForm.propTypes = {
  courseId: PropTypes.string,
}

export default CreateClassForm;
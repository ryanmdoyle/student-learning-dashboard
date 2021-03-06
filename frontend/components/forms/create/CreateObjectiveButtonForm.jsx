import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

import FormWrapper from '../../styled/blocks/FormWrapper';
import AlertContext from '../../context/AlertContext';
import ModalContext from '../../context/ModalContext';
import PagePadding from '../../styled/PagePadding';
import { GET_PLAYLIST } from '../../../gql/queries';

const CREATE_OBJECTIVE_MUTATION = gql`
  mutation CREATE_OBJECTIVE(
    $name: String!,
    $playlist: String!,
    $description: String!,
  ) {
    createObjective(
      name: $name,
      playlist: $playlist,
      description: $description,
    ) {
      _id
      name
    }
  }
`;

const CreateObjectiveButtonForm = ({ playlistName, playlistId }) => {
  const { register, handleSubmit, errors } = useForm();
  const alert = useContext(AlertContext);
  const modal = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);

  const [addObjective, { data }] = useMutation(CREATE_OBJECTIVE_MUTATION, {
    refetchQueries: [{ query: GET_PLAYLIST, variables: { playlistId: playlistId } }],
    onCompleted: (data) => {
      setSubmitting(false);
      if (modal.isOpen) {
        modal.close();
      }
      alert.success(`Successfully added objective!`)
    },
    onError: (data) => {
      setSubmitting(false)
      alert.error(`Ooops, looks like there was a problem. ${data}`)
    },
  }
  )

  const onSubmit = data => {
    setSubmitting(true);
    addObjective({
      variables: {
        playlist: playlistId,
        ...data
      }
    })
  }

  return (
    <PagePadding>
      <h4>Add Objective to {playlistName}</h4>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='name'>name*</label>
          <input type="text" name="name" ref={register({ required: true })} />
          {errors.name && "Name is required"}

          <label htmlFor='description'>description</label>
          <textarea name="description" ref={register({ required: true, maxLength: 255 })} />
          {errors.description?.type === "required" && "Description is required."}
          {errors.description?.type === "maxLength" && "Maximum description length is 255 characters."}

          <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Add Objective'}</button>
        </form>
      </FormWrapper>
    </PagePadding>
  );
};

export default CreateObjectiveButtonForm;
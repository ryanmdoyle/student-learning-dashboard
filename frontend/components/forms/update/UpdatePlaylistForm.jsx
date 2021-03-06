import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';

import FormWrapper from '../../styled/blocks/FormWrapper';
import AlertContext from '../../context/AlertContext';
import ModalContext from '../../context/ModalContext';
import PagePadding from '../../styled/PagePadding';
import { GET_PLAYLIST } from '../../../gql/queries';

const UPDATE_PLAYLIST = gql`
    mutation UPDATE_PLAYLIST(
      $playlistId: ID!,
      $name: String!,
      $description: String!,
      $type: String!,
    ) {
      updatePlaylist(
        playlistId: $playlistId,
        name: $name,
        description: $description,
        type: $type,
      ) {
        _id
      }
    }
  `;

const UpdatePlaylistForm = ({ playlistData }) => {
  const { register, handleSubmit } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const alert = useContext(AlertContext);
  const modal = useContext(ModalContext);

  const { _id, name, description, type } = playlistData;

  const [updatePlaylist, { data }] = useMutation(UPDATE_PLAYLIST, {
    refetchQueries: [{ query: GET_PLAYLIST, variables: { playlistId: _id } }],
    onCompleted: (data) => {
      setSubmitting(false);
      modal.close();
      alert.success(`Successfully updated playlist.`)
    },
    onError: (data) => {
      setSubmitting(false);
      alert.error(`Ooops, looks like there was a problem. ${data}`)
    },
  })

  const onSubmit = data => {
    setSubmitting(true);
    updatePlaylist({
      variables: {
        playlistId: _id,
        name: data.name,
        description: data.description,
        type: data.type,
      }
    })
  }

  return (
    <PagePadding>
      <h4>Update Playlist</h4>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>

          <label htmlFor='name'>name*</label>
          <input type="text" name="name" defaultValue={name} ref={register({ required: true })} />

          <label htmlFor='type'>Type</label>
          <select name="type" defaultValue={type} ref={register()}>
            <option value='ESSENTIAL'>Essential</option>
            <option value='CORE'>Core</option>
            <option value='CHALLENGE'>Challenge</option>
          </select>

          <label htmlFor='description'>description</label>
          <textarea name="description" defaultValue={description} ref={register({ maxLength: 255 })} />
          <button type="submit" disabled={submitting}>{submitting ? "saving..." : 'Update Description'}</button>
        </form>
      </FormWrapper>
    </PagePadding >
  )
};

UpdatePlaylistForm.propTypes = {
  playlistData: PropTypes.object.isRequired,
}

export default UpdatePlaylistForm;
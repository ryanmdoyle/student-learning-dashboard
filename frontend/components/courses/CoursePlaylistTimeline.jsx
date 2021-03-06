import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { gql, useMutation } from '@apollo/client';

import CoursePlaylistBox from './CoursePlaylistBox';
import PlusButton from '../styled/elements/PlusButton';
import PlusButtonWithText from '../styled/elements/PlusButtonWithText';
import CreatePlaylistForm from '../forms/create/CreatePlaylistForm';
import ModalContext from '../context/ModalContext';
import AlertContext from '../context/AlertContext';

const playlistsContainer = css`
  box-sizing: border-box;
  height: 30px;
  width: 100%;
  display: flex;
`;

const UPDATE_PLAYLIST_ORDER = gql`
  mutation UPDATE_PLAYLIST_ORDER(
    $courseId: String!,
    $playlistType: String!,
    $source: Int!,
    $destination: Int!,
  ) {
    updatePlaylistOrder(
      courseId: $courseId,
      playlistType: $playlistType,
      source: $source,
      destination: $destination,
    ) {
      _id
    }
  }
`;

const CoursePlaylistTimeline = ({ type, playlists: queriedPlaylists, courseId, subject }) => {
  const modal = useContext(ModalContext);
  const alert = useContext(AlertContext);
  const router = useRouter();
  const studentView = router.pathname.startsWith('/student');

  const [playlists, setPlaylists] = useState(queriedPlaylists);
  useEffect(() => {
    setPlaylists(queriedPlaylists);
  }, [queriedPlaylists])

  const toggleModal = (courseData) => {
    modal.setChildComponent(
      <CreatePlaylistForm
        course={courseId}
        subject={subject}
        type={type}
      />
    )
    modal.open();
  }

  const [updateOrder, { data }] = useMutation(UPDATE_PLAYLIST_ORDER, {
    // refetchQueries: [{ query: GET_PLAYLIST, variables: { playlistId: playlistId } }],
    onCompleted: (data) => {
      alert.success(`Successfully reordered playlists!`, 2)
    },
    onError: (data) => (alert.error(`Ooops, looks like there was a problem. ${data}`)),
  })

  const handleDrag = result => {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    // update order in local state
    const draggedItem = playlists[source.index];
    const newOrderArr = [...playlists];
    newOrderArr.splice(source.index, 1);
    newOrderArr.splice(destination.index, 0, draggedItem)
    setPlaylists([...newOrderArr]);
    // update order in db
    updateOrder({
      variables: {
        courseId: courseId,
        playlistType: type,
        source: source.index,
        destination: destination.index,
      }
    })
  }

  // If no playlists and not a student, show button to add playlist
  if (playlists.length == 0 && !studentView) return (
    <>
      <h5>{type}</h5>
      <PlusButtonWithText onClick={toggleModal}>Create a {type} playlist!</PlusButtonWithText>
    </>
  );

  // If there are playlists, show playlist type
  if (playlists.length > 0) return (
    <>
      <h5>{type}</h5>
      <div>
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId={type} direction='horizontal' isDropDisabled={studentView} >
            {provided => (
              <div
                css={playlistsContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {/* Render the playlists in a row */}
                {playlists.map((playlist, index) => {
                  return <CoursePlaylistBox name={playlist.name} playlistId={playlist._id} best={playlist.best} key={playlist._id} index={index} />
                })}
                {provided.placeholder}
                {/* If a teacher/admin is viewing, show button to add playlist */}
                {!studentView && (
                  <PlusButton onClick={toggleModal} />
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );

  // if there are no playlists, return nothing
  return null;
};

CoursePlaylistTimeline.propTypes = {
  type: PropTypes.string,
  playlists: PropTypes.array,
  courseId: PropTypes.string,
  subject: PropTypes.string,
}

export default CoursePlaylistTimeline;
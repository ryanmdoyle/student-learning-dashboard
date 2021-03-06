import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import { DragDropContext } from 'react-beautiful-dnd';
import { gql, useMutation } from '@apollo/client';

import PlaylistResourceList from './PlaylistResourceList';
import TextButton from '../styled/elements/TextButton';
import PlusButtonWithText from '../styled/elements/PlusButtonWithText';
import ModalContext from '../context/ModalContext';
import AlertContext from '../context/AlertContext';
import CreateResourceForm from '../forms/create/CreateResourceForm';
import { GET_PLAYLIST } from '../../gql/queries';

const objectiveStyles = css`
  h4 {
  position: relative;
  ::after {
      position: absolute;
      top: 79%;
      transform: skew(45deg);
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--pink50);
      content: '';
      z-index: -100;
    }
  }
`;

const UPDATE_RESOURCE_ORDER = gql`
  mutation UPDATE_RESOURCE_ORDER(
    $objectiveId: String!,
    $source: Int!,
    $destination: Int!
  ) {
    updateResourceOrder(
      objectiveId: $objectiveId,
      source: $source,
      destination: $destination,
    ) {
      _id
    }
  }
`;

const PlaylistObjective = ({ objectiveId, objectiveName, objectiveDescription, resources, playlistId }) => {
  const [resourceArr, setResourceArr] = useState(resources);
  const modal = useContext(ModalContext);
  const alert = useContext(AlertContext);
  const { pathname } = useRouter();
  const studentView = pathname.startsWith('/student');
  const [updateOrder, { data }] = useMutation(UPDATE_RESOURCE_ORDER, {
    refetchQueries: [{ query: GET_PLAYLIST, variables: { playlistId: playlistId } }],
    onCompleted: (data) => {
      alert.success(`Successfully reordered!`, 2)
    },
    onError: (data) => (alert.error(`Ooops, looks like there was a problem. ${data}`)),
  })

  const addResourceModal = () => {
    modal.setChildComponent(
      <CreateResourceForm
        objectiveName={objectiveName}
        objectiveId={objectiveId}
        playlistId={playlistId}
      />)
    modal.open();
  }

  const handleDrag = result => {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const draggedItem = resourceArr[source.index];
    const newOrderArr = [...resourceArr];
    newOrderArr.splice(source.index, 1);
    newOrderArr.splice(destination.index, 0, draggedItem)
    setResourceArr([...newOrderArr]);

    updateOrder({
      variables: {
        objectiveId: objectiveId,
        source: source.index,
        destination: destination.index,
      }
    })
  }

  useEffect(() => {
    setResourceArr([...resources])
  }, [resources])

  return (
    <div>
      <a name={objectiveId}></a>
      <h4>{objectiveName}</h4>
      <small>{objectiveDescription}</small>
      <DragDropContext onDragEnd={handleDrag}>
        <PlaylistResourceList resources={resourceArr} objectiveId={objectiveId} playlistId={playlistId} />
      </DragDropContext>
      {!studentView && (
        <PlusButtonWithText onClick={addResourceModal} css={css`padding-left: 0.65rem;padding-top: 0.5rem;`}>Add Resource</PlusButtonWithText>
      )}
    </div>
  );
};

PlaylistObjective.propTypes = {
  playlistId: PropTypes.string.isRequired,
  objectiveId: PropTypes.string.isRequired,
  objectiveName: PropTypes.string.isRequired,
  objectiveDescription: PropTypes.string.isRequired,
  resources: PropTypes.array,
}

export default PlaylistObjective;
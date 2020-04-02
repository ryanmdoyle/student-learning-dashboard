import React from 'react';
import { css } from '@emotion/core';

const details = css`
  background-color: var(--blueMedium);
  width: 100%;
  min-height: 200px;
  padding: 0 1rem;
  box-shadow: var(--shadowLight);

  display: flex;
  .flex-item {
    width: 50%;
    padding-right: 0.6rem;
  }
  .objectives { 
    padding-left: 1rem;
  }
`;

const PlaylistDetails = () => {
  return (
    <div css={details}>
      <div className='flex-item'>
        <h2 css={css`color: var(--pink);`}>Playlist Title</h2>
        <p>Here are some details about the playlist that would be important</p>
      </div>
      <div className='flex-item objectives'>
        <h3>Objectives</h3>
      </div>
    </div>
  );
};

export default PlaylistDetails;
import React from 'react';
import { css } from '@emotion/core';

import PlaylistBox from '../courses/PlaylistBox';
import PlusButton from '../styled/elements/PlusButton';
import MinusButton from '../styled/elements/MinusButton';
import { PlaylistEnum } from '../../lib/enums';

const playlistsContainer = css`
  box-sizing: border-box;
  height: 30px;
  width: 100%;
  display: flex;
`;

const courseContainer = css`
  box-sizing: border-box;
  width: calc( 100% - 2rem);
  padding: 1rem;
  margin: 1rem 0 0 1rem;
  border-radius: var(--borderRadius);
  transition: box-shadow 0.15s;
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--blueDark);
  }
  h2  {margin: 0.2rem 0; }
  h4, h5 { margin: 0.6rem 0; }
  h5 { color: var(--blueMedium);}


  :hover {
    box-shadow: var(--shadowMedium);
    transition: box-shadow 0.15s;
  }
`;

const title = css`
  display: flex;
  align-items: center;
`;

const playlistButton = css`
  font-size: 0.7rem;
  margin-left: 0.2rem;
  opacity: 1;
  :hover { opacity: 1;}
`;

const CourseTimeline = ({ name, playlists }) => {
  const essential = playlists.filter(playlist => playlist.type === PlaylistEnum.Essential);
  const core = playlists.filter(playlist => playlist.type === PlaylistEnum.Core);
  const challenge = playlists.filter(playlist => playlist.type === PlaylistEnum.Challenge);

  return (
    <section css={courseContainer}>
      <h4>{name}</h4>

      {(essential.length > 0) && (
        <>
          <h5>Essential</h5>
          <div css={playlistsContainer}>
            {essential.map(playlist => {
              return <PlaylistBox name={playlist.name} playlistId={playlist._id} key={playlist._id} />
            })}
            <div css={css`min-width: 3rem;display: flex;align-items:center;`}>
              <PlusButton css={playlistButton} />
            </div>
          </div>
        </>
      )}
      {core.length > 0 && (
        <>
          <h5>Core</h5>
          <div css={playlistsContainer}>
            {core.map(playlist => {
              return <PlaylistBox name={playlist.name} playlistId={playlist._id} key={playlist._id} />
            })}
          </div>
        </>
      )}

      {challenge.length > 0 && (
        <>
          <div css={title}>
            <h5>Core</h5>
            <PlusButton css={playlistButton} />
          </div>
          <div css={playlistsContainer}>
            {challenge.map(playlist => {
              return <PlaylistBox name={playlist.name} playlistId={playlist._id} key={playlist._id} />
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default CourseTimeline;
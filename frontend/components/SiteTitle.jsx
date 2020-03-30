import React from 'react';
import { css } from '@emotion/core';

const mainContainer = css`
  display: flex;
  padding: 0 1rem;
`;

const logo = css`
  display: flex;
  align-items: center;
  justify-content: center;
  h1 { margin: 2rem 0; }
`

const title = css`
  /* reset h1 size so site title is h1 while the other headers are h2 or less */
  h1 {
    font-size: 1.8rem;
    color: var(--pink);
    margin: 2rem 0;
    margin-left: 0.5rem;
  }
`;

const SiteTitle = () => {
  return (
    <div css={mainContainer}>
      <div css={logo}>
        <h1>🏔️</h1>
      </div>
      <div css={title}>
        <h1>Alpenglow Learning</h1>
      </div>

    </div>
  );
};

export default SiteTitle;
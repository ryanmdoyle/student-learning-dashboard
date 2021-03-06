import React, { useContext, useEffect } from 'react';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';

import NavPanel from '../../Nav/NavPanel';
import Alert from '../../Alert';
import Modal from '../../Modal'
import ComponentWithRouteProtection from '../../ComponentWithRouteProtection';
import UserContext from '../../context/UserContext';
import Loading from '../../Loading';
import NavLanding from '../../Nav/NavLanding';
import PageEndPadding from './PageEndPadding';


const dashboard = css`
  height: 100vh;
  max-width: 100vw;
  display: grid;
  grid-template-columns: var(--navWidth) 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-template-areas:
    "nav main";
  overflow: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar) var(--scrollbarBG);

    nav {
      grid-area: nav;
      border-right: 1px solid var(--grey);
      height: 100vh;
      box-shadow: var(--shadowMedium);
      background-color: var(--blueDark);
    }

    main {
      position: relative;
      grid-area: main;
      height: 100vh;
      width: 100%;
      overflow-y: scroll;
    }
`;

const landing = css`
  height: 100vh;
  max-width: 100vw;
  nav {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    height: 120px;
    padding: 0 1rem;
    background-color: var(--blueDark);
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      margin: 0;
      color: var(--pink);
      flex-grow: 1;
    }
    img {
      padding-right:1rem;
    }
    @media (max-width: 500px) {
      font-size: 0.6rem;
      img { width: 70px}
    }
    @media (max-width: 350px) {
      font-size: 0.5rem;
    }
  }

  main {
    width: 100%;
    height: 100vh;
    max-width: 1000px;
    margin: auto;
    padding: calc(120px + 2rem) 2rem 2rem 3rem;
    @media (max-width: 500px) {
      padding: calc(120px + 2rem) 1rem 1rem 1rem;
    }
  }
`;

const LayoutController = ({ Component, pageProps }) => {
  const user = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    //refetches user on all page changes (mimick sessions and ssr)
    user.refetch();
  }, [router])

  if (user?.loading) return <Loading />
  if (user._id) return (
    <div css={dashboard}>
      <NavPanel />
      <main>
        <ComponentWithRouteProtection Component={Component} pageProps={pageProps} />
        <Alert />
        <Modal />
        <PageEndPadding />
      </main>
    </div>
  );

  // Renders a different layout based on user being logged in or out
  return ( // once context fetches user, it will be null if loaidng is complete and there is no user
    <div css={landing}>
      <NavLanding />
      <main>
        <ComponentWithRouteProtection Component={Component} pageProps={pageProps} />
      </main>
      <Alert css={css`width: 100%;`} />
    </div>
  )
};

export default LayoutController;
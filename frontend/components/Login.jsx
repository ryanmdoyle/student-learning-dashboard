import React, { useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import fetch from 'isomorphic-unfetch';
import jwt from 'jwt-simple';


const Login = () => {
  const fromGoogle = (response) => {
    //change to isomatric unfetch
    fetch('http://localhost:4000/auth/google', {
      method: 'POST',
      credentials: "include", //MUST include for client to set cookie
      body: { tokenId: response.tokenId }
    }) // auth/google
      .then((res) => {
        console.log('response sent: ', res);
      })
      .catch((err) => {
        console.error(err);
      })
  }

  const logout = (response) => {
    console.log(response);
  }


  return (
    <>
      <GoogleLogin
        clientId="740708519996-jckm5svthu1lh5fv35jc55pp54kam9br.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={fromGoogle}
        onFailure={fromGoogle}
      // cookiePolicy={'single_host_origin'}
      />
      <GoogleLogout
        clientId="740708519996-jckm5svthu1lh5fv35jc55pp54kam9br.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}
      >
      </GoogleLogout>
    </>
  );
};

export default Login;
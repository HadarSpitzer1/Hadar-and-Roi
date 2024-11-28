//index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';


const domain = 'dev-l4b7zycsqg4rtctm.us.auth0.com';
const clientId = 'OJeqn5dg1HadjyvN7bZXSgSy7HjnIT58';
const audience = 'https://dev-l4b7zycsqg4rtctm.us.auth0.com/api/v2/'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain = {domain}
      clientId = {clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-l4b7zycsqg4rtctm.us.auth0.com/api/v2/', // Add your Auth0 API Identifier here
        issuer: 'https://dev-l4b7zycsqg4rtctm.us.auth0.com/'
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

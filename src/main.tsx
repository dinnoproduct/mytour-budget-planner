import React from 'react';
import ReactDOM from 'react-dom/client';
import '@shared/configs/i18next';
import App from './app/App.tsx';
import './index.css';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);

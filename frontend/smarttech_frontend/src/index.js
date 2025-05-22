import i18n from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
    <App />
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();

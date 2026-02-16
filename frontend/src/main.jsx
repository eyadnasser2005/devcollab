import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as AuthContextModule from './context/AuthContext';
import './styles/globals.css';

const AuthProvider =
  AuthContextModule.AuthProvider ||
  AuthContextModule.default ||
  (({ children }) => children);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

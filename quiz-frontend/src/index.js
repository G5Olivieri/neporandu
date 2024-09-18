import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './routes/App';
import Quiz from './routes/Quiz';
import Login from './routes/Login';
import Register from './routes/Register';
import Category from './routes/Category';
import reportWebVitals from './reportWebVitals';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './auth/useAuth';
import { UserProvider } from './auth/useUser';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/quiz',
    element: <PrivateRoute><Quiz /></PrivateRoute>
  },
  {
    path: '/categories/:categoryId',
    element: <PrivateRoute><Category /></PrivateRoute>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

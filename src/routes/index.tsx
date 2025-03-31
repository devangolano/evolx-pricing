import { createBrowserRouter } from 'react-router-dom';
import Entrar from '../pages/auth/Login';
import Criar from '../pages/auth/Criar';
import Dashboard from '../pages/dashboard/Index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/auth',
    children: [
      {
        path: 'entrar',
        element: <Entrar />,
      },
      {
        path: 'criar',
        element: <Criar />,
      }
    ]
  }
]);
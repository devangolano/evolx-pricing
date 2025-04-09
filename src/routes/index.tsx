import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import Entrar from '../pages/auth/Login';
import Criar from '../pages/auth/Criar';
import Dashboard from '../pages/dashboard/Index';
import { Profile } from '../pages/Profile';
import { Layout } from '../components/layout/Layout';
import PriceBaskets from '../pages/PriceBaskets';
import { Baskets } from '../pages/Baskets';
import { Support } from '../pages/Support';
import { PriceCatalog } from '../pages/PriceCatalog';
import { ProductCatalog } from '../pages/ProductCatalog';
import { Settings } from '../pages/Settings';
import NewBasketForm from '@/pages/new-basket-form';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/inicio" replace />,
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
  },
  {
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/inicio',
        element: <Dashboard />,
      },
      {
        path: '/cestas-precos',
        element: <PriceBaskets />,
      },
      {
        path: '/cestas-precos/:basketId',
        element: <PriceBaskets />,
      },
      {
        path: '/cestas-precos/novo',
        element: <NewBasketForm />, 
      },
      {
        path: '/basket/:id',
        element: <PriceBaskets />,
      },
      {
        path: '/cestas',
        element: <Baskets />,
      },
      {
        path: '/atendimento',
        element: <Support />,
      },
      {
        path: '/catalogo-precos',
        element: <PriceCatalog />,
      },
      {
        path: '/catalogo-produtos',
        element: <ProductCatalog />,
      },
      {
        path: '/configuracoes',
        element: <Settings />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ]
  }
]);
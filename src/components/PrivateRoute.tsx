import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Aqui você deve implementar sua lógica de verificação de autenticação
  // Por exemplo, verificar se existe um token no localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/auth/entrar" replace />;
  }

  return <>{children}</>;
};
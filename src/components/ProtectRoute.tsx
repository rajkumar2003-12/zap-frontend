import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const token = localStorage.getItem('authToken'); 

  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return element;
};

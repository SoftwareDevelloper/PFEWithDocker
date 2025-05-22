import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';
    const PrivateRoute = ({ allowedRoles }) => {
        const token = localStorage.getItem('auth-token');

            if (!token) {
                return <Navigate to="/" replace />;
            }

            try {
                const decodedToken = jwtDecode(token);
                  console.log("Decoded Token:", decodedToken); // 👈 ADD THIS
                const userRole = decodedToken.Role;
                  console.log("user role:",userRole); // 👈 ADD THIS

                if (allowedRoles.includes(userRole)) {
                return <Outlet />;
                } else {
                return <Navigate to="/unauthorized" replace />;
                }
            } catch (error) {
                console.error('Invalid token:', error);
                return <Navigate to="/" replace />;
            }
            };


export default PrivateRoute

import React from 'react'
// import LoginPage from '../login/loginPage';
import  useAuth  from './AuthContext';
import { Navigate} from 'react-router-dom';


function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();

    return (currentUser ? 
        <Navigate to="/home"/> : 
        <Navigate to="/" replace="true" />     
    )
}

export default PrivateRoute
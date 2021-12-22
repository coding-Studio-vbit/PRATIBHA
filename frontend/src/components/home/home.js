import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Home() {
    const {currentUser,signOut}=useAuth();
    
    return currentUser!=null?(
        <div>
               Hello {currentUser.userType}     
        </div>
    ):<Navigate to="/"/>;
}

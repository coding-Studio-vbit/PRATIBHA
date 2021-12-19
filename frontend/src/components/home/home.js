import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Home() {
    const {currentUser,signOut,loading }=useAuth();

    async function logOut() {
       signOut()      
    }

    return currentUser!=null?(
        <div>
            {
                loading?
                <p>Loading</p>:
                <p>{JSON.stringify(currentUser)}</p>
            }  
            <button onClick={()=>logOut()}>LOGOUT</button>         
        </div>
    ):<Navigate to="/" />;
}

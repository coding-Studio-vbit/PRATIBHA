import React,{useEffect,useState} from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
    const {currentUser,signOut}=useAuth();
    const [isVerified, setIsVerified] = useState(true);
    const [error, setError] = useState(null);

    async function logOut() {
       signOut()      
    }

    console.log(currentUser);

    async function fetchData(){
        if(currentUser.userType==="STUDENT"){
            const docRef = doc(db,"users",currentUser.email);
            try{
                console.log(10);
                const docSnap = await getDoc(docRef);   
                if(docSnap.exists()){
                    console.log(docSnap,298103);
                    console.log(9);
                    setIsVerified(true);                        
                }else{
                    console.log(8);
                    setIsVerified(false);
                }                     
            }catch(e){
                console.log(7);
                setIsVerified(false);
                setError(e.toString());                                    
            }
        }
        else if(currentUser.userType==="FACULTY"){
            const docRef = doc(db,"faculty",currentUser.email);
            try{
                console.log(11);
                const docSnap = await getDoc(docRef);   
                if(docSnap.exists()){
                    setIsVerified(true);                        
                }else{
                    setIsVerified(false);
                }                     
            }catch(e){
                setIsVerified(false);
                setError(e.toString());                                    
            }                                    
        }        
    }

    useEffect(() => {
        if(currentUser!=null){
            fetchData(currentUser.userType);                
        }
    },);

    return currentUser!=null?(
        <div>
            {
                <div>
                    <p>{isVerified} fyfhj</p>
                    <p>{error}</p>
                    <p></p>
                    <p>{JSON.stringify(currentUser)}</p>
                    <button onClick={()=>logOut()}>LOGOUT</button>         
                </div>
            }          
        </div>
    ):<Navigate to="/"/>;
}

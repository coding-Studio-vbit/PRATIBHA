import React,{useEffect,useState} from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
    const {currentUser,signOut}=useAuth();
    const [isVerified, setIsVerified] = useState();
    const [isEnrolled, setisEnrolled] = useState();
    const [error, setError] = useState(null);

    async function logOut() {
       signOut();     
    }

    async function fetchData(){
        if(currentUser.userType==="STUDENT"){
            const docRef = doc(db,"users",currentUser.email);
            try{
                const docSnap = await getDoc(docRef);   
                if(docSnap.exists()){
                    console.log(docSnap.data(),298103);
                    setIsVerified(true); 
                    if(docSnap.data()['isEnrolled']){

                    }                       
                }else{
                    setIsVerified(false);
                }                     
            }catch(e){
                setIsVerified(false);
                setError(e.toString());                                    
            }
        }
        else if(currentUser.userType==="FACULTY"){
            const docRef = doc(db,"faculty",currentUser.email);
            try{
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
                    <p>{error}</p>
                    <p></p>
                    <p>{JSON.stringify(currentUser)}</p>
                    <button onClick={()=>logOut()}>LOGOUT</button>         
                </div>
            }          
        </div>
    ):<Navigate to="/"/>;
}

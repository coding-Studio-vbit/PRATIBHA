import React,{ useState,useContext,useEffect} from 'react'
import { auth } from '../../firebase';
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

const AuthContext= React.createContext();

function checkStudent(myString){
  if(myString.slice(2,6)==="p61a"){
      return true;
  }else{
      return false;
  }
}


export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
  
    async function signInWithGoogle(){
      const provider = new GoogleAuthProvider();
      setLoading(true);
      try{
        await signInWithPopup(auth, provider);
      }
      catch(e){
        console.log(e);
        setCurrentUser(null);
        setLoading(false);
      }
    };
    
    async function signOut() {
      setLoading(true);   
      try{
        await auth.signOut();  
        setCurrentUser(null);
        setLoading(false);      
      }
      catch(e){
        setLoading(false);
      }
    }
  
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        let userType="";
        if(user!=null){
          if(user.email.split('@')[1] === 'vbithyd.ac.in'){
            if(checkStudent(user.email.split('@')[0])){
              userType="STUDENT";              
            }else{
              userType="FACULTY";
            }
            setCurrentUser({
              uid:user.uid,
              email:user.email,
              profileURL:user.photoURL,
              username:user.displayName,
              phoneNumber:user.phoneNumber,
              userType:userType,
            });
            setLoading(false);
          }
          else{
            console.log("Domain Mismatch");
            setLoading(true);
            try{
              signOut();
            }
            catch(e){
              console.log("Signout Failed");
            }
            setLoading(false);
          } 
        }else{
          setCurrentUser(null);
          setLoading(false)
        }
      });  
    }, [])
  
    const value = {
      currentUser,
      loading,  
      signInWithGoogle, 
      signOut
    }

    return (  
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>          
    )
}
import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext();

// const hasNumber=(myString)=> /\d/.test(myString);
function checkStudent(myString) {
  if (myString.slice(2, 6) === "p61a") {
    return true;
  } else {
    return false;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.log(e);
      setCurrentUser(null);
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await auth.signOut();
      setCurrentUser(null);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true)
    auth.onAuthStateChanged(async (user) => {
      let userType = "";
      let isFirstTime = true;
      if (user != null) {
        if (user.email.split("@")[1] === "vbithyd.ac.in") {
          if (checkStudent(user.email.split("@")[0])) {
            userType = "STUDENT";

            const docRef = doc(db, "users", user.email);
            try {
              console.log(10);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {                
                isFirstTime = false;
              }
            } catch (e) {
              //Display it
            }
          } else {
            userType = "FACULTY";
            const docRef = doc(db, "faculty", user.email);
            try {
              console.log(11);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                isFirstTime = false;
              } 
            } catch (e) {
              //TODO
               //DISPLAY
             }
           }
           setCurrentUser({
             uid: user.uid,
             email: user.email,
             profileURL: user.photoURL,
             username: user.displayName,
             phoneNumber: user.phoneNumber,
             userType: userType,
             isFirstTime:isFirstTime
          });
           setLoading(false);
         } else {
          console.log("Domain Mismatch");
          setLoading(true);
          try {
            signOut();
          } catch (e) {
            console.log("Signout Failed");
          }
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// import React, { createContext, useReducer,useEffect } from "react";
// import {auth} from '../../firebase.js'

// export const AuthReducer = (state, action) => {
//   switch (action.type) {
//     case "PROCESSING":
//       return {
//         ...state,
//         isLoading: action.payload,
//       };
//     case "LOGIN":
//       return {
//         ...state,
//         user: action.payload,
//         isLoading:false
//       };
//     case "LOGOUT":
//       return {
//         ...state,
//         user: action.payload,
//         isLoading:false
//       };
//       default:
//         return {
//           ...state,
//           user: null,
//           isLoading:false
//         };
//   }
// };

// const initialState = {
//   user:null,
//   isLoading:false,
// };

// export const AuthContext = createContext();

// export const AuthProvider = (props) => {

//   useEffect(() => {
//     dispatch({
//       type: "PROCESSING",
//       payload:true,
//     });

//     const unsubscribe = auth.onAuthStateChanged(user => {
//       dispatch({
//         type: "LOGIN",
//         payload: user,
//       });
//     })
//     return unsubscribe
//   }, [])

//   const [state, dispatch] = useReducer(AuthReducer, initialState);

//   return (
//     <AuthContext.Provider value={{ user: state.user,isLoading:state.isLoading,dispatch }}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// };

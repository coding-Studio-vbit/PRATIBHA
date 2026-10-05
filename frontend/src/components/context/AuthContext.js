import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { LoadingScreen } from "../global_ui/spinner/spinner";
import { fetchSemNumber } from "../student/services/studentServices";
import { getAcademicYear } from "../faculty/services/adminDeadlinesServices";

const AuthContext = React.createContext();

// const hasNumber=(myString)=> /\d/.test(myString);
function checkStudent(myString) {
  if (myString.slice(2, 4) === "p6") {
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
  const [loading, setLoading] = useState(true);
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      setLoading(false)
    } catch (e) {
      console.log(e);
      setCurrentUser(null);
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      await auth.signOut();      
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      let userType = "";
      let isFirstTime = true;
      let isHOD = false;
      let isAdmin = false;

      let roles = [];
      let isFirstYearHOD = false
      let isCOE = false
      let academicYear = null
      let currentSem = null
      let userDepartment = null;
      if (user != null) {
        if (user.email.split("@")[1] === "vbithyd.ac.in") {
          if (checkStudent(user.email.split("@")[0])) {
            userType = "STUDENT";
            const docRef = doc(db, "students", user.email);
            try {
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data()
              academicYear = (await getAcademicYear(data.course, data.year)).data
              const semester = data.semester;
              currentSem = await fetchSemNumber(data.course,data.year);
              if (semester === currentSem) {
                isFirstTime = false;
              } else {
                isFirstTime = true;
              }
              }
              else {
                console.log(user);
                user.email  = null
              }
            } catch (e) {
              //Display it
            }
          } else {
            userType = "FACULTY";
            const docRef = doc(db, "faculty", user.email);
            try {
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const fData = docSnap.data();
                roles = fData.role ? fData.role : [];
                if (fData.isFirstYearHOD) {
                  isFirstYearHOD = true;
                }
                if (fData.isHOD) {
                  isHOD = true;
                }
                if (fData.isCOE) {
                  isCOE = true;
                  isFirstTime = false;
                }
                if (fData.isAdmin) {
                  isAdmin = true;
                  isFirstTime = false;
                }
                if (fData.isEnrolled) {
                  isFirstTime = false;
                }

                // Department identification
                if (fData.adminDept) {
                  userDepartment = fData.adminDept.toUpperCase();
                } else if (fData.department) {
                  userDepartment = fData.department.toUpperCase();
                }

                if (!userDepartment && user.email) {
                  const localPart = user.email.split("@")[0].toLowerCase();
                  if (localPart.startsWith("adminpra.")) {
                    const deptPart = localPart.split(".")[1];
                    if (deptPart) userDepartment = deptPart.toUpperCase();
                  }
                }

                if (!userDepartment && roles.length > 0) {
                  for (let r = 0; r < roles.length; r++) {
                    const parts = roles[r].split("_");
                    if (parts.length >= 2 && parts[1]) {
                      userDepartment = parts[1].toUpperCase();
                      break;
                    }
                  }
                }

                if (!userDepartment && isHOD && user.email) {
                  const prefix = user.email.split("@")[0].toLowerCase();
                  if (prefix.length <= 4) {
                    userDepartment = prefix.toUpperCase();
                  }
                }
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
            isFirstTime: isFirstTime,
            isHOD: isHOD,
            isCOE: isCOE,
            isAdmin: isAdmin,
            isFirstYearHOD: isFirstYearHOD,
            roles: roles,
            department: userDepartment,
            academicYear,
            currentSem,
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
        sessionStorage.clear();
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
  

  return <AuthContext.Provider value={value}>{ loading? <LoadingScreen/>: children}</AuthContext.Provider>;
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

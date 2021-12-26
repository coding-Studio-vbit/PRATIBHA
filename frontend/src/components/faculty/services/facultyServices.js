import { db } from "../../../firebase";
import { doc,getDoc,updateDoc,query,collection, addDoc, setDoc } from "firebase/firestore"; 

async function getEnrolledCourses(email){
    const docRef = doc(db, "faculty",email);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          data:docSnap.data()["subjects"],
          error:null
        }
      } else {
        return {
          data:null,
          error:"Enroll Courses to get details"
        }
      }
    } catch (error) {
      return {
        data:null,
        error:error.code
      }      
    }    
}

async function enrollClasses(email,enrolled_classes){
  const facultyRef = doc(db, "faculty",email);
  try {
    await setDoc(facultyRef,{subjects:enrolled_classes,isEnrolled:false});
    for (let i = 0; i < enrolled_classes.length; i++) {
      await setDoc(
        doc(db,`faculty/${email}/${enrolled_classes[i]}`,email),{
          random:1
      });
    }     
    await updateDoc(facultyRef,{isEnrolled:true});     
  } catch (error) {
    return error.code;
  }
  return null;      
}

async function fetchStudentPRA(email,subject) {
  const facultyRef = doc(db,`faculty/${email}/subject/`,email+"@vbithyd.ac.in");
  const userRef = doc(db,"users",email+"@vbithyd.ac.in");

  let res={};
  try{
    const docSnap = await getDoc(facultyRef);
    if(docSnap.exists()){      
        res.marksDoc=docSnap.data();
        res.error=null;
        const dataSnap = await getDoc(userRef);
        // if()
    }else{
        return {
          error:"Not Graded Yet"
        }
    }
  }catch(e){

  }  
}

// async function createSubCollection() {
//   console.log("Started");
//   try {
//     await setDoc(doc(db,`dummy/abcd/ABCD`,"Lafoot"), {
//       name: "Tokyo",
//       country: "Japan"
//     });
//   } catch (error) {
//     console.log("Fucked",error);    
//   }
//   console.log("Ended");   
// }

export {getEnrolledCourses,enrollClasses};

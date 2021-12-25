import { db } from "../../../firebase";
import { doc,getDoc } from "firebase/firestore"; 

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
  const docRef = doc(db, "faculty",email);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
      
}

export {getEnrolledCourses};

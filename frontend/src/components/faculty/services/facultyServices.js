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

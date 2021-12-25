import { db } from "../../../firebase";
import { doc,updateDoc,getDoc,query, collection, getDocs } from "firebase/firestore"; 


async function getEnrolledCourses(email){
    const docRef = doc(db, "faculty",email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
        
}

export {getEnrolledCourses};

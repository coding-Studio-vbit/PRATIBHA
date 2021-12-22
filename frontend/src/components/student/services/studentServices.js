import { doc,updateDoc,getDoc } from "firebase/firestore"; 
import {db} from '../../../firebase'


async function checkEnrollment(email) {
    let error=null;
    const userRef = doc(db, 'users', email);   
    try {
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            if(userDoc.data()["isEnrolled"]){
                error="STUDENT_ENROLLED"
            }else{
                error=null;
            }
        }else{
            error="STUDENT_NOT_VERIFIED";
        }
    } catch (e) {
        error="UNKNOWN_ERROR";        
    }
    return error;
}

async function enrollCourse(email,course_details) {
    let error=null;
    const userRef = doc(db, 'users', email);   
    try{
        await updateDoc(userRef,course_details); 
    }
    catch(e){
        console.log(e);
        error=e.toString();
    }
    return error;
}

export {enrollCourse,checkEnrollment};
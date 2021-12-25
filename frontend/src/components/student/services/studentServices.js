import { async } from "@firebase/util";
import { doc,setDoc,getDoc,query, collection, getDocs } from "firebase/firestore"; 
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
        await setDoc(userRef,course_details); 
    }
    catch(e){
        console.log(e);
        error=e.code;
    }
    return error;
}

async function getStudentData(email){
    try{
        const userRef = doc(db,"users", email);   
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            if(userDoc.data()["isEnrolled"]){
                return {document:userDoc.data(),error:null};
            }else{
                return {document:null,error:"Enroll the details to access"}
            }
        }else{
            return {document:null,error:"User not verified"}
        }       
    }
    catch(e){
        return {document:null,error:e.toString()}
    }        
}


async function getCurriculumDetails(course_details) {
    const curriculumRef=query(
        collection(
            db,`curriculum/${course_details.course}/${course_details.year}`
        )
    );
    try {
        const docs = await getDocs(curriculumRef);
        let docSnap=null;
        docs.forEach((doc) => {
            if(doc.id===`${course_details.department}`){
                docSnap=doc;
            } // "doc1" and "doc2"
        });
        if(docSnap!=null){
            console.log(docSnap.data(),10);
            let reg = docSnap.data()['subjects'];
            let oe  = [];
            let pe  = [];
            if(docSnap.data()['open_electives']!=null){
                oe=docSnap.data()['open_electives']
            }
            if(docSnap.data()['professional_electives']!=null){
                pe=docSnap.data()['professional_electives']
            }
            console.log(pe);
            if(oe.length===0 || pe.length===0){
                return { 
                    document:[reg], 
                    error:null
                };
            }else{
                return {
                    document:[reg,oe,pe],
                    error:null
                }
            }           
        }else{
            return { document:null, error:'Give proper details to enroll'}
        } 
    } catch (error) {
        return {document:null,error:error.toString()}                
    }  
}

async function getSubjectsList(email){
    const userRef = collection(db, "users");
    try {
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            return {
                data:{ 
                    subjects:userDoc.data()["subjects"],
                    openElectives:userDoc.data()["oe"]?userDoc.data()["oe"]:null,
                    professionalElectives:userDoc.data()["pe"]?userDoc.data()["pe"]:null,
                },
                error:null
            } 
        }else{
            return {
                data:null,
                error:"Enroll Details to get subject information"
            }
        }
    } catch (e) {
        return {
            data:null,
            error:e.code,
        }       
    }
}

export {enrollCourse,checkEnrollment,getStudentData,getCurriculumDetails,getSubjectsList};
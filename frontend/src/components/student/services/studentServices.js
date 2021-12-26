import { doc,setDoc,getDoc,query, collection, getDocs } from "firebase/firestore"; 
import {db} from '../../../firebase'

async function checkEnrollment(email) {
    let error=null;
    const userRef = doc(db, 'users', email);   
    try {
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            error=null;
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
        error=e.code;
    }
    return error;
}

async function getStudentData(email){
    try{
        const userRef = doc(db,"users", email);   
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            return { document:userDoc.data(), error:null };
        }else{
            return { document:null, error:"Enroll the details to access"}
        }       
    }
    catch(e){
        return { document:null, error:e.code }
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
            let result={
                subjects:docSnap.data()['subjects'],
                sections:docSnap.data()['sections']
            };
            if(docSnap.data()['OEs']!=null){
                result.oe=docSnap.data()['OEs'];
                result.numberOEs=docSnap.data()['numberOEs'];
            }
            if(docSnap.data()['PEs']!=null){
                result.pe=docSnap.data()['PEs'];
                result.numberPEs=docSnap.data()['numberPEs'];
            }
            return {
                document:result,
                error:null
            }                     
        }else{
            return { document:null, error:'Give proper details to enroll'}
        } 
    }catch(error){
        return {document:null,error:error.toString()}                
    }  
}

async function getSubjectsList(email){
    const userRef = doc(db, "users",email);
    try {
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            return {
                data:{ 
                    subjects:userDoc.data()["subjects"],
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


async function fetchDepartments(course,year){
    const depRef = query(collection(db,`curriculum/${course}/${year}`));
    try {
        const docs = await getDocs(depRef);
        let depList=[];
        docs.forEach(e=>{
            depList.push(e);
        })
        return {
            data:depList,
            error:null
        }                
    } catch (error) {
        return {
            data:null,
            error:error.code
        }         
    }             
}

export {enrollCourse,checkEnrollment,getStudentData,getCurriculumDetails,getSubjectsList,fetchDepartments};
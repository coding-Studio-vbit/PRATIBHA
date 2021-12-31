import { doc,setDoc,getDoc,query, collection, getDocs, Timestamp } from "firebase/firestore"; 
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

export const fetchisMid1 = async () => {
    try {
        const adminRef = doc(db, "adminData", "coeDeadline");
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let date = new Timestamp(adminDoc.data()["coeDeadline"]["seconds"],adminDoc.data()["coeDeadline"]["nanoseconds"]).toDate();
      const currentdate = new Date()
      if(date > currentdate){
        return true
      }
      return false;
    }
    } catch (error) {
        console.log(error);
    }
};

export const fetchisMid2 = async () => {
    try {
        const adminRef = doc(db, "adminData","coeDeadline");
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
        let date1 = new Timestamp(adminDoc.data()["coeDeadline"]["seconds"],adminDoc.data()["coeDeadline"]["nanoseconds"]).toDate();
      let date2 = new Timestamp(adminDoc.data()["coeDeadline2"]["seconds"],adminDoc.data()["coeDeadline2"]["nanoseconds"]).toDate();
      const currentdate = new Date()
      if(date1 < currentdate&& date2 >currentdate){
        return true
        
      }
      return false;
    }
    } catch (error) {
        console.log(error);
    }
};


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

async function getDeadLines(course,year,department,section,subject,midNo){
    
    const deadLinesRef = doc(db,"subjects",`${course}_${year}_${department}_${section}`);
    try {
        const deadLineDoc = await getDoc(deadLinesRef);
        if(deadLineDoc.exists()){
            let subs = deadLineDoc.data()["subjects"];
            let deadline={};
            let dataFetch=false;
            for (let i = 0; i < subs.length; i++) {                
                if(subs[i].subject===subject){
                    if(midNo==="1"){                        
                        if(subs[i].deadline1!=null){
                            deadline.lastDate = subs[i].deadline1; 
                            deadline.instructions = subs[i].instructions
                            dataFetch=true
                        }else{
                            return {
                                data:null,
                                error:"Deadline not defined",
                            }
                        }                        
                    }else if(midNo==="2"){
                        if(subs[i].deadline2!=null){
                            deadline.lastDate = subs[i].deadline2;
                            deadline.instructions = subs[i].instructions
                            dataFetch=true
                        }else{
                            return {
                                data:null,
                                error:"Deadline not defined",
                            }
                        }                        
                    }
                    break;
                }                
            }
            if(dataFetch){
                return {
                    data:deadline,
                    error:null,
                }
            }else{
                return {
                    data:null,
                    error:"Unknown Error Occured"
                }
            }
        }else{
            return {
                data:null,
                error:"Unknown Error Occured "
            }
        }
    } catch (error) {
        return {
            data:null,
            error:error.code
        }        
    }    
}

async function getFileUploadDetails(email,subject,midNo){
    const userRef = doc(db,"users",email);
    // return {
    //     data:{ link:"BTech/3/CSE/D/Computer Networks/1/18p61a0513",topic:"Computer Networks"},
    //     error:null
    // }
    try {
        console.log(email,subject,midNo);
        const doc = await getDoc(userRef);
        if(doc.exists()){
            let subs = doc.data()["subjects"] 
            for (let i = 0; i < subs.length; i++) {
                if(subject===subs[i].subject){
                    if(midNo==="1"){
                        if(subs[i].topic!=null && subs[i].mid_1!=null){
                            return {
                                data:{ link:subs[i].mid_1,topic:subs[i].topic},
                                error:null
                            }
                        }else{
                            return {
                                data:null,
                                error:"PRA not submitted"
                            }
                        }                  
                    }else if(midNo==="2"){
                     
                        if(subs[i].topic!=null && subs[i].mid_2!=null){
                            return {
                                data:{ link:subs[i].mid_1,topic:subs[i].topic},
                                error:null
                            }
                        }else{
                            return {
                                data:{topic:subs[i].topic},
                                error:"PRA not submitted"
                            }
                        }                
                    }
                    break;
                }  
                              
            }            
        }else{
            return {
                data:null,
                error:"Enroll to get details"
            }
        }
    } catch (error) {
        return {
            data:null,
            error:error.code
        }        
    }    
}

export {enrollCourse,checkEnrollment,getStudentData,
    getCurriculumDetails,getSubjectsList,fetchDepartments,getDeadLines,getFileUploadDetails};
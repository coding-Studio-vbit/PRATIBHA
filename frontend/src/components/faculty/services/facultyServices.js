import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  getDocs,
} from "firebase/firestore";

async function getEnrolledCourses(email) {
  const docRef = doc(db, "faculty", email);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        data: docSnap.data()["subjects"],
        error: null,
      };
    } else {
      return {
        data: null,
        error: "Enroll Courses to get details",
      };
    }
  } catch (error) {
    return {
      data: null,
      error: error.code,
    };
  }
}




async function enrollHODClasses(email, enrolled_classes) {
  const facultyRef = doc(db, "faculty", email);
  try {
    await updateDoc(facultyRef, { subjects: enrolled_classes, isEnrolled: false});
    for (let i = 0; i < enrolled_classes.length; i++) {
      await setDoc(doc(db, `faculty/${email}/${enrolled_classes[i]}`, email), {
        random: 1,
      });
    }
    await updateDoc(facultyRef, { isEnrolled: true });
  } catch (error) {
    return error.code;
  }
  return null;
}


async function enrollClasses(email, enrolled_classes) {
  const facultyRef = doc(db, "faculty", email);
  try {
    await setDoc(facultyRef, { subjects: enrolled_classes, isEnrolled: false});
    for (let i = 0; i < enrolled_classes.length; i++) {
      await setDoc(doc(db, `faculty/${email}/${enrolled_classes[i]}`, email), {
        random: 1,
      });
    }
    await updateDoc(facultyRef, { isEnrolled: true });
  } catch (error) {
    return error.code;
  }
  return null;
}

export const getDepartments = async (course,year)=>{
  console.log(course,year);
  if(year===0) return
  try {
    const q =  query(collection(db,'curriculum',course,year))
    const alldocs = await getDocs(q)
    
    let departments = []
    let subjects = {}
    let sections = {}

    alldocs.docs.forEach((e)=>{
      departments.push({value:e.id,label:e.id})
      
      for (let index = 0; index < e.data()['subjects'].length; index++) {
        const ele = e.data()['subjects'][index];
        if(subjects[e.id]){
          subjects[e.id]=[...subjects[e.id],{value:ele.subject,label:ele.subject}]

        }else{

          subjects[e.id]=[{value:ele.subject,label:ele.subject}]
        }
      }
      if(e.data()['OEs'])
      for (let index = 0; index < e.data()['OEs'].length; index++) {
        const ele = e.data()['OEs'][index];
        if(subjects[e.id]){
          subjects[e.id]=[...subjects[e.id],{value:ele.subject ,label:ele.subject}]

        }else{

          subjects[e.id]=[{value:ele.subject ,label:ele.subject}]
        }
      }
      if(e.data()['PEs'])
      for (let index = 0; index < e.data()['PEs'].length; index++) {
        const ele = e.data()['PEs'][index];
        if(subjects[e.id]){
          subjects[e.id]=[...subjects[e.id],{value:ele.subject ,label:ele.subject}]

        }else{

          subjects[e.id]=[{value:ele.subject ,label:ele.subject}]
        }
      }
      console.log(e.data());
      const sectionsDoc = e.data()['sections']

      for (let index = 0; index < sectionsDoc.length; index++) {
        const element = sectionsDoc[index];
        if(sections[e.id]){
          sections[e.id] = [...sections[e.id],{value:element,label:element}]

        }else
        sections[e.id] = [{value:element,label:element}]
      }
    })
    console.log(sections);
    return {departments:departments,subjects:subjects,sections:sections}
    // for (let index = 0; index < data.length; index++) {
    //   const dep = data[index];
    //   departments.push(dep.)
    // }
  } catch (error) {
    console.log(error);
  }
}

export const getPRA = async (sub,department)=>{
  try {
    const docRef = doc(db,'subjects',department)
    const docData = await getDoc(docRef)
    const subjects = docData.data()['subjects']
    console.log(subjects);
    console.log(sub);
    let res = {}
    subjects.forEach((v)=>{
      console.log(v.subject);
      if(sub === v.subject){
        console.log(v);
        res = v
        return
      }

    })
    return res
  } catch (error) {
    console.log(error);
  }
}

export const setPRA = async (sub,department,date,inst,email,isMid1,isMid2)=>{
  console.log(isMid1);
  try {
    const docRef = doc(db,'subjects',department)
    const docData = await getDoc(docRef)
    if(docData.exists()){
      let d1 = true
      const subjects = docData.data()['subjects']
      console.log(subjects);
      
      for (let index = 0; index < subjects.length;index++){
        const ele = subjects[index]
        console.log(ele.subject);
        if(ele.subject === sub){
          d1 = false

          await updateDoc(docRef,{subjects:arrayRemove(ele)})
          if(isMid1){
           
            await updateDoc(docRef,{subjects:arrayUnion({facultyID:email,deadline1:date,instructions:inst,subject:sub})})
          }else if(isMid2){
            await updateDoc(docRef,{subjects:arrayUnion({facultyID:email,deadline1:ele.deadline1,deadline2:date, instructions:inst,subject:sub})})

          }
          break
        }
      }
      if(d1){

        // await setDoc(docRef,{subjects:[{ facultyID:email, deadline1:date,instructions:inst,subject:sub}]})
        await updateDoc(docRef,{subjects:arrayUnion({facultyID:email,deadline1:date,instructions:inst,subject:sub})})
      }}
    else{
      await setDoc(docRef,{subjects:[{ facultyID:email, deadline1:date,instructions:inst,subject:sub}]})
    }
  } catch (error) {
    console.log(error);
  }
}

export const getSubjects = async (email) => {
  try {
    const docRef = await getDoc(doc(db, "faculty", email));
    const data = docRef.data()["subjects"];

    let btechSubs = [];
    let mtechSubs = [];
    let mbaSubs = [];
    let praSetSubs = {}
    for (let index = 0; index < data.length; index++) {
      const sub = data[index];
      console.log(sub);
      const parts = sub.split('_')
      const idk = parts[0]+'_'+parts[1]+'_'+parts[2]+'_'+parts[3]
      console.log(idk);
      const subRef = await getDoc(doc(db, "subjects", idk));
      if(subRef.exists()){

        const subsData = subRef.data()['subjects']
        console.log(subsData);
        for(let i=0;i<subsData.length;i++){
          if(parts[4]===subsData[i].subject){
            praSetSubs[sub] = (subsData[i].subject)
          }

        }

      }
      
      
      const klass = parts[0];
      console.log(klass);
      if (klass === "BTech") {
        btechSubs.push(sub);
      } else if (klass === "MTech") {
        mtechSubs.push(sub);
      } else {
        mbaSubs.push(sub);
      }
    }
    console.log(praSetSubs);
    return {praSetSubs:praSetSubs, btechSubs:btechSubs,mtechSubs:mtechSubs,mbaSubs:mbaSubs}
  } catch (error) {
    console.log(error);
    return -1;
  }
};



async function getMarks(facultyID,className,studentID) {
  const facultyRef = doc(db,`faculty/${facultyID}/${className}`,studentID);
  try {
    const docSnap = await getDoc(facultyRef);
    if(docSnap.exists()){
      return {
        data:docSnap.data(),
        error:null,
      }
      // if(docSnap.data()["isGraded"]){
      //   return {
      //     data:docSnap.data(),
      //     status:"GRADED",
      //     error:null
      //   }
      // }else{
      //   return {
      //     data:docSnap.data(),
      //     status:"UNGRADED",
      //     error:null
      //   }
      // }                    
    }else{
      return {
        data:null,
        // status:"UNGRADED", 
        error:null                            
      }
    }
  } catch (error) {
    return {
      data:null,
      status:null,
      error:error.code
    }    
  }  
}



async function postMarks(facultyID,className,studentID,midNo,marks,remarks) {
  let error=null;
  console.log(`faculty/${facultyID}/${className}`);
  const facultyRef = doc(db,`faculty/${facultyID}/${className}`,studentID);

  const userRef = doc(db,`users`,studentID+"@vbithyd.ac.in");
  console.log(marks);
  try {
    if(midNo==="1"){
      await updateDoc(facultyRef,{
        mid1:marks,
        remarks1:remarks,
      });
      const userDoc = await getDoc(userRef);
      if(userDoc.exists()){
        let subs=userDoc.data()["subjects"];
        subs.find(e=>{
          if(e.subject==className.split('_')[4]){
            e.gradeStatus1="GRADED"
          }
        })
        await updateDoc(userRef,{
          subjects:subs
        })
      }else{
        error="Unknown Error Occured"
      }
      
    }else if(midNo==="2"){
      await updateDoc(facultyRef,{
        mid2:marks,
        remarks2:remarks,
      });
      const userDoc = await getDoc(userRef);
      if(userDoc.exists()){
        let subs=userDoc.data()["subjects"];
        subs.find(e=>{
          if(e.subject==className.split('_')[4]){
            e.gradeStatus2="GRADED"
          }
        })
        await updateDoc(userRef,{
          subjects:subs
        })
      }else{
        error="Unknown Error Occured"
      }
    }    
  } catch (e) {
    console.log(e);
    error=e.code;
  }  
  return error;
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
export const fetchSectionsAndSubs= async (course,year,departments)=>{
  console.log(course,year,departments);
  try {
    let subjects = []
    let sections = []
    for (let index = 0; index < departments.length; index++) {
      const element = departments[index].value;
      const q =  query(doc(db,'curriculum',course,year,element))
      const alldocs = await getDoc(q)
      console.log(alldocs);
      const data = alldocs.data()
      console.log(data);
      for(let i=0;i<data.subjects.length;i++){

        if(subjects[alldocs.id]){
          subjects[alldocs.id] =[...subjects[alldocs.id],{value:data.subjects[i].subject,label:data.subjects[i].subject}]

        }else{
          subjects[alldocs.id]=[{value:data.subjects[i].subject,label:data.subjects[i].subject}]
        }
      }
      const sectionsDoc = data['sections']

      for (let index = 0; index < sectionsDoc.length; index++) {
        const element = sectionsDoc[index];
        if(sections[alldocs.id]){
          sections[alldocs.id] = [...sections[alldocs.id],{value:element,label:element}]

        }else
        sections[alldocs.id] = [{value:element,label:element}]
      }

    }
    console.log(subjects);
    return {subjects:subjects,sections:sections}
    
  } catch (error) {
    console.log(error);
  }
}

async function getCoeDeadline(midNo) {
  const adminRef = doc(db,"adminData","coeDeadline");
  console.log("ABCD");
  try {
    console.log("PQRS");
    const docSnap = await getDoc(adminRef);
    if(docSnap.exists()){
      console.log("XY");
      if(midNo==="1")
      {
      return {
        data:docSnap.data()["coeDeadline"],
        error:null
          }         
      }
      else if(midNo==="2")
      {
        return {
          data:docSnap.data()["coeDeadline2"],
          error:null
            }     
      }
    }
    else{
      console.log("EFGH");
      return {
        data:null,
        error:"DEADLINE_NOT_SET"
      }
    }    
  } catch (error) {
    return {
      data:null,
      error:error
    }
    // console.log(error);    
  }  
}

// async function getDataByRollNumber(facultyID,className,studentID,) {
//   const facultyRef = doc(db,`faculty/${facultyID}/${className}`,studentID);

//   try {
//     const res = await getDoc(facultyRef);
//     if(res.exists()){
//       return {
//         data:res.data(),
//         error:null,
//       }
//     }else{
//       return {
//         data:null,
//         error:"Student Not Found"
//       }
//     }
//   } catch (error) {
//     return {
//       data:null,
//       error:error.toString()
//     }    
//   }
// }

async function getAllStudentsData(facultyID,className) {
  const facultyRef = collection(db,`faculty/${facultyID}/${className}`);

  try {
    const res = await getDocs(facultyRef);    
    if(res.docs.length!==0){
      return {
        data:res.docs,
        error:null,
      }
    }else{
      return {
        data:null,
        error:"Data Not Found"
      }
    }
  } catch (error) {
    return {
      data:null,
      error:error.toString()
    }    
  }
}

export {getEnrolledCourses,enrollClasses,enrollHODClasses,
  postMarks,getMarks,getCoeDeadline,getAllStudentsData};

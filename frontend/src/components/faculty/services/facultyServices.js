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
    await setDoc(facultyRef, { subjects: enrolled_classes, isEnrolled: false,role: null});
    for (let i = 0; i < enrolled_classes.length; i++) {
      await setDoc(doc(db, `faculty/${email}/${enrolled_classes[i]}`, email), {
        random: 1,
      });
    }
    await updateDoc(facultyRef, { isEnrolled: true ,role:['faculty']});
  } catch (error) {
    return error.code;
  }
  return null;
}

export const getDepartments = async (course,year)=>{
  console.log(year);
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
          subjects[e.id]=[...subjects[e.id],{value:ele.subject,label:ele.subject}]

        }else{

          subjects[e.id]=[{value:ele.subject,label:ele.subject}]
        }
      }
      if(e.data()['PEs'])
      for (let index = 0; index < e.data()['PEs'].length; index++) {
        const ele = e.data()['PEs'][index];
        if(subjects[e.id]){
          subjects[e.id]=[...subjects[e.id],{value:ele.subject,label:ele.subject}]

        }else{

          subjects[e.id]=[{value:ele.subject,label:ele.subject}]
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

export const setPRA = async (sub,department,date,inst)=>{
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
          await updateDoc(docRef,{subjects:arrayUnion({deadline1:ele.deadline1,deadline2:date,instructions:inst,subject:sub})})
          break
        }
      }
      if(d1){

        await updateDoc(docRef,{subjects:arrayUnion({deadline1:date,instructions:inst,subject:sub})})
      }
    }else{
      await setDoc(docRef,{subjects:[{deadline1:date,instructions:inst,subject:sub}]})
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
    for (let index = 0; index < data.length; index++) {
      const sub = data[index];
      const klass = sub.split("_", 1)[0];
      console.log(klass);
      if (klass === "Btech") {
        btechSubs.push(sub);
      } else if (klass === "Mtech") {
        mtechSubs.push(sub);
      } else {
        mbaSubs.push(sub);
      }
    }
    return {btechSubs:btechSubs,mtechSubs:mtechSubs,mbaSubs:mbaSubs}
  } catch (error) {
    return -1;
  }
};

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

export { getEnrolledCourses, enrollClasses,enrollHODClasses };

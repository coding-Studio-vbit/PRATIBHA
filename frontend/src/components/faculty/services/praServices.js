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
  Timestamp,
} from "firebase/firestore";

export const setPRA = async (sub, department, date, inst, isMid1, isMid2) => {
  //in createPRA.js
  //if the faculty is coming to createPRA page, it means that the faculty has enrollled. So, in the doc(BTech/2021-22/3_CSE_D), a subjects array exists and the particular subject element also exists. While setting PRA deadline, just update the array element.
  console.log(sub, department, date, inst);
  department = "BTech_2021-22_3_CSE_D";
  console.log(department.split("_"));
  let course = department.split("_")[0];
  let acadYear = department.split("_")[1];
  let classroom =
    department.split("_")[2] +
    "_" +
    department.split("_")[3] +
    "_" +
    department.split("_")[4];

  console.log(course, acadYear, classroom);
  try {
    const docRef = doc(db, "classesinfo", course, acadYear, classroom);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
      const subjects = docData.data()["subjects"];

      for (let index = 0; index < subjects.length; index++) {
        const ele = subjects[index];
        console.log(ele.subject === sub);
        if (ele.subject === sub) {
          console.log("subject found");

          await updateDoc(docRef, { subjects: arrayRemove(ele) });
          if (isMid1) {
            console.log("its mid1");
            await updateDoc(docRef, {
              subjects: arrayUnion({
                facultyID: ele.facultyID,
                deadline1: date,
                instructions: inst,
                subject: sub,
              }),
            });
          } else if (isMid2) {
            console.log("its mid2");
            await updateDoc(docRef, {
              subjects: arrayUnion({
                deadline1: ele.deadline1,
                facultyID: ele.facultyID,
                deadline2: date,
                instructions: inst,
                subject: sub,
              }),
            });
          }
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPRA = async (sub, department) => {
  //in createPra.js
  try {
    const docRef = doc(db, "subjects", department);
    const docData = await getDoc(docRef);
    const subjects = docData.data()["subjects"];

    let res = {};
    subjects.forEach((v) => {
      if (sub === v.subject) {
        res = v;
        return;
      }
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

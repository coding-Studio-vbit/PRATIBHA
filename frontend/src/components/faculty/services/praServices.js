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
import {
  fetchisMid1,
  fetchisMid2,
  fetchRegulationOptions,
  fetchSemNumber,
  getStudentData,
} from "../../student/services/studentServices";
import { getUploadedFileByPath } from "../../student/services/storageServices";





export const setPRA = async (sub, department, date, inst, isMid1, isMid2) => {
    //in createPRA.js
    try {
      const docRef = doc(db, "subjects", department);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        let d1 = true;
        const subjects = docData.data()["subjects"];
  
        for (let index = 0; index < subjects.length; index++) {
          const ele = subjects[index];
  
          if (ele.subject === sub) {
            d1 = false;
  
            await updateDoc(docRef, { subjects: arrayRemove(ele) });
            if (isMid1) {
              await updateDoc(docRef, {
                subjects: arrayUnion({
                  deadline1: date,
                  instructions: inst,
                  subject: sub,
                }),
              });
            } else if (isMid2) {
              await updateDoc(docRef, {
                subjects: arrayUnion({
                  deadline1: ele.deadline1,
                  deadline2: date,
                  instructions: inst,
                  subject: sub,
                }),
              });
            }
            break;
          }
        }
        if (d1) {
          if (isMid1) {
            await updateDoc(docRef, {
              subjects: arrayUnion({
                deadline1: date,
                instructions: inst,
                subject: sub,
              }),
            });
          }
          if (isMid2) {
            await updateDoc(docRef, {
              subjects: arrayUnion({
                deadline2: date,
                instructions: inst,
                subject: sub,
              }),
            });
          }
        }
      } else {
        await setDoc(docRef, {
          subjects: [
            {
              deadline1: date,
              instructions: inst,
              subject: sub,
            },
          ],
        });
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
  
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";


export async function getMarks(className, email) {
    //grading.js
    const userRef = doc(db, "users", email + "@vbithyd.ac.in");
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return {
          data: docSnap
            .data()
            ["subjects"].find((e) => e.subject === className.split("_").pop()),
          error: null,
        };
      } else {
        return {
          data: null,
          // status:"UNGRADED",
          error: "Student Not Graded",
        };
      }
    } catch (error) {
      return {
        data: null,
        status: null,
        error: error.code,
      };
    }
  }



  
export async function postMarks(
  facultyID,
    className,
    studentID,
    midNo,
    marks,
    remarks
  ) {
    //grading
    let error = null;
  
    const userRef = doc(db, `users`, studentID + "@vbithyd.ac.in");
  
    try {
      if (midNo === "1") {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          let subs = userDoc.data()["subjects"];
          subs.find((e) => {
            if (e.subject === className.split("_")[5]) {
              e.gradeStatus1 = "GRADED";
              e.mid1_marks = marks;
              e.mid1_remarks = remarks;
            }
          });
          await updateDoc(userRef, {
            subjects: subs,
          });
        } else {
          error = "Unknown Error Occured";
        }
      } else if (midNo === "2") {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          let subs = userDoc.data()["subjects"];
          subs.find((e) => {
            if (e.subject === className.split("_")[5]) {
              e.gradeStatus2 = "GRADED";
              e.mid2_marks = marks;
              e.mid2_remarks = remarks;
            }
          });
          await updateDoc(userRef, {
            subjects: subs,
          });
        } else {
          error = "Unknown Error Occured";
        }
      }
      console.log(error)
    } catch (e) {
      console.log(e);
      error = e.code;
    }
    return error;
  }



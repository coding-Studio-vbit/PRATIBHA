import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAcademicYear } from "./adminDeadlinesServices";
import { fetchSemNumber } from "../../student/services/studentServices";


export async function getMarks(className, email) {

  
    //grading.js
    const userRef = doc(db, "users", email + "@vbithyd.ac.in");
    try {
      const docSnap = await getDoc(userRef);
      const data = docSnap.data()
      const acadYear =( await getAcademicYear(data.course,data.current_year)).data
      const semNo = await fetchSemNumber(data.course,data.current_year)
      if (docSnap.exists()) {
        return {
          data:data
            [acadYear][`sem${semNo}`].find((e) => e.subject === className.split("_").pop()),
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
  
    const userDoc = await getDoc(userRef);
    const data = userDoc.data()
    const acadYear = (await getAcademicYear(data.course,data.current_year)).data
    const semNo = await fetchSemNumber(data.course,data.current_year)

    try {
      if (midNo === "1") {
        if (userDoc.exists()) {
          let subs = data[acadYear][`sem${semNo}`];
          let updateSubs = {}
          subs.find((e) => {
            if (e.subject === className.split("_")[5]) {
              e.gradeStatus1 = "GRADED";
              e.mid1_marks = marks;
              e.mid1_remarks = remarks;
            }
          });
          updateSubs[`${acadYear}.sem${semNo}`] = subs
          await updateDoc(userRef, updateSubs );
        } else {
          error = "Unknown Error Occured";
        }
      } else if (midNo === "2") {
        if (userDoc.exists()) {
          let subs = data[acadYear][`sem${semNo}`];
          let updateSubs = {}

          subs.find((e) => {
            if (e.subject === className.split("_")[5]) {
              e.gradeStatus2 = "GRADED";
              e.mid2_marks = marks;
              e.mid2_remarks = remarks;
            }
          });
          updateSubs[`${acadYear}.sem${semNo}`] = subs

          await updateDoc(userRef,updateSubs);
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



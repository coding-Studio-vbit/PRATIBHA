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
    } catch (e) {
      console.log(e);
      error = e.code;
    }
    return error;
  }


  //returns all the data about all the students of a particular class (Example: BTech_21_1_CSE_A)
  export async function getAllStudentsData(className) {
    const subject = className.split("_").pop();
    const facultyRef = doc(
      db,
      "classesinfo",
      className.replace("_" + subject, "")
    );
  
    try {
      const res = await getDoc(facultyRef);
      if (res.exists()) {
        let studentList = res.data()["students"].sort();
        let studentsInfo = [];
        for await (const student of studentList) {
          const studentSnap = await getDoc(doc(db, "users", student));
          studentsInfo.push({
            id: student,
            data: studentSnap
              .data()
              ["subjects"].find((e) => e.subject === subject),
          });
        }
        return {
          data: studentsInfo,
          error: null,
        };
      } else {
        return {
          data: null,
          error: "Data Not Found",
        };
      }
    } catch (error) {
      return {
        data: null,
        error: error.toString(),
      };
    }
  }
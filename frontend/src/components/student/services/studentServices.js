import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../firebase";

async function checkEnrollment(email) {
  let error = null;
  const userRef = doc(db, "users", email);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      error = null;
    } else {
      error = "STUDENT_NOT_VERIFIED";
    }
  } catch (e) {
    error = "UNKNOWN_ERROR";
  }
  return error;
}

export const addStudent = async (studentID, department) => {
  try {
    const docRef = doc(db, "classesinfo", department);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
      // let d1 = true;
      const students = docData.data()["students"];
      if (students != null) {
        for (let index = 0; index < students.length; index++) {
          const ele = students[index];

          if (ele === studentID) {
            // d1 = false;
            break;
          } else {
            await updateDoc(docRef, { students: arrayUnion(studentID) });
          }
        }
      } else {
        await updateDoc(docRef, {
          students: [studentID],
        });
      }
    } else {
      await setDoc(docRef, {
        students: [studentID],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

async function enrollCourse(email, course_details) {
  let error = null;
  const userRef = doc(db, "users", email);
  const dep =
    course_details.course +
    "_" +
    course_details.regulation +
    "_" +
    course_details.year +
    "_" +
    course_details.department +
    "_" +
    course_details.section;

  try {
    await setDoc(userRef, course_details);
    await addStudent(email, dep);
  } catch (e) {
    error = e.code;
  }
  return error;
}

async function getStudentData(email) {
  try {
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return { document: userDoc.data(), error: null };
    } else {
      return { document: null, error: "Enroll the details to access" };
    }
  } catch (e) {
    return { document: null, error: e.code };
  }
}

async function fetchisMid1(course, year) {
  try {
    const adminRef = doc(db, `adminData/coeDeadline/${course}`, `${year}`);
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let date = new Timestamp(
        adminDoc.data()["mid1"]["seconds"],
        adminDoc.data()["mid1"]["nanoseconds"]
      ).toDate();
      const currentdate = new Date();
      if (date > currentdate) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchisMid2(course, year) {
  try {
    const adminRef = doc(db, `adminData/coeDeadline/${course}`, `${year}`);
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let date1 = new Timestamp(
        adminDoc.data()["mid1"]["seconds"],
        adminDoc.data()["mid1"]["nanoseconds"]
      ).toDate();
      let date2 = new Timestamp(
        adminDoc.data()["mid2"]["seconds"],
        adminDoc.data()["mid2"]["nanoseconds"]
      ).toDate();
      const currentdate = new Date();
      if (date1 < currentdate && date2 > currentdate) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getSubjectsList(email) {
  const userRef = doc(db, "users", email);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return {
        data: {
          subjects: userDoc.data()["subjects"],
        },
        error: null,
      };
    } else {
      return {
        data: null,
        error: "Enroll Details to get subject information",
      };
    }
  } catch (e) {
    return {
      data: null,
      error: e.code,
    };
  }
}

async function fetchDepartments(course, year) {
  const depRef = query(collection(db, `curriculum/${course}/${year}`));
  try {
    const docs = await getDocs(depRef);
    let depList = [];
    docs.forEach((e) => {
      depList.push(e);
    });
    return {
      data: depList,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.code,
    };
  }
}

async function getDeadLines(
  course,
  year,
  regulation,
  department,
  section,
  subject,
  midNo
) {
  const deadLinesRef = doc(
    db,
    "subjects",
    `${course}_${regulation}_${year}_${department}_${section}`
  );
  try {
    const deadLineDoc = await getDoc(deadLinesRef);
    if (deadLineDoc.exists()) {
      let subs = deadLineDoc.data()["subjects"];
      let deadline = {};
      let dataFetch = false;
      for (let i = 0; i < subs.length; i++) {
        if (subs[i].subject === subject) {
          if (midNo === "1") {
            if (subs[i].deadline1 != null) {
              deadline.lastDate = subs[i].deadline1;
              deadline.instructions = subs[i].instructions;
              dataFetch = true;
            } else {
              return {
                data: null,
                error: "Submissions are not opened by faculty",
              };
            }
          } else if (midNo === "2") {
            if (subs[i].deadline2 != null) {
              deadline.lastDate = subs[i].deadline2;
              deadline.instructions = subs[i].instructions;
              dataFetch = true;
            } else {
              return {
                data: null,
                error: "Submissions are not opened by faculty",
              };
            }
          }
          break;
        }
      }
      if (dataFetch) {
        return {
          data: deadline,
          error: null,
        };
      } else {
        return {
          data: null,
          error: "Unknown Error Occured",
        };
      }
    } else {
      return {
        data: null,
        error: "Unknown Error Occured ",
      };
    }
  } catch (error) {
    return {
      data: null,
      error: error.code,
    };
  }
}

async function getFileUploadDetails(email, subject, midNo) {
  const userRef = doc(db, "users", email);
  try {
    const doc = await getDoc(userRef);
    if (doc.exists()) {
      let subs = doc.data()["subjects"];
      for (let i = 0; i < subs.length; i++) {
        if (subject === subs[i].subject) {
          if (midNo === "1") {
            if (subs[i].topic != null && subs[i].mid_1 != null) {
              return {
                data: {
                  link: subs[i].mid_1,
                  topic: subs[i].topic,
                  fileName: subs[i].fileName1,
                },
                error: null,
              };
            } else {
              return {
                data: null,
                error: "PRA not submitted",
              };
            }
          } else if (midNo === "2") {
            if (subs[i].topic != null && subs[i].mid_2 != null) {
              return {
                data: {
                  link: subs[i].mid_2,
                  topic: subs[i].topic,
                  fileName: subs[i].fileName2,
                },
                error: null,
              };
            } else {
              return {
                data: { topic: subs[i].topic },
                error: "PRA not submitted",
              };
            }
          }
          break;
        }
      }
    } else {
      return {
        data: null,
        error: "Enroll to get details",
      };
    }
  } catch (error) {
    return {
      data: null,
      error: error.code,
    };
  }
}

async function fetchRegulationOptions() {
  try {
    const adminRef = doc(db, `adminData/regulations`);
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let arr = [];
      let regarray = adminDoc.data()["regarray"];
      for (let i = 0; i < regarray.length; i++) {
        let match = false;
        if (arr.length === 0) {
          arr = [...arr, { value: `${regarray[i]}`, label: `R${regarray[i]}` }];
        }
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].value == regarray[i]) {
            match = true;
          }
        }
        if (!match) {
          arr = [...arr, { value: `${regarray[i]}`, label: `R${regarray[i]}` }];
        }
      }
      return {
        data: arr,
        error: null,
      };
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchisSem1(course, year) {
  try {
    const adminRef = doc(db, `adminData/semester/${course}`, `${year}`);
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let date = new Timestamp(
        adminDoc.data()["sem1"]["seconds"],
        adminDoc.data()["sem1"]["nanoseconds"]
      ).toDate();
      const currentdate = new Date();
      if (date > currentdate) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchisSem2(course, year) {
  try {
    const adminRef = doc(db, `adminData/semester/${course}`, `${year}`);
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      let date1 = new Timestamp(
        adminDoc.data()["sem1"]["seconds"],
        adminDoc.data()["sem1"]["nanoseconds"]
      ).toDate();
      let date2 = new Timestamp(
        adminDoc.data()["sem2"]["seconds"],
        adminDoc.data()["sem2"]["nanoseconds"]
      ).toDate();
      const currentdate = new Date();
      if (date1 < currentdate && date2 > currentdate) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchSemNumber(course, year) {
  try {
    const d1 = await fetchisSem1(course, year);
    const d2 = await fetchisSem2(course, year);
    if (d1) {
      return 1;
    }
    if (d2) {
      return 2;
    }
    return -1;
  } catch (error) {
    console.log(error);
  }
}

async function getAnnouncements() {
  const announceRef = doc(db, "announcements", "announce");
  const announce = await getDoc(announceRef);

  if (announce.exists()) {
    return announce.data()["list"];
  } else {
    return null;
  }
}

export {
  enrollCourse,
  checkEnrollment,
  getStudentData,
  getSubjectsList,
  fetchDepartments,
  getDeadLines,
  getFileUploadDetails,
  fetchisMid1,
  fetchisMid2,
  fetchisSem1,
  fetchisSem2,
  fetchSemNumber,
  fetchRegulationOptions,
  getAnnouncements,
};

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


async function getIsEnrolled(email) {
  //in HODSearch screen
  const docRef = doc(db, "faculty", email);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        data: docSnap.data()["isEnrolled"],
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





//Params are course, year and semester and this returns an object containing departments, sections and subjects of that course and year. (Example : Btech 2nd year 1st semester)
export const getCurriculumData = async (course, year, semester) => {
  if (year === 0) return;
  try {
    const q = query(collection(db, "curriculum", course, year));
    const alldocs = await getDocs(q);

    let departments = [];
    let subjects = {};
    let sections = {};

    alldocs.docs.forEach((e) => {
      departments.push({ value: e.id, label: e.id });

      if (semester === 1) {
        for (let index = 0; index < e.data()["subjects"].length; index++) {
          const ele = e.data()["subjects"][index];
          if (subjects[e.id]) {
            subjects[e.id] = [
              ...subjects[e.id],
              { value: ele.subject, label: ele.subject },
            ];
          } else {
            subjects[e.id] = [{ value: ele.subject, label: ele.subject }];
          }
        }
        if (e.data()["OEs"]) {
          for (let index = 0; index < e.data()["OEs"].length; index++) {
            const ele = e.data()["OEs"][index];
            if (subjects[e.id]) {
              subjects[e.id] = [
                ...subjects[e.id],
                { value: ele.subject, label: ele.subject },
              ];
            } else {
              subjects[e.id] = [{ value: ele.subject, label: ele.subject }];
            }
          }
        }
        if (e.data()["PEs"]) {
          for (let index = 0; index < e.data()["PEs"].length; index++) {
            const ele = e.data()["PEs"][index];
            if (subjects[e.id]) {
              subjects[e.id] = [
                ...subjects[e.id],
                { value: ele.subject, label: ele.subject },
              ];
            } else {
              subjects[e.id] = [{ value: ele.subject, label: ele.subject }];
            }
          }
        }
      }

      if (semester === 2) {
        for (let index = 0; index < e.data()["subjects2"].length; index++) {
          const ele = e.data()["subjects2"][index];
          if (subjects[e.id]) {
            subjects[e.id] = [
              ...subjects[e.id],
              { value: ele.subject, label: ele.subject },
            ];
          } else {
            subjects[e.id] = [{ value: ele.subject, label: ele.subject }];
          }
        }
        if (e.data()["OEs2"]) {
          for (let index = 0; index < e.data()["OEs2"].length; index++) {
            const ele = e.data()["OEs2"][index];
            if (subjects[e.id]) {
              subjects[e.id] = [
                ...subjects[e.id],
                { value: ele.subject, label: ele.subject },
              ];
            } else {
              subjects[e.id] = [{ value: ele.subject, label: ele.subject }];
            }
          }
        }
        if (e.data()["PEs2"]) {
          for (let index = 0; index < e.data()["PEs2"].length; index++) {
            const ele = e.data()["PEs2"][index];
            if (subjects[e.id]) {
              subjects[e.id] = [
                ...subjects[e.id],
                { value: ele.subject, label: ele.subject },
              ];
            } else {
              subjects[e.id] = [{ value: ele.subject, label: ele.subject }];
            }
          }
        }
      }

      const sectionsDoc = e.data()["sections"];

      for (let index = 0; index < sectionsDoc.length; index++) {
        const element = sectionsDoc[index];
        if (sections[e.id]) {
          sections[e.id] = [
            ...sections[e.id],
            { value: element, label: element },
          ];
        } else sections[e.id] = [{ value: element, label: element }];
      }
    });

    return { departments: departments, subjects: subjects, sections: sections };
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






async function getCoeDeadline(midNo, course, year) {
  const adminRef = doc(db, `adminData/coeDeadline/${course}`, `${year}`);

  try {
    const docSnap = await getDoc(adminRef);
    if (docSnap.exists()) {
      if (midNo === "1") {
        return {
          data: docSnap.data()["mid1"],
          error: null,
        };
      } else if (midNo === "2") {
        return {
          data: docSnap.data()["mid2"],
          error: null,
        };
      }
    } else {
      return {
        data: null,
        error: "DEADLINE_NOT_SET",
      };
    }
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}

async function getSemDeadline(semNo, course, year) {
  console.log(semNo, course, year);
  const adminRef = doc(db, `adminData/semester/${course}`, `${year}`);

  try {
    const docSnap = await getDoc(adminRef);
    if (docSnap.exists()) {
      if (semNo == 1) {
        return {
          data: docSnap.data()["sem1"],
          error: null,
        };
      } else if (semNo == 2) {
        return {
          data: docSnap.data()["sem2"],
          error: null,
        };
      }
    } else {
      return {
        data: null,
        error: "DEADLINE_NOT_SET",
      };
    }
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}

async function getBeforeSemEnd(course, year) {
  const adminRef = doc(db, `adminData/coeDeadline/${course}`, `${year}`);
  const semRef = doc(db, `adminData/semester/${course}`, `${year}`);
  let mid2 = {};
  let semEnd = {};

  let semNum = await fetchSemNumber(course, year);
  try {
    //get mid2 deadline
    const docSnap = await getDoc(adminRef);
    if (docSnap.exists()) {
      mid2 = new Timestamp(
        docSnap.data()["mid2"]["seconds"],
        docSnap.data()["mid2"]["nanoseconds"]
      ).toDate();
    }

    //get semEnd date
    const semSnap = await getDoc(semRef);
    if (semSnap.exists()) {
      semEnd = new Timestamp(
        semSnap.data()[`sem${semNum}`]["seconds"],
        semSnap.data()[`sem${semNum}`]["nanoseconds"]
      ).toDate();
    }
    const currentdate = new Date();
    if (mid2 < currentdate && semEnd > currentdate) {
      return {
        data: true,
        error: null,
      };
    }
    return {
      data: false,
      error: null,
    };
    //get current date and compare if mid2<currentdate<semEnd
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}




const Fetchlink = async (email, status, mid, fullcourse) => {
  const subjectval = fullcourse.split("_");
  let result;
  if (status === "Not Submitted" || status === " ") {
    result = null;
  } else {
    const res = await getUploadedFileByPath(
      subjectval[0] +
        "/" +
        subjectval[1] +
        "/" +
        subjectval[2] +
        "/" +
        subjectval[3] +
        "/" +
        subjectval[4] +
        "/" +
        subjectval[5] +
        "/" +
        mid +
        "/" +
        email.split("@")[0]
    );
    result = res.url;
  }

  return result;
};

async function getAllStudents(
  students,
  subject,
  ismid1,
  ismid2,
  files,
  fullcourse
) {
  var data = new Array();
  var dict = {};
  var student = "";
  var studentTopic = "";
  for (var sd = 0; sd < students.length; sd++) {
    let sEmail = students[sd];
    await getStudentData(sEmail)
      .then(async ({ document, error }) => {
        var returndata = document;
        var topic, name, mid1, mid2;

        var Innovation1 = "",
          Innovation2 = "",
          Subject_Relevance1 = "",
          Subject_Relevance2 = "",
          Individuality1 = "",
          Individuality2 = "",
          Preparation1 = "",
          Preparation2 = "",
          Presentation1 = "",
          Presentation2 = "";

        if (error == null) {
          let obj = returndata["subjects"].find((o) => o.subject === subject);
          if (obj) {
            topic = obj.topic;
            name = returndata.name;

            if (obj.mid1_marks) {
              Innovation1 = obj.mid1_marks.Innovation1;
              Subject_Relevance1 = obj.mid1_marks.Subject_Relevance1;
              Individuality1 = obj.mid1_marks.Individuality1;
              Preparation1 = obj.mid1_marks.Preparation1;
              Presentation1 = obj.mid1_marks.Presentation1;
            } else {
              if (student === "" && ismid1) {
                student = sEmail.split("@")[0];
                studentTopic = topic;
              }
            }

            if (obj.mid2_marks) {
              Innovation2 = obj.mid2_marks.Innovation2;
              Subject_Relevance2 = obj.mid2_marks.Subject_Relevance2;
              Individuality2 = obj.mid2_marks.Individuality2;
              Preparation2 = obj.mid2_marks.Preparation2;
              Presentation2 = obj.mid2_marks.Presentation2;
            } else {
              if (student === "" && ismid2) {
                student = student + sEmail.split("@")[0];
                studentTopic = studentTopic + topic;
              }
            }

            mid1 = obj.mid1_marks
              ? Innovation1 +
                Subject_Relevance1 +
                Individuality1 +
                Preparation1 +
                Presentation1
              : obj.mid_1
              ? "Not Graded"
              : ismid1 || ismid2
              ? "Not Submitted"
              : " ";

            mid2 = obj.mid2_marks
              ? Innovation2 +
                Subject_Relevance2 +
                Individuality2 +
                Preparation2 +
                Presentation2
              : obj.mid_2
              ? "Not Graded"
              : ismid2
              ? "Not Submitted"
              : " ";

            if (files == true) {
              if (ismid1) {
                await Fetchlink(sEmail, mid1, "1", fullcourse).then((res) => {
                  dict[sEmail.split("@")[0]] = res;
                });
              }
              if (ismid2) {
                await Fetchlink(sEmail, mid2, "2", fullcourse).then((res) => {
                  dict[sEmail.split("@")[0]] = res;
                });
              }
            }
          }
          const dataobj = {
            ROLL_NO: sEmail.split("@")[0],
            STUDENT_NAME: name,
            TOPIC_NAME: topic,
            Innovation1: Innovation1,
            Subject_Relevance1: Subject_Relevance1,
            Individuality1: Individuality1,
            Preparation1: Preparation1,
            Presentation1: Presentation1,
            MID_1: mid1,
            Innovation2: Innovation2,
            Subject_Relevance2: Subject_Relevance2,
            Individuality2: Individuality2,
            Preparation2: Preparation2,
            Presentation2: Presentation2,
            MID_2: mid2,
          };
          return dataobj;
        } else {
          return null;
        }
      })
      .then((res) => {
        if (res !== null) {
          data = [...data, res];
        }
      });
  }
  return {
    data: data,
    student: student,
    studentTopic: studentTopic,
    links: dict,
  };
}

async function setCoeDeadlines(course, year, mid1, mid2, sem) {
  //deadlines.js
  console.log(sem);
  const midRef = doc(db, `adminData/coeDeadline/${course}`, `${year}`);
  const semRef = doc(db, `adminData/semester/${course}`, `${year}`);
  const semnum = await fetchSemNumber(course, year);
  try {
    const midDoc = await getDoc(midRef);
    if (midDoc.exists()) {
      await updateDoc(midRef, {
        mid1: mid1,
        mid2: mid2,
      });
    }
    const semDoc = await getDoc(semRef);
    if (semDoc.exists()) {
      console.log(semnum);
      if (semnum == 1) {
        await updateDoc(semRef, {
          sem1: sem,
        });
      }
      if (semnum == 2) {
        await updateDoc(semRef, {
          sem2: sem,
        });
      }
    }
    return {
      error: null,
    };
  } catch (e) {
    return {
      error: e,
    };
  }
}

export const getFirstYearCurriculumData = async (semester) => {
  const regArray = await fetchRegulationOptions();
  let regulation = regArray.data[0].value;

  try {
    const q = query(collection(db, "curriculum", "BTech", "1"));
    const alldocs = await getDocs(q);

    let courses = [];
    let str = "";
    alldocs.docs.forEach((e) => {
      for (let i = 0; i < e.data()["sections"].length; i++) {
        if (semester === 1) {
          for (let j = 0; j < e.data()["subjects"].length; j++) {
            str =
              "BTech" +
              "_" +
              regulation +
              "_1_" +
              e.id +
              "_" +
              e.data()["sections"][i] +
              "_" +
              e.data()["subjects"][j].subject;

            courses.push(str);
          }
        }
        if (semester === 2) {
          console.log("hi");
          for (let j = 0; j < e.data()["subjects2"].length; j++) {
            str =
              "BTech" +
              "_" +
              regulation +
              "_1_" +
              e.id +
              "_" +
              e.data()["sections"][i] +
              "_" +
              e.data()["subjects2"][j].subject;
            courses.push(str);
          }
        }
      }
    });
    return courses;
  } catch (error) {
    console.log(error);
  }
};
async function getFirstYearStatistics() {
  try {
    let arr1 = await getFirstYearCurriculumData(1);
    let createdPRA = [];
    let str = "";
    const regArray = await fetchRegulationOptions();
    let regulation = regArray.data[0].value;
    const q = query(collection(db, "subjects"));
    const allDocs = await getDocs(q);
    allDocs.docs.forEach((e) => {
      let arr = e.id.split("_");
      if (arr[0] == "BTech" && arr[1] == regulation && arr[2] == "1") {
        for (let i = 0; i < e.data()["subjects"].length; i++) {
          str = e.id + "_" + e.data()["subjects"][i].subject;
          createdPRA.push(str);
        }
      }
    });
    let difference = arr1.filter((x) => !createdPRA.includes(x));
    return difference;
  } catch (e) {
    console.log(e);
  }
}

export {
  getFirstYearStatistics,
  getCoeDeadline,
  getAllStudents,
  getIsEnrolled,
  getBeforeSemEnd,
  getSemDeadline,
  setCoeDeadlines,
};

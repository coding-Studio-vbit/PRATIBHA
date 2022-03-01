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
import {
  fetchisMid1,
  fetchisMid2,
  fetchSemNumber,
  getStudentData,
} from "../../student/services/studentServices";
import { getUploadedFileByPath } from "../../student/services/storageServices";

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
    await updateDoc(facultyRef, {
      subjects: enrolled_classes,
      isEnrolled: false,
    });
    for (let i = 0; i < enrolled_classes.length; i++) {
      console.log(enrolled_classes[i]);
      var classname = enrolled_classes[i].split("_");
      var fetchclass =
        classname[0] +
        "_" +
        classname[1] +
        "_" +
        classname[2] +
        "_" +
        classname[3] +
        "_" +
        classname[4];
      console.log(fetchclass);
      const docRef = doc(db, "classesinfo", fetchclass);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        console.log("hi");
        let d1 = true;
        const facultyIDs = docData.data()["faculty_ID"];
        console.log(facultyIDs);
        console.log("hiiiiiiiiii");
        if (facultyIDs != null)
          for (let index = 0; index < facultyIDs.length; index++) {
            console.log("infor");
            const ele = facultyIDs[index];

            if (ele.subject === classname[5]) {
              d1 = false;
              //SHOW THAT SOME FACULTY ALREADY REGISTERED......
            } else {
              await updateDoc(docRef, {
                faculty_ID: arrayUnion({
                  faculty: email,
                  subject: classname[5],
                }),
              });
              break;
            }
          }
        console.log("afterfor");
        console.log(d1);
        if (d1) {
          console.log("d1trueif");
          await updateDoc(docRef, {
            faculty_ID: [
              {
                faculty: email,
                subject: classname[5],
              },
            ],
          });
        }
        console.log("afterd1trueif");
      } else {
        console.log("doc not exist");
        //setdoc
        await setDoc(docRef, {
          faculty_ID: [
            {
              faculty: email,
              subject: classname[5],
            },
          ],
        });
      }
    }
    await updateDoc(facultyRef, { isEnrolled: true });
  } catch (error) {
    return error.code;
  }
  return null;
}


async function enrollClasses(email,enrolled_classes){
  console.log('nnnn');
  const facultyRef = doc(db,"faculty",email);
  let alreadyEnrolled = [];
  let isAlreadyEnrolled = false;
  try{
    console.log('nnnn');
    await setDoc(facultyRef,{subjects:enrolled_classes,isEnrolled:false});
    for(let i=0;i<enrolled_classes.length;i++){
      console.log('nnnn');
      var classname = enrolled_classes[i].split("_");
      var fetchclass =
        classname[0] +
        "_" +
        classname[1] +
        "_" +
        classname[2] +
        "_" +
        classname[3] +
        "_" +
        classname[4];
        const docRef = doc(db,"classesinfo",fetchclass);
        const docData = await getDoc(docRef);
        if(docData.exists()){
          console.log('nnnn');
          const facultyIDs = docData.data()["faculty_ID"];
          console.log();
          if(facultyIDs!=null){
            console.log("Not Null");
            console.log('nnnn');
            for (let index=0;index<facultyIDs.length;index++){
              console.log('nnnn');
              const ele = facultyIDs[index];
              if(ele.subject === classname[5]){
                console.log('nnnn');
                isAlreadyEnrolled = true;
              alreadyEnrolled=[...alreadyEnrolled,{ faculty: ele.faculty,
                  subject:enrolled_classes[i]}]
              }
              else{
                console.log('nnnn');
                await updateDoc(docRef, {
                  faculty_ID: arrayUnion({
                    faculty: email,
                    subject: classname[5],
                  }),
                });
              }
            }
          }
          else{
            console.log("Null Here");
            console.log('nnnn');
            await updateDoc(docRef, {
              faculty_ID: [
                {
                  faculty: email,
                  subject: classname[5],
                },
              ],
            });
          }
        }
        else{
          console.log('nnnn');
          await setDoc(docRef, {
            faculty_ID: [
              {
                faculty: email,
                subject: classname[5],
              },
            ],
          });
        }
    }
    if(isAlreadyEnrolled){
      console.log('nnnn');
      console.log(alreadyEnrolled);
      return alreadyEnrolled;
    }
    await updateDoc(facultyRef,{isEnrolled:true});
    
  }
  catch(e){
    console.log(e);
    throw e.code;
  }
  return null;
}

// async function enrollClasses(email, enrolled_classes) {
//   const facultyRef = doc(db, "faculty", email);
// console.log(enrolled_classes)
//   try {
//     await setDoc(facultyRef, { subjects: enrolled_classes, isEnrolled: false });
//     for (let i = 0; i < enrolled_classes.length; i++) {
//       console.log(enrolled_classes[i]);
//       var classname = enrolled_classes[i].split("_");
//       var fetchclass =
//         classname[0] +
//         "_" +
//         classname[1] +
//         "_" +
//         classname[2] +
//         "_" +
//         classname[3] +
//         "_" +
//         classname[4];
//       console.log(fetchclass);
//       const docRef = doc(db, "classesinfo", fetchclass);
//       const docData = await getDoc(docRef);
//       if (docData.exists()) {
//         console.log("hi");
//         let d1 = true;
//         const facultyIDs = docData.data()["faculty_ID"];
//         console.log(facultyIDs);
//         console.log("hiiiiiiiiii");
//         if (facultyIDs != null){
//           for (let index = 0; index < facultyIDs.length; index++) {
//             console.log("infor");
//             const ele = facultyIDs[index];

//             if (ele.subject === classname[5]) {
//               console.log("insideeleif")
//               d1 = false;
//               console.log(ele.subject)
//               //SHOW THAT SOME FACULTY ALREADY REGISTERED......
//             } else {
//               console.log("inelse")
//               await updateDoc(docRef, {
//                 faculty_ID: arrayUnion({
//                   faculty: email,
//                   subject: classname[5],
//                 }),
//               });
//             }
//             continue;
//           }
//         }
//         else{
//           await updateDoc(docRef, {
//             faculty_ID: [
//               {
//                 faculty: email,
//                 subject: classname[5],
//               },
//             ],
//           });
//         }
//         console.log("afterfor");
//         console.log(d1);
//         console.log("afterd1trueif");
//       } else {
//         console.log("doc not exist");
//         //setdoc
//         await setDoc(docRef, {
//           faculty_ID: [
//             {
//               faculty: email,
//               subject: classname[5],
//             },
//           ],
//         });
//       }
//     }
//     await updateDoc(facultyRef, { isEnrolled: true });
//   } catch (error) {
//     console.log(error);
//     return error.code;
//   }
//   return null;
// }


//CHANGE SEMESTER DONEEEEEEE!!!!!!!!!!!!!!
export const getDepartments = async (course, year, semester) => {
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
    console.log(departments, subjects, sections);
    return { departments: departments, subjects: subjects, sections: sections };
  } catch (error) {
    console.log(error);
  }
};

export const getPRA = async (sub, department) => {
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

export const setPRA = async (
  sub,
  department,
  date,
  inst,
  //email,
  isMid1,
  isMid2
) => {
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
                //facultyID: email,
                deadline1: date,
                instructions: inst,
                subject: sub,
              }),
            });
          } else if (isMid2) {
            await updateDoc(docRef, {
              subjects: arrayUnion({
                //facultyID: email,
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
        // await setDoc(docRef,{subjects:[{ facultyID:email, deadline1:date,instructions:inst,subject:sub}]})
        if (isMid1) {
          await updateDoc(docRef, {
            subjects: arrayUnion({
              //facultyID: email,
              deadline1: date,
              instructions: inst,
              subject: sub,
            }),
          });
        }
        if (isMid2) {
          await updateDoc(docRef, {
            subjects: arrayUnion({
              //facultyID: email,
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
            //facultyID: email,
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

export const getSubjects = async (email) => {
  try {
    const docRef = await getDoc(doc(db, "faculty", email));
    const data = docRef.data()["subjects"];

    let btechSubs = [];
    let mtechSubs = [];
    let mbaSubs = [];
    let praSetSubs = {};
    for (let index = 0; index < data.length; index++) {
      const sub = data[index];

      //TODO :alter this 
      const parts = sub.split("_");
      const idk =
        parts[0] +
        "_" +
        parts[1] +
        "_" +
        parts[2] +
        "_" +
        parts[3] +
        "_" +
        parts[4];

      const subRef = await getDoc(doc(db, "subjects", idk));
      if (subRef.exists()) {
        const subsData = subRef.data()["subjects"];

        for (let i = 0; i < subsData.length; i++) {
          if (parts[5] === subsData[i].subject) {
            praSetSubs[sub] = subsData[i];
            let date1 = praSetSubs[sub].deadline1.toDate();
            date1 = date1.toLocaleDateString("en-GB");
            praSetSubs[sub].date1 = date1;
            if (praSetSubs[sub].deadline2) {
              let date2 = praSetSubs[sub].deadline2.toDate();
              date2 = date2.toLocaleDateString("en-GB");
              praSetSubs[sub].date2 = date2;
            }
          }
        }
      }

      const klass = parts[0];

      if (klass === "BTech") {
        btechSubs.push(sub);
      } else if (klass === "MTech") {
        mtechSubs.push(sub);
      } else {
        mbaSubs.push(sub);
      }
    }

    return {
      praSetSubs: praSetSubs,
      btechSubs: btechSubs,
      mtechSubs: mtechSubs,
      mbaSubs: mbaSubs,
    };
  } catch (error) {
    console.log(error);
    return -1;
  }
};

async function getMarks(className, email) {
  const userRef= doc(db, `users`, email);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return {
        data: docSnap.data()["subjects"].find((e)=>e.subject===className.split('_').pop()),
        error: null,
      };
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
    } else {
      return {
        data: null,
        // status:"UNGRADED",
        error: null,
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

async function postMarks(
  facultyID,
  className,
  studentID,
  midNo,
  marks,
  remarks
) {
  let error = null;

  // const facultyRef = doc(db, `faculty/${facultyID}/${className}`, studentID);

  const userRef = doc(db, `users`, studentID + "@vbithyd.ac.in");

  try {
    if (midNo === "1") {
      // await updateDoc(facultyRef, {
      //   mid1: marks,
      //   remarks1: remarks,
      // });
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
      // await updateDoc(facultyRef, {
      //   mid2: marks,
      //   remarks2: remarks,
      // });
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
    // console.log(error);
  }
}

async function getAllStudentsData(
  // facultyID, this param is not necessary 
  className) {
  const subject = className.split('_').pop();
  const facultyRef = doc(db, "classesinfo",className.replace("_"+subject,""));  

  try {
    const res = await getDoc(facultyRef);
    if(res.exists()){
      let studentList =  res.data()["students"]; 
      let studentsInfo = [];
      
      // let studentRef;
      studentList.forEach(async(student)=>{
        const studentSnap  = await getDoc(doc(db,'users',student));
        //studentsInfo.push(studentSnap.data()['subjects'].find((e)=>e.subject===subject)); 
        studentsInfo.push({
          id:student,
          data:studentSnap.data()['subjects'].find((e)=>e.subject===subject)
        })  
      })

      return {
        data:studentsInfo,
        error: null,
      };     

    }else{
      return {
        data: null,
        error: "Data Not Found",
      };
    }
    // if (res.docs.length !== 0) {
    //   return {
    //     data: res.docs,
    //     error: null,
    //   };
    // } else {
    // }
  } catch (error) {
    return {
      data: null,
      error: error.toString(),
    };
  }
}

async function addClass(email, addedClass) {
  const facultyRef = doc(db, "faculty", email);
  try {
    await updateDoc(facultyRef, { subjects: arrayUnion(addedClass) });

    //let isAdded = false;
    console.log(addedClass);
    var classname = addedClass.split("_");
    var fetchclass =
      classname[0] +
      "_" +
      classname[1] +
      "_" +
      classname[2] +
      "_" +
      classname[3] +
      "_" +
      classname[4];
    console.log(fetchclass);
    const docRef = doc(db, "classesinfo", fetchclass);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
      let d1 = true;
      const facultyIDs = docData.data()["faculty_ID"];
      if (facultyIDs != null)
        for (let index = 0; index < facultyIDs.length; index++) {

          const ele = facultyIDs[index];

          if (ele.subject === classname[5]) {
            d1 = false;
            return {
              data : ele.faculty,
              className:addedClass.split('_').join('-')
          }
            //SHOW THAT SOME FACULTY ALREADY REGISTERED......
          } else {
            await updateDoc(docRef, {
              faculty_ID: arrayUnion({
                faculty: email,
                subject: classname[5],
              }),
            });
            break;
          }
        }
      if (d1) {
        await updateDoc(docRef, {
          faculty_ID: [
            {
              faculty: email,
              subject: classname[5],
            },
          ],
        });
      }
    } else {
      console.log("doc not exist");
      //setdoc
      await setDoc(docRef, {
        faculty_ID: [
          {
            faculty: email,
            subject: classname[5],
          },
        ],
      });
    }
    //isAdded = true;
  } catch (error) {
    console.log(error);
    return error.code;
  }
  return null;
}


//delete class 
//deletes class from the faculty, although subject changes are persistent
// async function deleteClass(email, deletedClass) {
//     const subjectRef = collection(db, "faculty", email, deletedClass);
//     const facultyRef = doc(db, "faculty", email);
//     const docSnap = await getDoc(facultyRef);
//     const alldocs = await getDocs(subjectRef);

//     async function del(e) {
//       await deleteDoc(doc(db, "faculty", email, deletedClass, e));
//       console.log(docSnap.data());
//     }
  
//     try {
//       if (docSnap.exists()) {
//         console.log(docSnap.data());
//         const subjects = docSnap.data()["subjects"];
//         console.log(subjects);
//         for (let index = 0; index < subjects.length; index++) {
//           const ele = subjects[index];

//           if (ele === deletedClass) {
//             await updateDoc(facultyRef, { subjects: arrayRemove(ele) });
//           }
//         }
//       }
//       alldocs.docs.forEach((d) => {
//         del(d.id);
//         console.log(d.id);
//       });
//       return true;
//     } catch (err) {
//       console.log(err);
//     }

//     return false;
// }

async function deleteClass(email,className) {
  let error =true;
  const subject = className.split('_').pop();
  const classesInfoRef = doc(db,'classesinfo',className.replace("_"+subject,""));
  const facultyRef = doc(db, "faculty", email);
  //const subjectsRef = doc(db, "subjects", className.replace("_"+subject,""));

  // console.log(subject);
  // console.log(className);
  // console.log(className.replace("_"+subject,""),10);
  try {
    //removes the object in classes info 
    await updateDoc(classesInfoRef,{
      faculty_ID:arrayRemove({
        faculty:email,
        subject:subject
      })
    })  

    //removes the value in faculty collection 
    await updateDoc(facultyRef,{
      subjects:arrayRemove(className)
    })


    //updates subject collection i.e remove faculty name - persists faculty changes
    //const subjectDoc = await getDoc(subjectsRef)
    // if (subjectDoc.exists()) {
    //   console.log("Subject Collection Changed");
    //   let data = subjectDoc.data()["subjects"];
    //   console.log(subjectDoc);
    //   console.log(data);
    //   data = data.map(obj => {
    //     if (obj.subject === subject) {
    //       return {...obj, facultyID: ''};
    //     }
    //     return obj;
    //   });
    //   console.log(data,11);
    //   await updateDoc(subjectsRef,{
    //     subjects:data
    //   })
    // } else {
    //   console.log("fjffh");
    //   error=true
    // }    
  } catch (err) {
    console.log(err);
    error=true
  }
    return error;
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

export {
  getEnrolledCourses,
  enrollClasses,
  enrollHODClasses,
  postMarks,
  getMarks,
  getCoeDeadline,
  getAllStudentsData,
  addClass,
  deleteClass,
  getAllStudents,
};

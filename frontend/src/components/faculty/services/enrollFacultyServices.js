import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAcademicYear } from "./adminDeadlinesServices";

export async function modifySubjectName(subjects){
  let modSubjects = [];
  if(subjects.length){
    for(let i=0; i<subjects.length; i++){
      let Sub = subjects[i].split("_");
      let newSub = "";
      if(Sub.length == 6){
        let acadYear = await getAcademicYear(Sub[0], Sub[2]);
        console.log(acadYear.data);
        newSub = Sub[0]+"_"+acadYear.data+"_"+Sub[2]+"_"+Sub[3]+"_"+Sub[4]+"_"+Sub[5];
      }else{
        let acadYear = await getAcademicYear(Sub[0], Sub[1]);
        console.log(acadYear);
        newSub = Sub[0]+"_"+acadYear.data+"_"+Sub[1]+"_"+Sub[2]+"_"+Sub[3]+"_"+Sub[4];
      }      
      modSubjects.push(newSub);
    } 
  }
  return modSubjects;
}

//post faculty enrolled classes
export async function enrollClasses(email, enrolled_classes) {

  let mod_enrolled_classes = await modifySubjectName(enrolled_classes);
  const facultyRef = doc(db, "faculty", email);
  let alreadyEnrolled = [];
  let isAlreadyEnrolled = false;
  try {
    await setDoc(facultyRef, { subjects: mod_enrolled_classes, isEnrolled: false });
    for (let i = 0; i < mod_enrolled_classes.length; i++) {
      var classname = mod_enrolled_classes[i].split("_");
      // classname like "BTech_2022-23_4_IT_B_MACHINE LEARNING"
      // var fetchclass =
      //   classname[0] +
      //   "_" +
      //   classname[1] +
      //   "_" +
      //   classname[2] +
      //   "_" +
      //   classname[3] +
      //   "_" +
      //   classname[4];
      //const docRef = doc(db, "classesinfo", fetchclass);
      let course = classname[0];
      let acadYear = classname[1];
      let classroom = classname[2]+"_"+classname[3]+"_"+classname[4];      
      const docRef = doc(db, "classesinfo", course, acadYear, classroom);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        try {
          const facultyIDs = docData.data()["subjects"];

          if (facultyIDs != null) {
            for (let index = 0; index < facultyIDs.length; index++) {
              const ele = facultyIDs[index];
              if (ele.subject === classname[5]) {
                isAlreadyEnrolled = true;
                alreadyEnrolled = [
                  ...alreadyEnrolled,
                  { facultyID: ele.facultyID, subject: mod_enrolled_classes[i] },
                ];
              } else {
                await updateDoc(docRef, {
                  subjects: arrayUnion({
                    facultyID: email,
                    subject: classname[5],
                  }),
                });
              }
            }
          } else {
            await updateDoc(docRef, {
              subjects: [
                {
                  facultyID: email,
                  subject: classname[5],
                },
              ],
            });
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        await setDoc(docRef, {
          subjects: [
            {
              facultyID: email,
              subject: classname[5],
            },
          ],
        });
      }
    }
    await updateDoc(facultyRef, { isEnrolled: true });
    if (isAlreadyEnrolled) {
      return alreadyEnrolled;
    }
  } catch (e) {
    console.log(e);
    throw e.code;
  }
  return null;
}

//post hod enrolled classes
export async function enrollHODClasses(email, enrolled_classes) {
  let mod_enrolled_classes = await modifySubjectName(enrolled_classes);
  const facultyRef = doc(db, "faculty", email);
  let alreadyEnrolled = [];
  let isAlreadyEnrolled = false;
  try {
    await updateDoc(facultyRef, {
      subjects: mod_enrolled_classes,
      isEnrolled: false,
    });
    for (let i = 0; i < mod_enrolled_classes.length; i++) {
      var classname = mod_enrolled_classes[i].split("_");
      // var fetchclass =
      //   classname[0] +
      //   "_" +
      //   classname[1] +
      //   "_" +
      //   classname[2] +
      //   "_" +
      //   classname[3] +
      //   "_" +
      //   classname[4];
      // const docRef = doc(db, "classesinfo", fetchclass);
      let course = classname[0];
      let acadYear = classname[1];
      let classroom = classname[2]+"_"+classname[3]+"_"+classname[4];      
      const docRef = doc(db, "classesinfo", course, acadYear, classroom);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        const facultyIDs = docData.data()["subjects"];
        if (facultyIDs != null) {
          for (let index = 0; index < facultyIDs.length; index++) {
            const ele = facultyIDs[index];
            if (ele.subject === classname[5]) {
              isAlreadyEnrolled = true;
              alreadyEnrolled = [
                ...alreadyEnrolled,
                { facultyID: ele.facultyID, subject: mod_enrolled_classes[i] },
              ];
            } else {
              await updateDoc(docRef, {
                subjects: arrayUnion({
                  facultyID: email,
                  subject: classname[5],
                }),
              });
            }
          }
        } else {
          await updateDoc(docRef, {
            subjects: [
              {
                facultyID: email,
                subject: classname[5],
              },
            ],
          });
        }
      } else {
        await setDoc(docRef, {
          subjects: [
            {
              facultyID: email,
              subject: classname[5],
            },
          ],
        });
      }
    }
    await updateDoc(facultyRef, { isEnrolled: true });
    if (isAlreadyEnrolled) {
      return alreadyEnrolled;
    }
  } catch (error) {
    console.log(error);
    throw error.code;
  }
  return null;
}

//get faculty enrolled classes
/*TODO
REMOVE SUB DECLARATION
CHECK FUNCTION ONCE MORE
*/
export const getEnrolledSubjects = async (email) => {
  try {
    const docRef = await getDoc(doc(db, "faculty", email));
    const data = docRef.data()["subjects"];

    let btechSubs = [];
    let mtechSubs = [];
    let mbaSubs = [];
    let praSetSubs = {};
    for (let index = 0; index < data.length; index++) {
      let sub = data[index];

//sub = "BTech_2021-22_3_CSE_D_Computer Networks";
let course = sub.split("_")[0];
  let acadYear = sub.split("_")[1];
  let classroom =
    sub.split("_")[2] +
    "_" +
    sub.split("_")[3] +
    "_" +
    sub.split("_")[4];
    //TODO :alter this
    const parts = sub.split("_");


        const subRef = doc(db, "classesinfo", course, acadYear, classroom);
        const docSnap = await getDoc(subRef);
      if (docSnap.exists()) {
        const subsData = docSnap.data()["subjects"];

        for (let i = 0; i < subsData.length; i++) {
          if (parts[5] === subsData[i].subject) {
            if(subsData[i].deadline1){            
              praSetSubs[sub] = subsData[i];
            let date1 = praSetSubs[sub].deadline1.toDate();
            date1 = date1.toLocaleDateString("en-GB");
            praSetSubs[sub].date1 = date1;
            }
            if (subsData[i].deadline2) {
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

//deletes an enrolled class
export async function deleteClass(email, className) {
  let error = true;
  console.log(className)
  const arrSub = className.split("_")
  const course = arrSub[0]
  const acadYear = arrSub[1]
  const classroom = arrSub[2]+"_"+arrSub[3]+"_"+arrSub[4]
  const subject = arrSub[5]

  const classesInfoRef = doc(db, "classesinfo", course, acadYear, classroom);
  const facultyRef = doc(db, "faculty", email);

  try {
    //removes the object in classes info
    await updateDoc(classesInfoRef, {
      subjects: arrayRemove({
        facultyID: email,
        subject: subject,
      }),
    });

    //removes the value in faculty collection
    await updateDoc(facultyRef, {
      subjects: arrayRemove(className),
    });
  } catch (err) {
    console.log(err);
    error = true;
  }
  return error;
}

//enrolls to a single class (or) adds a class to enrolled classes
export async function addClass(email, addedClass) {
  let arr = [addedClass]
  let modarr_addedClass = await modifySubjectName(arr);
  let mod_addedClass = modarr_addedClass[0];
  const facultyRef = doc(db, "faculty", email);
  try {
    await updateDoc(facultyRef, { subjects: arrayUnion(mod_addedClass) });

    var classname = mod_addedClass.split("_");
    // var fetchclass =
    //   classname[0] +
    //   "_" +
    //   classname[1] +
    //   "_" +
    //   classname[2] +
    //   "_" +
    //   classname[3] +
    //   "_" +
    //   classname[4];
    // const docRef = doc(db, "classesinfo", fetchclass);
    let course = classname[0];
    let acadYear = classname[1];
    let classroom = classname[2]+"_"+classname[3]+"_"+classname[4];      
    const docRef = doc(db, "classesinfo", course, acadYear, classroom);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
      let d1 = true;
      const facultyIDs = docData.data()["subjects"];
      if (facultyIDs != null)
        for (let index = 0; index < facultyIDs.length; index++) {
          const ele = facultyIDs[index];

          if (ele.subject === classname[5]) {
            d1 = false;
            return {
              data: ele.facultyID,
              className: mod_addedClass.split("_").join("-"),
            };
            //SHOW THAT SOME FACULTY ALREADY REGISTERED......
          } else {
            d1 = false;
            await updateDoc(docRef, {
              subjects: arrayUnion({
                facultyID: email,
                subject: classname[5],
              }),
            });
            break;
          }
        }
      if (d1) {
        await updateDoc(docRef, {
          subjects: [
            {
              facultyID: email,
              subject: classname[5],
            },
          ],
        });
      }
    } else {
      //setdoc
      await setDoc(docRef, {
        subjects: [
          {
            facultyID: email,
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

//check if the faculty is enrolled or not (used in HODSearch screen)
export async function getIsEnrolled(email) {
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

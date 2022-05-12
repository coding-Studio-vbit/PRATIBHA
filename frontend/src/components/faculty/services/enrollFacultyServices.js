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

//post faculty enrolled classes
export async function enrollClasses(email, enrolled_classes) {
  const facultyRef = doc(db, "faculty", email);
  let alreadyEnrolled = [];
  let isAlreadyEnrolled = false;
  try {
    await setDoc(facultyRef, { subjects: enrolled_classes, isEnrolled: false });
    for (let i = 0; i < enrolled_classes.length; i++) {
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
      const docRef = doc(db, "classesinfo", fetchclass);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        try {
          const facultyIDs = docData.data()["faculty_ID"];

          if (facultyIDs != null) {
            for (let index = 0; index < facultyIDs.length; index++) {
              const ele = facultyIDs[index];
              if (ele.subject === classname[5]) {
                isAlreadyEnrolled = true;
                alreadyEnrolled = [
                  ...alreadyEnrolled,
                  { faculty: ele.faculty, subject: enrolled_classes[i] },
                ];
              } else {
                await updateDoc(docRef, {
                  faculty_ID: arrayUnion({
                    faculty: email,
                    subject: classname[5],
                  }),
                });
              }
            }
          } else {
            await updateDoc(docRef, {
              faculty_ID: [
                {
                  faculty: email,
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
  const facultyRef = doc(db, "faculty", email);
  let alreadyEnrolled = [];
  let isAlreadyEnrolled = false;
  try {
    await updateDoc(facultyRef, {
      subjects: enrolled_classes,
      isEnrolled: false,
    });
    for (let i = 0; i < enrolled_classes.length; i++) {
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
      const docRef = doc(db, "classesinfo", fetchclass);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        const facultyIDs = docData.data()["faculty_ID"];
        if (facultyIDs != null) {
          for (let index = 0; index < facultyIDs.length; index++) {
            const ele = facultyIDs[index];
            if (ele.subject === classname[5]) {
              isAlreadyEnrolled = true;
              alreadyEnrolled = [
                ...alreadyEnrolled,
                { faculty: ele.faculty, subject: enrolled_classes[i] },
              ];
            } else {
              await updateDoc(docRef, {
                faculty_ID: arrayUnion({
                  faculty: email,
                  subject: classname[5],
                }),
              });
            }
          }
        } else {
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
export const getEnrolledSubjects = async (email) => {
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

//deletes an enrolled class
export async function deleteClass(email, className) {
  let error = true;
  const subject = className.split("_").pop();
  const classesInfoRef = doc(
    db,
    "classesinfo",
    className.replace("_" + subject, "")
  );
  const facultyRef = doc(db, "faculty", email);

  try {
    //removes the object in classes info
    await updateDoc(classesInfoRef, {
      faculty_ID: arrayRemove({
        faculty: email,
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
  const facultyRef = doc(db, "faculty", email);
  try {
    await updateDoc(facultyRef, { subjects: arrayUnion(addedClass) });

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
              data: ele.faculty,
              className: addedClass.split("_").join("-"),
            };
            //SHOW THAT SOME FACULTY ALREADY REGISTERED......
          } else {
            d1 = false;
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

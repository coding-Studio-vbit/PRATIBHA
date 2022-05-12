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




export async function enrollClasses(email, enrolled_classes) {
    //in locklist.js
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




 export async function enrollHODClasses(email, enrolled_classes) {
    //in locklist.js
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
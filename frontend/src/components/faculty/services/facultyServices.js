import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

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

async function enrollClasses(email, enrolled_classes) {
  const facultyRef = doc(db, "faculty", email);
  try {
    await setDoc(facultyRef, { subjects: enrolled_classes, isEnrolled: false });
    for (let i = 0; i < enrolled_classes.length; i++) {
      await setDoc(doc(db, `faculty/${email}/${enrolled_classes[i]}`, email), {
        random: 1,
      });
    }
    await updateDoc(facultyRef, { isEnrolled: true });
  } catch (error) {
    return error.code;
  }
  return null;
}

export const getSubjects = async (email) => {
  try {
    const docRef = await getDoc(doc(db, "faculty", email));
    const data = docRef.data()["subjects"];

    let btechSubs = [];
    let mtechSubs = [];
    let mbaSubs = [];
    for (let index = 0; index < data.length; index++) {
      const sub = data[index];
      const klass = sub.split("_", 1)[0];
      if (klass === "Btech") {
        btechSubs.push(sub);
      } else if (klass === "Mtech") {
        mtechSubs.push(sub);
      } else {
        mbaSubs.push(sub);
      }
    }
    return {btechSubs:btechSubs,mtechSubs:mtechSubs,mbaSubs:mbaSubs}
  } catch (error) {
    return -1;
  }
};

// async function createSubCollection() {
//   console.log("Started");
//   try {
//     await setDoc(doc(db,`dummy/abcd/ABCD`,"Lafoot"), {
//       name: "Tokyo",
//       country: "Japan"
//     });
//   } catch (error) {
//     console.log("Fucked",error);
//   }
//   console.log("Ended");
// }

export { getEnrolledCourses, enrollClasses };

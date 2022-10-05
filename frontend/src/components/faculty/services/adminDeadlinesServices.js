import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  fetchSemNumber, fetchToSetSem,
} from "../../student/services/studentServices";



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





async function setCoeDeadlines(course, year, mid1, mid2, sem) {

  const midRef = doc(db, `adminData/coeDeadline/${course}`, `${year}`);
  const semRef = doc(db, `adminData/semester/${course}`, `${year}`);
  //const semnum = await fetchSemNumber(course, year);
  const semnum = await fetchToSetSem(course, year);
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

async function updateSubs(course,year,dept,subs,subno){
  const depref = doc(db,`curriculum/${course}/${year}/`,dept);
  try{
    const depsnap = await getDoc(depref);
  const update = [...subs] 
  if(depsnap.exists()){
    await updateDoc(depref,{[`subjects${subno}`]:update})
  }
  }
  catch(error){
    console.log(error)
  }
}

async function getAcademicYear(course, year){
  const ayref = doc(db, `adminData/academic_year/${course}`,`${year}`);
  try{
    const docSnap = await getDoc(ayref);
    if(docSnap.exists()){
      return {
        data: docSnap.data()["ay"],
        error: null,
      };
    }else{
      return {
        data: null,
        error: "ACADEMIC_YEAR_NOT_SET",
      };
    }

  }catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}


export {
  getCoeDeadline,
  getBeforeSemEnd,
  getSemDeadline,
  setCoeDeadlines,
  updateSubs,
  getAcademicYear
};

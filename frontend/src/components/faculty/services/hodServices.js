import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  fetchRegulationOptions,
  fetchRegulationsArray,
  fetchSemNumber,
  getStudentData,
  fetchMidNumber
} from "../../student/services/studentServices";
import { getUploadedFileByPath } from "../../student/services/storageServices";
import {
  getFirstYearCurriculumData,
  getDeptCurriculum,
} from "./curriculumServices";
import { getAcademicYear } from "./adminDeadlinesServices";


//change subs collection
export async function getFirstYearStatistics() {
  try {
    let semNumber = await fetchSemNumber('BTech','1');

    let arr1 = await getFirstYearCurriculumData(semNumber);
    let mid = await fetchMidNumber("BTech",'1');
    let createdPRA = [];
    let str = "";
    let acadYearData = await getAcademicYear('BTech','1');
    let acadYear = acadYearData.data;

    const q = query(collection(db, `classesinfo/BTech/${acadYear}`));

    const allDocs = await getDocs(q);
   
    allDocs.docs.forEach((e) => {
      let arr = e.id.split("_");
      if (arr[0] == "1" ) {
        for (let i = 0; i < e.data()["subjects"].length; i++) {
          let sub = e.data()["subjects"][i];
          if (mid=='1')
          {
            
            if(sub.deadline1)
            {

              str = "BTech"+"_"+acadYear+"_"+e.id + "_" + sub.subject;
              createdPRA.push(str);
            }

          }
          if (mid=='2')
          {
            if(sub.deadline2)
            {
              str = "BTech"+"_"+acadYear+"_"+e.id + "_" + sub.subject;
              createdPRA.push(str);
            }
          }

        }
      }
    });
    let difference = arr1.filter((x) => !createdPRA.includes(x));
    return difference;
  } catch (e) {
    console.log(e);
  }
}


//change subs collection
export async function getStatistics(course, dept, year) {
  try {
    let arr1 = await getDeptCurriculum(dept, course, year);
    let createdPRA = [];
    let str = "";
    const regArray = await fetchRegulationsArray();
    let regulation = regArray[year - 1];
    const q = query(collection(db, "subjects"));
    const allDocs = await getDocs(q);
    allDocs.docs.forEach((e) => {
      let arr = e.id.split("_");
      if (
        arr[0] == course &&
        arr[1] == regulation.toString() &&
        arr[2] == year.toString()
      ) {
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

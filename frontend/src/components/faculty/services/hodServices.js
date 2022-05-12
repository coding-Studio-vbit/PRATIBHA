
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
  fetchSemNumber,
  getStudentData,
} from "../../student/services/studentServices";
import { getUploadedFileByPath } from "../../student/services/storageServices";
import { getFirstYearCurriculumData } from "./curriculumServices";


export async function getFirstYearStatistics() {
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
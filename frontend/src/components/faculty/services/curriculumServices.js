import { db } from "../../../firebase";
import { collection, doc, query, getDocs, getDoc } from "firebase/firestore";
import {
  fetchRegulationOptions,
  fetchRegulationsArray,
  fetchSemNumber,
} from "../../student/services/studentServices";

//get the whole BTech first Year curriculum details.
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

export async function getDeptCurriculum(dept, course, year) {
  let subjects = [];
  let sections = [];
  let regArray = await fetchRegulationsArray();
  let reg = regArray[year - 1];
  let curriculumArray = [];

    try {
      let semester = await fetchSemNumber(course, year);
      const docRef = doc(db, `curriculum/${course}/${year}`, dept);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        sections = docSnap.data()["sections"];
        if (semester == 1) {
          subjects = docSnap.data()["subjects"];
          if (docSnap.data()["OEs"]) {
            let OEs = docSnap.data()["OEs"];
            for (let i = 0; i < docSnap.data()["OEs"].length; i++) {
              const ele = OEs[i];
              subjects.push(ele);
            }
          }
          if (docSnap.data()["PEs"]) {
            let PEs = docSnap.data()["PEs"];

            for (let i = 0; i < docSnap.data()["PEs"].length; i++) {
              const ele = PEs[i];
              subjects.push(ele);
            }
          }
        } else if (semester == 2) {
          subjects = docSnap.data()["subjects2"];

          if (docSnap.data()["OEs2"]) {
            let OEs2 = docSnap.data()["OEs2"];
            for (let i = 0; i < docSnap.data()["OEs2"]; i++) {
              const ele = OEs2[i];
              subjects.push(ele);
            }
          }
          if (docSnap.data()["PEs2"]) {
            let PEs2 = docSnap.data()["PEs2"];
            for (let i = 0; i < docSnap.data()["PEs2"]; i++) {
              const ele = PEs2[i];
              subjects.push(ele);
            }
          }
        }
      }
      for (let i = 0; i < sections.length; i++) {
        for (let j = 0; j < subjects.length; j++) {
          let str = course + "_" + reg + "_" + year + "_" + dept;
          str = str + "_" + sections[i] + "_" + subjects[j].subject;
          curriculumArray.push(str);
        }
      }

      return curriculumArray;
    } catch (e) {
      console.log(e);
    }
  
  
}

// TODO: MBA Curriculum

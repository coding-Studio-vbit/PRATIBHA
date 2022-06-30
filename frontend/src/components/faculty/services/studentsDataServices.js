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


export const Fetchlink = async (email, mid, fullcourse) => {
    const subjectval = fullcourse.split("_");
    let result;
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
  
    return result;
  };

  var student = "";
  var studentTopic = "";
  let data = [];
  export async function getFastData(subject, ismid1, ismid2, sEmail){
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
        }).then((res) => {
              if (res !== null) {
                data.push(res);
              }
            });
  }

  let arr = [];
  export async function getDataData(students,subject,ismid1,ismid2,){
    for(let i=0; i<students.length; i++){
      arr.push(getFastData(subject,ismid1,ismid2,students[i]));
    }
    return Promise.all(arr);

  }

  export async function getAllStudents(
    students,
    subject,
    ismid1,
    ismid2,
  ) {
    data = [];
    await getDataData(students,subject,ismid1,ismid2);
    // for (var sd = 0; sd < students.length; sd++) {
    //   let sEmail = students[sd];
      // await getStudentData(sEmail)
      //   .then(async ({ document, error }) => {
      //     var returndata = document;
      //     var topic, name, mid1, mid2;
  
      //     var Innovation1 = "",
      //       Innovation2 = "",
      //       Subject_Relevance1 = "",
      //       Subject_Relevance2 = "",
      //       Individuality1 = "",
      //       Individuality2 = "",
      //       Preparation1 = "",
      //       Preparation2 = "",
      //       Presentation1 = "",
      //       Presentation2 = "";
  
      //     if (error == null) {
      //       let obj = returndata["subjects"].find((o) => o.subject === subject);
      //       if (obj) {
      //         topic = obj.topic;
      //         name = returndata.name;
  
      //         if (obj.mid1_marks) {
      //           Innovation1 = obj.mid1_marks.Innovation1;
      //           Subject_Relevance1 = obj.mid1_marks.Subject_Relevance1;
      //           Individuality1 = obj.mid1_marks.Individuality1;
      //           Preparation1 = obj.mid1_marks.Preparation1;
      //           Presentation1 = obj.mid1_marks.Presentation1;
      //         } else {
      //           if (student === "" && ismid1) {
      //             student = sEmail.split("@")[0];
      //             studentTopic = topic;
      //           }
      //         }
  
      //         if (obj.mid2_marks) {
      //           Innovation2 = obj.mid2_marks.Innovation2;
      //           Subject_Relevance2 = obj.mid2_marks.Subject_Relevance2;
      //           Individuality2 = obj.mid2_marks.Individuality2;
      //           Preparation2 = obj.mid2_marks.Preparation2;
      //           Presentation2 = obj.mid2_marks.Presentation2;
      //         } else {
      //           if (student === "" && ismid2) {
      //             student = student + sEmail.split("@")[0];
      //             studentTopic = studentTopic + topic;
      //           }
      //         }
  
      //         mid1 = obj.mid1_marks
      //           ? Innovation1 +
      //             Subject_Relevance1 +
      //             Individuality1 +
      //             Preparation1 +
      //             Presentation1
      //           : obj.mid_1
      //           ? "Not Graded"
      //           : ismid1 || ismid2
      //           ? "Not Submitted"
      //           : " ";
  
      //         mid2 = obj.mid2_marks
      //           ? Innovation2 +
      //             Subject_Relevance2 +
      //             Individuality2 +
      //             Preparation2 +
      //             Presentation2
      //           : obj.mid_2
      //           ? "Not Graded"
      //           : ismid2
      //           ? "Not Submitted"
      //           : " ";
  
              
      //       }
      //       const dataobj = {
      //         ROLL_NO: sEmail.split("@")[0],
      //         STUDENT_NAME: name,
      //         TOPIC_NAME: topic,
      //         Innovation1: Innovation1,
      //         Subject_Relevance1: Subject_Relevance1,
      //         Individuality1: Individuality1,
      //         Preparation1: Preparation1,
      //         Presentation1: Presentation1,
      //         MID_1: mid1,
      //         Innovation2: Innovation2,
      //         Subject_Relevance2: Subject_Relevance2,
      //         Individuality2: Individuality2,
      //         Preparation2: Preparation2,
      //         Presentation2: Presentation2,
      //         MID_2: mid2,
      //       };
      //       return dataobj;
      //     } else {
      //       return null;
      //     }
      //   })
      //   .then((res) => {
      //     if (res !== null) {
      //       data = [...data, res];
      //     }
      //   });
   // }
  //  await getDataData(students,subject,ismid1,ismid2).then(()=>{
  //    console.log(d);
    return {
      data: data,
      student: student,
      studentTopic: studentTopic,
    };
  //  })
    
  }


    //returns all the data about all the students of a particular class (Example: BTech_21_1_CSE_A)
    export async function getAllStudentsData(className) {
        const subject = className.split("_").pop();
        const facultyRef = doc(
          db,
          "classesinfo",
          className.replace("_" + subject, "")
        );
      
        try {
          const res = await getDoc(facultyRef);
          if (res.exists()) {
            let studentList = res.data()["students"].sort();
            let studentsInfo = [];
            for await (const student of studentList) {
              const studentSnap = await getDoc(doc(db, "users", student));
              studentsInfo.push({
                id: student,
                data: studentSnap
                  .data()
                  ["subjects"].find((e) => e.subject === subject),
              });
            }
            return {
              data: studentsInfo,
              error: null,
            };
          } else {
            return {
              data: null,
              error: "Data Not Found",
            };
          }
        } catch (error) {
          return {
            data: null,
            error: error.toString(),
          };
        }
      }


export async function getStudents (course,year,dept,sec,sem)
{

  try{
    let arr=[]

    const collectionRef = collection(db,"users");
    const allDocs = await getDocs(collectionRef);
    (allDocs).docs.forEach((e)=>{
      const data = e.data()
      if (data.course==course && data.year==year && data.department==dept && data.section==sec && data.semester==sem){
        arr.push(e.id)
      }
    })
    return arr
  }
  catch(e)
  {
    console.log(e);
  }
}





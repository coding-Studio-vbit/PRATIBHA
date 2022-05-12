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



export const Fetchlink = async (email, status, mid, fullcourse) => {
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


  export async function getAllStudents(
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
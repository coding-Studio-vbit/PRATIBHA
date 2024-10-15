import React, { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import rip from './bulkenrolls.module.css';
import Navbar from '../global_ui/navbar/navbar';
import { Spinner, LoadingScreen } from '../global_ui/spinner/spinner';
import Select from "react-select";
import { fetchDepartments, fetchSemNumber } from "../student/services/studentServices.js";
import Dialog from '../global_ui/dialog/dialog';
import { db } from "../../firebase";
import { useNavigate } from 'react-router-dom';

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp,
    collection,
    query,
    getDocs,
    arrayUnion,
} from "firebase/firestore";

export async function getRanges() {
    const ref = doc(db, "adminData", "acadyears");

    try {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            return {
                data: docSnap.data().acadYears,
                error: null,
            };
        } else {
            return {
                data: null,
                error: "RANGES_NOT_SET",
            };
        }
    }
    catch {
        console.log("ranges not set");
    }
}
export async function getDeptCurriculumSubsOnly(dept, course, year) {
    let subjects = [];
    let sections = [];
    let curriculumArray = [];
    if (course == "BTech" || course == "MTech") {
        try {
            let semester = await fetchSemNumber(course, year);
            console.log(semester)
            const docRef = doc(db, `curriculum/${course}/${year}`, dept);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                sections = docSnap.data()["sections"];
                if (semester == 1) {
                    subjects = docSnap.data()["subjects"];
                } else if (semester == 2) {
                    subjects = docSnap.data()["subjects2"];
                }
            }
            for (let j = 0; j < subjects.length; j++) {
                let str = course + "_" + year + "_" + dept;
                str = str + "_" + subjects[j].subject;
                curriculumArray.push(str);
            }

            return curriculumArray;
        } catch (e) {
            console.log(e);
        }
    }
    else if (course == "MBA") {
        try {
            let semester = await fetchSemNumber(course, year);
            const q = query(collection(db, "curriculum", course, year));
            const alldocs = await getDocs(q);
            alldocs.docs.forEach((e) => {
                sections = e.data()["sections"];
                if (semester == 1) {
                    subjects = e.data()["subjects"];

                } else if (semester == 2) {
                    subjects = e.data()["subjects2"];
                }
                for (let j = 0; j < subjects.length; j++) {
                    let str = course + "_" + year + "_" + e.id;
                    str = str + "_" + subjects[j].subject;
                    curriculumArray.push(str);
                }
            })

            return curriculumArray;
        }
        catch (e) {
            console.log(e)
        }
    }



}
export const addStudentstoClassesInfo = async (studentID, section, department, course, year, range) => {
    try {
        const sem = await fetchSemNumber(course, year);
        const docRef = doc(db, `classesinfo/${course}/${range}/`, `${year}_${department}_${section}`);
        const docData = await getDoc(docRef);

        if (!docData.exists()) {
            await setDoc(docRef, {
                students: studentID
            })
        }
        else {
            await updateDoc(docRef, { students: arrayUnion(...studentID) });
        }

    } catch (error) {
        console.log(error);
    }
};

export const newEnroll = async (name, mail, year, course, department, section, range, subjects, OE = [], PE = []) => {
    // query call to add student to classes info
    const docRef = doc(db, "students", `${mail}`);
    const docSnap = await getDoc(docRef);
    let semester = await fetchSemNumber(course, year);
    let map = {}
    let localsubs = [...subjects]
    console.log(subjects)
    if (OE.length > 0) {
        OE.forEach((e) => {
            console.log(e);
            if (e !== undefined && e !== "") {
                localsubs.push({ subject: e });
            }
        })
    }
    if (PE.length > 0) {
        PE.forEach((e) => {
            if (e !== undefined && e !== "")
                localsubs.push({ subject: e });
        })
    }
    if (docSnap.exists()) {
        if (semester == 1) {
            map["year"] = year;
            map["" + range] = {
                sem1: [
                    ...localsubs
                ],
                year: year,
            };
        }
        else if (semester == 2) {
            const data = docSnap.data();
            map["year"] = year;
            map["" + range] = data["" + range];
            map["" + range]["sem2"] = [
                ...localsubs,
            ]
        }
        try {
            await updateDoc(docRef, map);
        }
        catch (err) {
            alert("error occured");
        }
        return 1;
    }
    try {
        if (semester == 1) {
            map["" + range] = {
                sem1: [
                    ...localsubs,
                ],
                year: year,
            };
        } else {
            map["" + range] = {
                sem2: [
                    ...localsubs,
                ],
                year: year,
            };
        }
        await setDoc(docRef, {
            name: name,
            email: mail,
            department: department,
            section: section,
            year: year,
            course: course,
            ...map
        })
    }
    catch (err) {
        alert(err);
    }
    return 2;
}

const BulkEnrolls = () => {
    const [year, setYear] = useState("");
    const [load, setLoad] = useState(false);
    const [dept, setDept] = useState("");
    const [depts, setDepts] = useState([]);
    const [range, setRange] = useState("");
    const [course, setCourse] = useState("");
    const [signal, setSignal] = useState(false);
    const [students, setStudents] = useState([]);
    const years = [{ value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" }]

    const courses = [{ value: "BTech", label: "BTech" },
    { value: "MTech", label: "MTech" },
    { value: "MBA", label: "MBA" }]

    let ranges = []

    const navigate = useNavigate();

    async function getDepartments(course, year) {
        let deptlist;
        const departments = await fetchDepartments(course.value, year.value);

        deptlist = departments.data.map(element => {
            return { value: element.id, label: element.id }
        });
        console.log(deptlist)
        setDepts(deptlist);
    }

    const handleYearChange = () => {
        handleRanges();
        if (course.value === "BTech")
            return years;
        return years.slice(0, 2);
    }
    const handleRanges = async () => {
        const rangelist = await getRanges();
        rangelist.data.forEach((e) => {
            ranges.push({ value: e, label: e })
        })
        return ranges;
    }


    const readFile = (e) => {
        const file = e.target.files["0"];
        const reader = new FileReader();

        reader.onload = () => {
            const bstr = reader.result;
            const wb = XLSX.read(bstr, { type: "array" });
            // console.log(wb);
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            var tempdata = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            tempdata = tempdata.split("\n");
            // setData([...tempdata]);

            console.log(tempdata);
            intervals(tempdata);
            setLoad(true)
            reader.abort();

        };
        // reader.readAsBinaryString(file);
        reader.readAsArrayBuffer(file)

    }


    const intervals = async (data) => {
        let enrollArray = [], classArray = [], classInfo = [], subjects = [];
        let subs = await getDeptCurriculumSubsOnly(dept.value, course.value, year.value);
        subjects = subs.map((e) => {
            let sub = e.split("_");
            return { subject: sub[sub.length - 1] }
        })


        for(let i=1;i<data.length;i++){
            let student = data[i].split(",")
            console.log(student)
            if (student[0] && student[0] !== "") {
                enrollArray.push(newEnroll(student[1], student[2].toLowerCase().trim(), year.value, course.value, dept.value, student[3].toUpperCase().trim(), range.value, subjects, [student[4], student[5]], [student[6], student[7]]));
                classInfo.push([student[2].toLowerCase().trim(), student[3].toUpperCase().trim()])
            } else {
                break
            }
        }

        let sections = [[]];
        classInfo.forEach((e) => {
            if (!sections[e[1].charCodeAt(0) % 65]) {
                sections[e[1].charCodeAt(0) % 65] = [];
            }
            sections[e[1].charCodeAt(0) % 65].push(e[0]);
        })
        sections.forEach((e, index) => {
            if (e.length > 0) {
                classArray.push(addStudentstoClassesInfo(e, String.fromCharCode(65 + index), dept.value, course.value, year.value, range.value));
            }
        })
        Promise.all(enrollArray, classArray).then((values) => {
            setLoad(false)
            setSignal(true);
        });
    }


    return (
        <>
            <Navbar backURL={"/faculty/admin/"} className={rip.nav} back={true} title={"Bulk Enrolls"} logout={true} />
            <div className={rip.bodyContainer}>
                {load ? <LoadingScreen isTransparent={true} height={"90vh"} /> :
                    <div className={rip.enrollcontainer}>
                        <h2>Please input Excel file in following format:</h2>
                        <h3>S.no,Name,Mail,Section, Open Electives, Professional Electives</h3>
                        <div className={rip.inputbox} >
                            <p className="enroll-dropdown-title">Select Course</p>
                            <Select
                                placeholder="Course"
                                value={course}
                                onChange={(e) => { setCourse(e) }}
                                isDisabled={year}
                                className="select"
                                options={courses}
                                backspaceRemovesValue={true}
                            />
                        </div>
                        {signal && <Dialog message={"Enrolled Successfully"} onOK={() => window?.location.reload()} />}

                        <div className={rip.inputbox} >
                            <p className="enroll-dropdown-title">Select Year</p>
                            <Select
                                placeholder="Year"
                                value={year}
                                onChange={e => {
                                    getDepartments(course, e);
                                    setYear(e);
                                }}
                                isDisabled={!course || dept}
                                className="select"
                                options={handleYearChange()}
                            />
                        </div>
                        <div className={rip.inputbox} >
                            <p className="enroll-dropdown-title">Select Academic Year</p>
                            <Select
                                placeholder="Range"
                                value={range}
                                onChange={e => {
                                    // getDepartments(course, e);
                                    setRange(e);
                                }}
                                isDisabled={!course || dept}
                                className="select"
                                options={ranges}
                            />
                        </div>

                        <div className={rip.inputbox} >
                            <p className="enroll-dropdown-title">Select Department</p>
                            <Select
                                placeholder="Department"
                                value={dept}
                                onChange={(e) => { setDept(e) }}
                                isDisabled={!depts.length}
                                className="select"
                                options={depts}
                            />
                        </div>

                        {course && year && dept && <p id="class">{"Please upload Excel sheet of " + course.value + " " + year.value + " " + dept.value}</p>}
                        <label htmlFor="fileinput" className={rip.fileupload}>
                            <span className={rip.fileinput} onClick={async () => {
                                if (!(course && year && dept)) {
                                    console.log("HI")
                                    alert("Please select course, year and department first");
                                    return;
                                }
                                ;
                                // subjects = data.subjects;
                            }}>
                                Choose Excel File to Upload
                                {(course && year && dept) && <input id="fileinput" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" size={40} onChange={readFile} />}
                                <i className="fa fa-upload fa-2x"></i>
                            </span>
                        </label>
                    </div>
                }
            </div>
        </>
    );
}

export default BulkEnrolls;




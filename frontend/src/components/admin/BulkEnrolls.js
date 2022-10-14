import React, { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import rip from './bulkenrolls.module.css';
import Navbar from '../global_ui/navbar/navbar';
import Select from "react-select";
import { fetchDepartments, fetchSemNumber } from "../student/services/studentServices.js";
import Dialog from '../global_ui/dialog/dialog';
import { db } from "../../firebase";
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
export const addStudenttoClassesInfo = async (studentID, section, department, course, year, range) => {
    try {
        const sem = await fetchSemNumber(course, year);
        const docRef = doc(db, `classesinfo/${course}/${range}/`, `${year}_${department}_${section}`);
        const docData = await getDoc(docRef);

        if (!docData.exists()) {
            await setDoc(docRef, {
                students: [studentID]
            })
        }
        else {
            await updateDoc(docRef, { students: arrayUnion(studentID) });
        }

    } catch (error) {
        console.log(error);
    }
};

const newEnroll = async (name, mail, year, course, department, section, subjects) => {
    let date = new Date();
    let range = `${date.getFullYear()}-${date.getFullYear() % 2000 + 1}`;
    await addStudenttoClassesInfo(mail, section, department, course, year, range); // query call to add student to classes info
    const docRef = doc(db, "usersdummy", `${mail}`);
    const docSnap = await getDoc(docRef);
    let semester = await fetchSemNumber(course, year);
    // let semester = 1; //use this temp sem value for testing
    // console.log(range) 
    let map = {}
    if (docSnap.exists()) {
        if (semester == 1) {
            map["" + range] = {
                sem1: {
                    "subjects": subjects,
                },
                year: year,
            };
        }
        else if (semester == 2) {
            const data = docSnap.data();
            map["" + range] = data["" + range];
            map["" + range]["sem2"] = {
                "subjects": subjects,
            }
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
                sem1: {
                    "subjects": subjects,
                },
                year: year,
            };
        }
        await setDoc(docRef, {
            name: name,
            email: mail,
            department: department,
            section: section,
            current_year: year,
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
    const [dept, setDept] = useState("");
    const [depts, setDepts] = useState([]);
    const [course, setCourse] = useState("");
    const [signal, setSignal] = useState(false);
    const [students, setStudents] = useState([]);
    const years = [{ value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }]

    const courses = [{ value: "BTech", label: "BTech" },
    { value: "MTech", label: "MTech" },
    { value: "MBA", label: "MBA" }]


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
        if (course.value === "BTech")
            return years;
        return years.slice(0, 2);
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

            intervals(tempdata);
            reader.abort();

        };
        // reader.readAsBinaryString(file);
        reader.readAsArrayBuffer(file)

    }


    const intervals = async (data) => {
        let temp = [], subjects = [];
        // console.log(data);
        let subs = await getDeptCurriculumSubsOnly(dept.value, course.value, year.value);
        console.log(subs)
        subjects = subs.map((e) => {
            let sub = e.split("_");
            return { subject: sub[sub.length - 1] }
        })

        // variable i to track the current row
        // variable j to modify the temp array and change the animation in the screen
        for (let i = 1, j = 7; i < data.length; i++) { // consider the i value dude.
            let temparr = data[i].split(",");
            if (temparr[0]) {
                try {
                    temp.push([temparr[0], temparr[1]]);
                }
                catch (err) {
                    alert("Please check the excel sheet for format errors");
                    break;
                }
                if (temp.length < 8) // when the length of array isnt greater than 8, we keep pushing new rows of excel data
                    setStudents([...temp]);
                // console.log(students,i,j)

                await newEnroll(temparr[1], temparr[2], year.value, course.value, dept.value, temparr[3], subjects); // query call to enroll student

                try {
                    const ele = document.getElementById(i);
                    ele?.classList.add(rip.lol) // adding the animation class to the element containing the current student/ row data

                    if (i > j && window?.getComputedStyle(document.getElementById(j)).backgroundColor === "rgb(0, 128, 0)") { // condition to check the if the progress bars are filled.
                        temp = temp.slice(i + 1, temp.length);
                        j += 8;
                    }
                }
                catch (err) {
                    alert("An error has occured, please try again");
                    break;
                }
            }
        }
        setSignal(true);
    }


    return (
        <>
            <Navbar className={rip.nav} back={false} title={"Bulk Enrolls"} logout={true} />
            <div className={rip.bodyContainer}>
                <div className={rip.enrollcontainer}>
                    <div className={rip.inputbox} >
                        <p className="enroll-dropdown-title">Select Course</p>
                        <Select
                            placeholder="Course"
                            value={course}
                            onChange={(e) => { setCourse(e); console.log(e) }}
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
                    <label For="fileinput" className={rip.fileupload}>
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

                <div className={rip.progress}>
                    {students?.map((e) => {
                        return (
                            <div key={e} id={"parent " + e} className={rip.segment}>
                                {<p className={rip.info} key={e}>{e[1]}</p>}
                                <span className={rip.bars} >
                                    <span id={e[0]}></span>
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default BulkEnrolls;




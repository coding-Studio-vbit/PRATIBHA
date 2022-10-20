import React,{useState} from 'react';
import Navbar from '../global_ui/navbar/navbar';
import styles from "./manualEnroll.module.css";
import Select from "react-select";
import Input from '../global_ui/input/input.js';
import { fetchDepartments, fetchSemNumber } from "../student/services/studentServices.js";
import {newEnroll, getDeptCurriculumSubsOnly} from "./BulkEnrolls.js"
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


const getElectives = async (course, year, dept) => {
    const docRef = doc(db, `curriculum/${course}/${year}`, dept);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { "OEs":docSnap.data().OEs,"PEs":docSnap.data().PEs};
    }
}
const ManualEnroll = () => {
    
    const [name,setName] = useState("")
    const [mail,setMail] = useState("")
    const [course, setCourse] = useState("");
    const [dept, setDept] = useState("");
    const [year, setYear] = useState("");
    const [depts, setDepts] = useState([]);
    const [section, setSection] = useState("");
    const [OEs, setOEs] = useState([]);
    const [PEs, setPEs] = useState([]);
    const [OE1, setOE1] = useState("");
    const [OE2, setOE2] = useState("");
    const [PE1, setPE1] = useState("");
    const [PE2, setPE2] = useState("");


    const years = [{ value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" }]
    
    const sections = [{ value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }]

    const courses = [{ value: "BTech", label: "BTech" },
    { value: "MTech", label: "MTech" },
        { value: "MBA", label: "MBA" }]
    
    const handleYearChange = () => {
        if (course.value === "BTech")
            return years;
        return years.slice(0, 2);
    }
    const handleSectionChange = () => {
        if (course.value === "BTech")
            return years;
        return years.slice(0, 2);
    }

    const handleElectives = async () => {
        console.log(course.value, year.value,dept)
        const map = await getElectives(course.value, year.value, dept.value)
        let array = []
        map.OEs.forEach((e) => {
            array.push({ value: e.subject, label: e.subject })
        })
        setOEs(array)
        array = []
        map.PEs.forEach((e) => {
            array.push({ value: e.subject, label: e.subject })
        })
        setPEs(array)
    }   

    async function getDepartments(course, year) {
        let deptlist;
        const departments = await fetchDepartments(course.value, year.value);
        deptlist = departments.data.map(element => {
            return { value: element.id, label: element.id }
        });
        console.log(deptlist)
        setDepts(deptlist);
    }
    
    const handleSubmit = async (e) => {
        let subjects = [];
        console.log(666)
        let subs = await getDeptCurriculumSubsOnly(dept.value, course.value, year.value);
        console.log(subs)
        subjects = subs.map((e) => {
            let sub = e.split("_");
            return { subject: sub[sub.length - 1] }
        })
        await newEnroll(name,mail,year.value,course.value,dept.value,section.toUpperCase(),subjects,[OE1?.value,OE2?.value],[PE1?.value,PE2?.value])
        console.log(e)
        
        let date = new Date();
        let range = `${date.getFullYear()}-${date.getFullYear() % 2000 + 1}`;
        const docRef = doc(db, `classesinfo/${course.value}/${range}/`, `${year.value}_${dept.value}_${section.toUpperCase()}`);
        const docData = await getDoc(docRef);
        console.log(docData.exists())
        if (docData.exists()) {
            return await updateDoc(docRef, {
                students: arrayUnion(mail)
            });
        }
        await setDoc(docRef, {
            students: [mail]
        })
    }
    
    return (
        
        <>
            <Navbar back={true} backURL={"/faculty/admin/"} logout={true} className={styles.nav} title={"Manual Enroll"} />
            <div className={styles.body}>
                <form >
                <div className={styles.form}>
                    <Input
                        className={styles.input}
                            type={"text"}
                            placeholder={"Student Name"}
                            textAlign={"center"}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            size={28}
                        
                        />
                    <Input
                        className={styles.input}
                            type={"email"}
                            placeholder={"Student domain mail"}
                            textAlign={"center"}
                            size={28}
                            onChange={(e) => {
                                setMail(e.target.value)
                            }}
                        />
                        
                        <div className={styles.selectcontainer}>
                            <Select
                                options={courses}
                                placeholder={"Select Course"}
                                value={course}
                                className="select"
                                onChange={(e) => { setCourse(e) }}
                            />
                            <Select
                                options={handleYearChange()}
                                placeholder={"Select Year"}
                                value={year}
                                className="select"
                                onChange={(e) => { setYear(e); getDepartments(course, e) }}
                            />
                            <Select
                                options={depts}
                                placeholder={"Select Department"}
                                value={dept}
                                className="select"
                                onChange={(e) => { setDept(e)}}
                            />
                            
                            <Input type={"text"} caps={true} placeholder={"Section"} textAlign={"center"}
                                onChange={(e) => { setSection(e.target.value); handleElectives() }}
                                size={28} />
                            <Select
                                options={OEs}
                                placeholder={"Select OE1"}
                                value={OE1}
                                className="select"
                                onChange={(e) => { setOE1(e) }}
                            />
                            <Select
                                options={OEs}
                                placeholder={"Select OE2"}
                                value={OE2}
                                className="select"
                                onChange={(e) => { setOE2(e) }}
                            />
                            <Select
                                options={PEs}
                                placeholder={"Select PE1"}
                                value={PE1}
                                className="select"
                                onChange={(e) => { setPE1(e) }}
                            />
                            <Select
                                options={PEs}
                                placeholder={"Select PE2"}
                                value={PE2}
                                className="select"
                                onChange={(e) => { setPE2(e) }}
                            />
                        </div>
                        <button type={"button"} onClick={(e) => handleSubmit()} value={"Submit"}>submit</button>

                    </div>
                </form>
            </div>
    </>);
}
 
export default ManualEnroll;
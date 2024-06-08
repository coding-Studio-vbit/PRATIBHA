import React from 'react';
import styles from './adminPage.module.css';
import Navbar from '../global_ui/navbar/navbar';
import Card from '../global_ui/card/card';
import { Spinner } from '../global_ui/spinner/spinner';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { app, storage } from "../../firebase";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { newEnroll, getDeptCurriculumSubsOnly, addStudentstoClassesInfo } from './BulkEnrolls';
import {
    doc,
    getDoc,
    deleteDoc,
    setDoc,
    updateDoc,
    Timestamp,
    collection,
    query,
    getDocs,
    arrayUnion,
    where
} from "firebase/firestore";


const AdminPage = () => {


    const downloadFolderAsZip = async () => {

        let folderPath = "BTech" + '/' + "2022-23" + '/' + "2" + '/' + "CSM" + '/' + "C" + '/' + "Data Base Management Systems" + `/${1}`;
        const jszip = new JSZip();
        const folderRef = ref(storage, folderPath);
        const filesres = await listAll(folderRef)
        const files = filesres.items;
        console.log(files)
        const downloadUrls = await Promise.all(
            files.map(({ name }) => getDownloadURL(ref(storage, folderRef + '/' + name)))
        );
        const downloadedFiles = await Promise.all(downloadUrls.map(url => fetch(url).then(res => res.blob())));
        console.log(downloadedFiles)
        downloadedFiles.forEach((file, i) => {
            let type;
            if (
                file.type.split("/").pop() ==
                "vnd.openxmlformats-officedocument.presentationml.presentation"
            ) {
                type = ".pptx";
            } else if (file.type.split("/").pop() === "vnd.ms-powerpoint") {
                type = ".ppt";
            } else {
                type = file.type.split("/").pop();
            }
            console.log(file)
            jszip.file((files[i].name) + '.' + type, file)
        });
        const content = await jszip.generateAsync({ type: 'blob' });
        saveAs(content, folderPath);
    };

    const navigate = useNavigate();
    const addSubjectToDept = async () => {
        // manually add the subject to curriculum collection first. then run this function
        const documents = query(collection(db, "students"), where("year", "==", "2"));
        const dox = await getDocs(documents);
        console.log(dox.docs.length);
        dox.docs.forEach(async (doc, index) => {
            // console.log(doc.id);
            const dept = doc.data()["department"];
            if (dept === "ECE") {
                console.log(index, doc.id)
                let map = doc.data()["2023-24"];

                await updateDoc(doc.ref, {
                    "2023-24": map
                })
            }
        })
    }

    const magic = async () => {

        const docref = query(collection(db, "classesinfo/BTech/2023-24"));

        const dox = await getDocs(docref);

        dox.docs.forEach(async (doc, index) => {

            if (doc.id.length > 7){
                console.log(doc.id)
                deleteDoc(doc.ref)
            }
        })
    }

    const checkCurrentSubs = async () => {
        let subs = await getDeptCurriculumSubsOnly("IT", "BTech", "1");

        console.log(subs)
    }

    const updateSemSubsinStudents = async (year) => {

        const students = query(collection(db, "students"), where("year", "==", year));
        const dox = await getDocs(students);
        console.log(dox.docs)
        dox.docs.forEach(async (doc, index) => {
            // if (doc.data()["year"] === "2" && doc.data()["department"] === "CSC") {
            if(doc.data()["course"] !== "MBA"){
                return;
            }
            let data = doc.data();
            let subs = await getDeptCurriculumSubsOnly(data["department"], "MBA", year);
            let subjects = subs.map((e) => {
                let sub = e.split("_");
                return { subject: sub[sub.length - 1]}
            })
            console.log(subjects)
             console.log(doc.data());
            await newEnroll(data["name"], data["email"], year, "MBA", data["department"], data["section"], "2023-24",subjects)
        })
        // await addToClassesInfoByDept(dox,"CSC", "3", "2023-24");
    }

    const removeFaultyMails = async () => {
        const students = query(collection(db, "students"));
        const dox = await getDocs(students);

        dox.docs.forEach(async (doc, index) => {
            if (!doc.data()["email"].includes("@")) {
                let data = doc.data();
                console.log(data["email"])
                await deleteDoc(doc.ref)
            }
        })
    }

    const addToClassesInfoByDept = async () => {

        const students = query(collection(db, "students"),where("year", "==", "3"), where("department", "==", "ME"));

        const dox = await getDocs(students);
        let info = {
            sections: [],
        }
        dox.docs.forEach(async (doc, index) => {
            let data = doc.data();
            !info.sections.includes(data["section"]) && info.sections.push(data["section"])
            !info["" + data["section"]] && (info["" + data["section"]] = [])
            info["" + data["section"]] = [...(info["" + data["section"]]), data["email"]]
        })
        Promise.all(info.sections.map((section) => addStudentstoClassesInfo(info[section], section, "ME", "BTech", "3", "2023-24")))
    }

    const checkEnroll = async () => {
        const ref = query(collection(db, "students"))
        const dox = await getDocs(ref);

        let count = 0
        dox.docs.forEach(async (doc, index) => {
            if (doc.data()["year"] === "1") {
                let data = doc.data();

                if (!data["2022-23"]["sem2"])
                    count++
            }
        });
        console.log(count);
    }


    const createNewSubject = async () => {
        const subs = [
            "Strategic Management",
            "Strategic Management Assignment",
            "International Marketing",
            "International Marketing Assignment",
            "International Human Resource Management",
            "International Human Resource Management Assignment",
            "International Financial Management",
            "International Financial Management Assignment",
            "Service Marketing",
            "Service Marketing Assignment",
            "Leadership and Change Management",
            "Leadership and Change Management Assignment",
            "Strategic Financial Management",
            "Strategic Financial Management Assignment",
            "Marketing Analytics",
            "Marketing Analytics Assignment",
            "HR Analytics",
            "HR Analytics Assignment",
            "Financial Analytics",
            "Financial Analytics Assignment",
        ]

        const structured_subs = subs.map((sub) => {
            return {
                subject: sub
            }
        })

        const ref = doc(db, "curriculum/MBA/2", "default");

        await updateDoc(ref, {
            subjects2: structured_subs
        })
    }


    return (
        <div>
            <Navbar back={false} title={"Admin Page"} logout={true} />
            <div className={styles.container}>
                <Card text={"Bulk Enrolls"} onclick={() => { navigate("/faculty/admin/bulkenrolls") }} />
                <Card text={"Manual Enroll"} onclick={() => { navigate("/faculty/admin/ManualEnroll") }} />
            </div>
            <button onClick={() => updateSemSubsinStudents("2")}>YO king</button>
        </div>
    );
}

export default AdminPage;


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
import { newEnroll, getDeptCurriculumSubsOnly } from './BulkEnrolls';
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
      
        let folderPath = "BTech"+'/'+"2022-23"+'/'+"2"+'/'+"CSM"+'/'+"C"+'/'+"Data Base Management Systems"+`/${1}`;
        const jszip = new JSZip();
        const folderRef = ref(storage, folderPath);
        const filesres = await listAll(folderRef)
        const files = filesres.items;
        console.log(files)
        const downloadUrls = await Promise.all(
            files.map(({ name }) => getDownloadURL(ref(storage, folderRef+'/'+name)))
        );
        const downloadedFiles = await Promise.all(downloadUrls.map(url => fetch(url).then(res => res.blob())));
        console.log(downloadedFiles)
        downloadedFiles.forEach((file, i) => {
          let type;
          if (
            file.type.split("/").pop() ==
            "vnd.openxmlformats-officedocument.presentationml.presentation"
          ) {
            type =  ".pptx";
          } else if (file.type.split("/").pop() === "vnd.ms-powerpoint") {
            type =  ".ppt";
          } else {
            type =  file.type.split("/").pop();          
          }
          console.log(file)
          jszip.file((files[i].name) +'.' +type, file)});
        const content = await jszip.generateAsync({ type: 'blob' });
        saveAs(content, folderPath);
    };

    const navigate = useNavigate();
    const addSubjectToDept = async () => {
        // manually add the subject to curriculum collection first. then run this function
        const documents = query(collection(db, "students"), where("year", "==", "1"));
        const dox = await getDocs(documents);
        console.log(dox.docs.length);
        dox.docs.forEach(async (doc, index) => {
            // console.log(doc.id);
            const dept = doc.data()["department"];
            if (dept === "ME" || dept === "CE") {
                console.log(index, doc.id)
                let map = doc.data()["2022-23"];
                map.sem1.push({ "subject": "English" });

                await updateDoc(doc.ref, {
                    "2022-23": map
                })
            }
        })
    }

    const makeDocNamesLowerCase = async () => {

        const students = query(collection(db, "students"));
        const dox = await getDocs(students);

        dox.docs.forEach(async (doc, index) => {

            if (doc.data()["year"] === "1") {
                let data = doc.data();
                let subs = await getDeptCurriculumSubsOnly(data["department"], "BTech", "1");
                let subjects = subs.map((e) => {
                    let sub = e.split("_");
                    return { subject: sub[sub.length - 1]}
                })
                console.log(doc.data());
                await newEnroll(data["name"], data["email"], data["year"], "BTech", data["department"], data["section"], "2022-23",subjects)
            }
        })
    }

    const checkEnroll = async () =>{
        const ref = query(collection(db,"students" ))
        const dox = await getDocs(ref);

        let count = 0
        dox.docs.forEach(async (doc, index) => {
            if(doc.data()["year"] === "1"){
                let data = doc.data();

                if(!data["2022-23"]["sem2"])
                    count++
            }
        });
        console.log(count);
    }


    return (
        <div>
            <Navbar back={false} title={"Admin Page"} logout={true} />
            <div className={styles.container}>
                <Card text={"Bulk Enrolls"} onclick={() => { navigate("/faculty/admin/bulkenrolls") }} />
                <Card text={"Manual Enroll"} onclick={() => { navigate("/faculty/admin/ManualEnroll") }} />
            </div>
            <button onClick={()=>checkEnroll()}>YO king</button>
        </div>
    );
}

export default AdminPage;


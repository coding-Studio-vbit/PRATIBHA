import React from 'react';
import styles from './adminPage.module.css';
import Navbar from '../global_ui/navbar/navbar';
import Card from '../global_ui/card/card';
import { Spinner } from '../global_ui/spinner/spinner';
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase";
import { newEnroll } from './BulkEnrolls';
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

    const navigate = useNavigate();
    const addSubjectToDept = async () => { 
        // manually add the subject to curriculum collection first. then run this function
        const documents = query(collection(db, "students"), where("year", "==", "1"));
        const dox = await getDocs(documents);
        console.log(dox.docs.length);
        dox.docs.forEach(async (doc,index) => {
            // console.log(doc.id);
            const dept = doc.data()["department"];
            if (dept === "ME" || dept === "CE") {
                console.log(index,doc.id)
                let map = doc.data()["2022-23"];
                map.sem1.push({ "subject": "English" }); 

                await updateDoc(doc.ref, {
                    "2022-23": map
                })

            }
        })
    }

    const makeDocNamesLowerCase = async () => {
        // const docref = doc(db, "students", "22p61a0526@vbithyad.ac.in");
        // const docSnap = await getDoc(docref);
        // if (docSnap.exists()) {
        //     const data = docSnap.data();
        //     console.log(data);
        // }
        // else {
        //     console.log("No such document!");
        // }
        // const ref = doc(db, "students","21p61a6679@vbithyd.ac.in")
        // const dox = await getDoc(ref);
        // if (dox.exists()) {
        //     const data = dox.data();
        //     console.log(data);  
        // }
        // else {
        //     console.log("No such document!");
        // }
        const quer = query(collection(db, "students"));
        const dox = await getDocs(quer);
        dox.docs.forEach(async (docx) => {
            if (docx.id !== docx.data()["email"].toLowerCase() || docx.id !== docx.data()["email"].trim()) {
                console.log(docx.id);
                console.log(docx.data()["email"], docx.data()["department"]);
                // let data = docx.data();
                // data["email"] = data["email"].toLowerCase();
                // console.log(data["email"]);
                // await deleteDoc(docx.ref);
            }
        }
        )
    }
        

    return (
        <div>
            <Navbar back={false} title={"Admin Page"} logout={true} />
            <div className={styles.container}>
                <Card text={"Bulk Enrolls"} onclick={()=>{navigate("/faculty/admin/bulkenrolls")}} />
                <Card text={"Manual Enroll"} onclick={()=>{navigate("/faculty/admin/ManualEnroll")}} />
            </div>
            {/* <button onClick={()=>magic()}>YO king</button> */}
        </div>
    );
}
 
export default AdminPage;


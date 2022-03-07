import { db, storage } from "../../../firebase";
import { ref,uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc,updateDoc } from "firebase/firestore"; 

async function uploadFile(fileObj,course,year,regulation,department,section,subject,midNo,email,title,fileName){
    let error=null;

    //referring to the storage location | creating path
    const pra_ref= ref(
        storage,
        `${course}/${regulation}/${year}/${department}/${section}/${subject}/${midNo}/${email.split('@')[0]}`
    );

    //uploading files to storage 
    await uploadBytes(pra_ref,fileObj)
    .then(async(snapshot) => {
        try {
            let subs=null;
            const docRef = doc(db, "users",email);
            //refers userdoc
            const docSnap = await getDoc(docRef);
            //checking doc exists to verify enrollment
            if(docSnap.exists()){
                subs = docSnap.data()["subjects"];
                //finding the subject and updating 
                for(var i=0;i<subs.length;i++){
                    if(subs[i].subject===subject){
                        let s=subs[i];
                        if(midNo==="1"){
                            s.fileName1=fileName
                            s.topic=title
                            s.mid_1=snapshot.ref.fullPath;
                            subs[i]=s;
                        }else if(midNo==="2"){
                            s.fileName2=fileName
                            s.topic=title
                            s.mid_2=snapshot.ref.fullPath;
                            subs[i]=s;
                        }
                        break;                        
                    }                
                }
                try {
                    //updating the user doc
                    await updateDoc(docRef,{
                        subjects:subs,                        
                    });
                    
                } catch (err) {
                    error=err.toString();
                }
            }else{
                error = "Student Enrollment Failed";             
            }            
        }catch(err){
            error = err.toString();            
        }      
    })
    .catch((err)=>{
      error=err.toString();
    })
    return error;
}

async function getUploadedFile(course,year,regulation,department,section,subject,midNo,email) {
    let res={
        url:null,
        error:null,    
    }
    await getDownloadURL(ref(storage,`${course}/${regulation}/${year}/${department}/${section}/${subject}/${midNo}/${email.split('@')[0]}`))
    .then((url) => {
        res.url=url;
    })
    .catch((error) => {
        res.error=error.toString();    
    })
    return res;  
}

async function getUploadedFileByPath(path) {
    let res={
        url:null,
        error:null,    
    }
    await getDownloadURL(ref(storage,path))
    .then((url) => {
        res.url=url;
    })
    .catch((error) => {
        res.error=error.code;    
    })
    return res;  
}

export {uploadFile,getUploadedFile,getUploadedFileByPath}




// let pra_ref;
    // if(fileObj.type=="application/vnd.openxmlformats-officedocument.presentationml.presentation"){
    //     pra_ref = ref(
    //         storage,
    //         `${course}/${year}/${department}/${section}/${subject}/${midNo}/${email.split('@')[0]}.pptx`
    //     );
    // }else{
    //     pra_ref = ref(
    //         storage,
    //         `${course}/${year}/${department}/${section}/${subject}/${midNo}/${email.split('@')[0]}`
    //     );
    // }
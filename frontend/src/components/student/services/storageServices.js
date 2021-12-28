import { storage } from "../../../firebase";
import { ref,uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadFile(fileObj,course,year,department,section,subject,midNo,email){
    let error=null;
    const pra_ref = ref(
        storage,
        `${course}/${year}/${department}/${section}/${subject}/${midNo}/${email.split('@')[0]}`
    );
    await uploadBytes(pra_ref,fileObj)
    .then((snapshot) => {
        console.log('Uploaded a blob or file!');
        console.log(snapshot.ref.fullPath);        
    })
    .catch((err)=>{
      console.log(err.code);
      error=err;
    })
    return error;
}

async function getUploadedFile(course,year,department,section,subject,midNo,email) {
    let res={
        url:null,
        error:null,    
    }
    await getDownloadURL(ref(storage,`${course}/${year}/${department}/${section}/${subject}/${midNo}/${email.split('@')[0]}`))
    .then((url) => {
        console.log(url);
        res.url=url;
    })
    .catch((error) => {
        res.error=error.code;    
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
        console.log(url);
        res.url=url;
    })
    .catch((error) => {
        res.error=error.code;    
    })
    return res;  
}

export {uploadFile,getUploadedFile,getUploadedFileByPath }
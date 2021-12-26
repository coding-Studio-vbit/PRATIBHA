import { storage } from "../../../firebase";
import { ref,uploadBytes } from "firebase/storage";

async function uploadFile(fileObj,name,course,year,department,section,subject,midNo,email){
    let error=null;
    const pra_ref = ref(
        storage,
        `${course}/${year}/${department}/${section}/${subject}/${midNo}/${email.slice(0,10)}+"."+${name.split(".")[name.split(".").length-1]}`
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

export {uploadFile}
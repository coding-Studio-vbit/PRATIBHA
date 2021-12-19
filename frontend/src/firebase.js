import firebase from 'firebase/compat/app';
import { getAuth } from '@firebase/auth';
import { getStorage,ref,uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);
async function uploadFile(file,name){
    let error=null;
    const pra_ref = ref(storage, 'pra_ref/'+name);

    await uploadBytes(pra_ref, file)
    .then((snapshot) => {
        console.log('Uploaded a blob or file!');
        console.log(snapshot);
    })
    .catch((err)=>{
      console.log("Mahita");
        error=err;
    })
    return {
        error:error,
    }
}

export {auth,app,uploadFile};
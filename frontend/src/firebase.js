import { initializeApp} from "firebase/app";
import { getAuth } from '@firebase/auth';
import { getStorage,ref,uploadBytes } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
setPersistence(auth, browserSessionPersistence)

const storage = getStorage(app);
const db = getFirestore();

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
    return error;
}

export {auth,app,uploadFile,db};
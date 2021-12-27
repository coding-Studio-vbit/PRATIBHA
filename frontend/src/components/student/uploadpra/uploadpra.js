import React,{useState,useEffect} from 'react';
import styles from "./uploadpra.module.css";
import Button from "../../global_ui/buttons/button";
import Navbar from "../../global_ui/navbar/navbar";
import '@react-pdf-viewer/core/lib/styles/index.css';
// import { uploadFile } from '../../../firebase';
import { getUploadedFile, uploadFile } from '../services/storageServices';
import { LoadingScreen, Spinner } from '../../global_ui/spinner/spinner';
import Dialog from '../../global_ui/dialog/dialog';
import { useNavigate } from 'react-router-dom';
import { Viewer,Worker } from '@react-pdf-viewer/core';
import { getStudentData } from '../services/studentServices';
import { useAuth } from '../../context/AuthContext';

const Upload =({subject}) => {
    const { currentUser} = useAuth();
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [mid, setMid] = useState("SELECT_MID");
    const [selectError, setSelectError] =useState(null);

    const [showUploadModule, setShowUploadModule] = useState(false);
    const [error, setError] = useState(null);
    //error for deadlines
    const [praTitle, setPraTitle] = useState('');
    const [titleError, setTitleError] = useState('');   

    const [url, setUrl] = useState(null);
    const [fileName, setFileName] = useState('');    
    const [fileError, setFileError] = useState('');

    const [fileUploadLoading, setfileUploadLoading] = useState(false);

    const [showDialog, setshowDialog] = useState(false);
       
    async function handleSelect(value) {
        setShowUploadModule(false);
        setError(null);
        setMid(value);
        if(value!=="SELECT_MID"){
            setSelectError(null);
            setLoading(true);
            setTimeout(() => {
                setLoading(false)
                setShowUploadModule(true);
            }, 1000);
            //httpRequest 
            //on success show upload module or showError
        }else{
            setLoading(false);
            setSelectError("select mid number to continue");           
        }                        
    }

    function handleTitle(e){
        let value=e;
        setPraTitle(value)             
         if(value.length<8){
            setTitleError("Title must have atleast 8 characters");
            return false;
        }
        else{
            setTitleError("")
            return true;
        }   
    }

 
    const onChange = (e) => {
        let files=e.target.files[0];
        if (files.size > 200000){
            setUrl(null)
            setFileError("File Limit Exceeded");
        }
        else{
            setFileError("");
            setFileName(files.name)
            setUrl(e.target.files[0]);
        }
    }
    
    async function submit(){
        setfileUploadLoading(true);
        let res;
        if(url!=null & handleTitle(praTitle)){
            res = await uploadFile(url,"BTech","1","CSE","A","C","1","18p61a0513@vbithyd.ac.in");
            if(res==null){
                setfileUploadLoading(false);
                setError(null);
                setshowDialog(true);                        
            }
            else{
                setfileUploadLoading(false);
                setError(res);
                setTimeout(() => {
                    setError(null)
                }, 2000);
            }
        }
        else{
            if(url==null){
                setFileError("File not Uploaded");
            }
        }
      setfileUploadLoading(false);
	};

    function dialogClose(x) {
        setshowDialog(false);        
        navigate('/')
    }

    async function getFile() {
        try {
            const res = await getUploadedFile(user.course,user.year,user.department,user.section,subject,mid,currentUser.email);
            console.log(res);
            setres(res.url);            
        } catch (error) {
            console.log(error);           
        }      
    }

    const [res, setres] = useState();

    const [user, setUser] = useState();

    const [pageLoad, setPageLoad] = useState();

    async function getUserData() {
        setPageLoad(true);
        const res = await getStudentData(currentUser.email);
        if(res.error==null){
            setUser({
                course:res.document["course"],
                year:res.document["year"],
                department:res.document["department"],
                section:res.document["section"]
            })            
        }else{
            console.log();
        }
    }

    useEffect(() => {
        getUserData();
    },)
      
    return !pageLoad?(
        <>            
            <Navbar title="UPLOAD PRA"></Navbar>
            {
                showDialog &&
                <Dialog message={"Upload Successful"} onOK={dialogClose}/>
            }
            <div className={styles.main}>   
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                <div className="mt4" style={{ height: '120px', padding:'0px',width:'80px', margin:'0px' }}>
                {
                    res!=null?
                    <Viewer fileUrl={res} />:
                    <p>forferge</p>                  
                }                           
                </div>
            </Worker>
                <div>    
                    <select className={styles.selectList} value={mid} 
                        onChange={(e)=>handleSelect(e.target.value)}>
                        <option value="SELECT_MID">Select MID</option> 
                        <option value="MID-I">MID-I</option> 
                        <option value="MID-II">MID-II</option>
                    </select>
                    {
                        selectError &&
                        <p className={styles.errorField}>{selectError}</p>
                    }
                </div>

                <div style={{marginTop:'18px'}}>
                    {
                        loading && 
                        <Spinner radius={2} />
                    }
                </div>

                {
                    showUploadModule &&
                    <div className={styles.fileUploadModule}>
                        <p className={styles.instructions} style={{alignSelf:'start'}}>Instructions</p>
                        {
                            mid==="MID-I"?
                            <ul style={{alignSelf:'start'}}>
                                <li>
                                    <p className={styles.instructions}>Upload an abstract for your activity in not more than 150 words.</p>              
                                </li>
                                <li>
                                    <p className={styles.instructions}>Abstract can only be in pdf format</p>              
                                </li>
                            </ul>:
                            <ul style={{alignSelf:'start'}}>
                                <li>
                                    <p className={styles.instructions}>Upload PRA files</p>              
                                </li>
                                <li>
                                    <p className={styles.instructions}>Files Uploaded can be of any type</p>              
                                </li>
                            </ul>
                        }

                        <div>
                            <p className={styles.praLabel}>P.R.A Title</p>
                            <input type="text"  placeholder="TITLE OF THE ACTIVITY" className={styles.inputStyle}
                            value={praTitle} onChange={(e)=>handleTitle(e.target.value)} maxLength={50} />
                            <p className={styles.errorField}>{titleError}</p>         
                        </div> 

                        <div className={styles.fileContainer}>                    
                            <label className={styles.customFileUpload}>
                                <input type="file" accept=".pdf"  onChange={onChange} /> 
                                {
                                    fileName.length>0?"Change File":"Add File"
                                }
                            </label>
                            { (fileError.length>0 || fileName.length>0) && <div style={{width:'30px'}}></div>}
                            {/*for spacing*/}
                            {
                                fileError.length>0?
                                <p className={styles.errorField }>{fileError}</p> 
                                :<p className={styles.fileName}>{fileName}</p>          
                            } 
                        </div>

                        <Button 
                        className={{
                            width:'20ch',
                            alignSelf:'center',
                            marginTop:'20px',
                        }} 
                        onClick={()=>{submit()}}
                        >Upload</Button>
                        {
                            error &&
                            <div>
                                <p className={styles.errorField}>{error}</p>
                            </div>
                        } 
                    </div>                    
                }         
                 
                <div style={{marginTop:'18px'}}>
                    {
                        fileUploadLoading && 
                        <Spinner radius={2} />
                    }
                </div>        
            </div>
        </>
    ):<LoadingScreen/>;
}

export default Upload;
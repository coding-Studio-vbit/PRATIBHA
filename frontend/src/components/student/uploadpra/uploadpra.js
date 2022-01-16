import React, { useState, useEffect } from "react";
import styles from "./uploadpra.module.css";
import Button from "../../global_ui/buttons/button";
import Navbar from "../../global_ui/navbar/navbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { uploadFile } from "../services/storageServices";
import { LoadingScreen, Spinner } from "../../global_ui/spinner/spinner";
import Dialog from "../../global_ui/dialog/dialog";
import { useNavigate } from "react-router-dom";
import {
  getDeadLines,
  getFileUploadDetails,
  getStudentData,
} from "../services/studentServices";
import { useLocation} from "react-router-dom";
import { fetchisMid1,fetchisMid2 } from "../services/studentServices";
// import Download from "../../global_ui/download/download";
// import { Timestamp } from "firebase/firestore";

const Upload = () => {
    // DATA FROM THE PREVIOUS SCREEN
    // console.log(location.state.rollno);
    // console.log(location.state.subject);
    let location = useLocation();
    const [isMid1,setisMid1]=useState(false);
    const [isMid2,setisMid2]=useState(false);
    const [loading, setLoading] = useState(false);
    const [showUploadModule, setShowUploadModule] = useState(false);
    const [error, setError] = useState(null);
    const [mid1NotSubmitted, setMid1NotSubmitted] = useState(false);
    
    //error for deadlines
    const [praTitle, setPraTitle] = useState("");
    const [titleError, setTitleError] = useState("");
    const [url, setUrl] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState("");
    const [fileUploadLoading, setfileUploadLoading] = useState(false);
    const navigate = useNavigate();
  

    function handleTitle(e) 
    {
      let value = e;
      setPraTitle(value);
        // if(mid==="2"){
        //   return true;
        // }
        if(value==null){
            setTitleError("Title must have atleast 8 characters");
            return false;
        }
        else if (value.length < 8) {
            setTitleError("Title must have atleast 8 characters");
            return false;
        } 
        else{
            setTitleError("");
            return true;
        }
    }
 
    const onChange = (e) => 
    {
      let files = e.target.files[0];
      let size=200000;
        if (mid === "2") 
        {
          size = 1048576000;
        }
        if(files!=null)
        {
          if (files.size > size )
          {
            setUrl(null);
            setFileError("File Limit Exceeded. Maximum file size is 200KB.");
          } 
          else 
          {
            let ext;
            ext=files.name.split('.').pop();
            if(mid==1)
            {
              if(ext=="pdf")
              {
                setFileError("");
                setFileName(files.name);
                setUrl(e.target.files[0]);
              }
              else
              {
                setUrl(null);
                setFileError("File not in PDF format");
              }
            }

            else if(mid==2)
            {
              if(ext=="pptx")
              {
                setUrl(null);
                setFileError("Convert the PPT file to PDF format and upload for submission.");
              }
              else
              {
                setFileError("");
                setFileName(files.name);
                setUrl(e.target.files[0]);
              }
            }

            else
            { 
              setFileError("");
              setFileName(files.name);
              setUrl(e.target.files[0]);
            }            
            }
          }
          else 
        {
          setUrl(null);
          setFileError("File not uploaded");
        }
    };
      //   else
      //     setUrl(null);
      //     if(mid==="1")
      //     setFileError(`File Limit Exceeded, Upload a file of size less than ${size/1000}KB `);
      //     else
      //     setFileError(`File Limit Exceeded, Upload a file of size less than 1 GB`);
      // // } 
        

    async function submit()
    {
        setfileUploadLoading(true);
        let res;
          if ((url != null) & handleTitle(praTitle))
          {
            res = await uploadFile(
              url,
              user.course,
              user.year,
              user.department,
              user.section,
              location.state.subject,
              mid,
              location.state.rollno,
              praTitle,
              fileName
          );
      
          if (res == null)
          {
              setfileUploadLoading(false);
              setError(null);
              setshowDialog(true);
              setMid1NotSubmitted(true);
          }
          else
          {
              setfileUploadLoading(false);
              setError(res);
              setTimeout(() => {setError(null);}, 2000);
          }
          }
          else 
          {
              if (url == null)
            {
              setFileError("File not Uploaded");
            }
          }
          setfileUploadLoading(false);
    }

    async function getFile(val) 
    {
        setloadExisting(true);
        // console.log( user.course,user.year,user.department,
        //     user.section,"Computer Networks","1","18p61a0513@vbithyd.ac.in");
        try
        {
          console.log(val);
              const res = await getFileUploadDetails(location.state.rollno, location.state.subject, val);
              if (res.error == null) 
              {
                console.log(res.data.fileName, 10);
                  
                  setPraTitle(res.data.topic);  
                  setFileName(res.data.fileName) ;
                  setexistingFile(res.data.link);
                 
                  setloadExisting(false);
              }
              else
              {
                setPraTitle(res.data.topic)
                  setexistingFile(null);
                  setloadExisting(false);
                  setFileName(" ");
              }
        }
        catch (error)
        {
          setexistingFile(null);
          setloadExisting(false);      
        }
    }

    const [showDialog, setshowDialog] = useState(false);
    const [pageLoad, setPageLoad] = useState();
    const [pageLoadError, setPageLoadError] = useState();
    const [user, setUser] = useState();

    //select states
    const [mid, setMid] = useState("SELECT_MID");
    const [selectError, setSelectError] = useState(null);
  
    const [praError, setPraError] = useState();
    const [deadLineInfo, setDeadLineInfo] = useState(null);

    const [existingFile, setexistingFile] = useState(null);
    const [loadExisting, setloadExisting] = useState(false);

    async function midboolean (){
      const isMid1 = await fetchisMid1(location.state.course, location.state.year);
      const isMid2 = await fetchisMid2(location.state.course,location.state.year);
      console.log(location.state);
      setisMid1(isMid1);
      setisMid2(isMid2);
    }

    async function handleSelect(value)
    {
        setShowUploadModule(false);
        setError(null);
        setMid(value);
        if (value !== "SELECT_MID")
        {
            setSelectError(null);
            setLoading(true);
            const res = await getDeadLines(
              user.course,
              user.year,
              user.department,
              user.section,
              location.state.subject,
              value
            );
            if (res.error == null)
            {

                setShowUploadModule(true);
                setLoading(false);
                console.log(res.data);
                setDeadLineInfo(res.data);
               await getFile(value);
              
            } 
            else 
            {
           
                setLoading(false);
                setPraError(res.error.toString());
            }      
        }
        else
        {
            setLoading(false);
            setSelectError("select mid to continue");
        }
    }

    

    function dialogClose(x){
        setshowDialog(false);
        navigate("/student/subjectslist");
    }

    async function getUserData() {
        setPageLoad(true);
        // console.log("Getting User Data");
        const res = await getStudentData(location.state.rollno);
        // console.log("Got Response");
        if (res.error == null) {
        // console.log("If");
        console.log(res.document);
        setUser({
            course: res.document["course"],
            year: res.document["year"],
            department: res.document["department"],
            section: res.document["section"],
        });
        setPageLoad(false);
        setPageLoadError(null);
        // console.log("Ending");
    } 
    else
    {
        // console.log("Else");
        setPageLoadError(res.error);
        setPageLoad(false);
    }
  
  }

  const [editPRA, seteditPRA] = useState(false);
  useEffect(() => {getUserData();
    midboolean();
  }, []);

  return pageLoad ? (
    <LoadingScreen />
  ) : (
    <div >
      {
        pageLoadError === null ? (
        <div className={styles.uploadScreen}>
            <Navbar title={location.state.subject} backURL={'/student/subjectslist'}logout={false}></Navbar>
            {
              showDialog && <Dialog message={"Uploaded Successfully"} onOK={dialogClose} />
            }
            {/* <Download url={"https://images.pexels.com/photos/10757932/pexels-photo-10757932.png?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"} text="Download"/> */}
            <div className={styles.main}>
              <div id="selectMid">            
                  <select
                    className={styles.selectList}
                    value={mid}
                    onChange={(e) => handleSelect(e.target.value)}
                  >
                    <option className="option" value="SELECT_MID">Select MID</option> 
                    <option className="option" value="1">MID-1</option> 
                    <option className="option" disabled={!isMid2} value="2">MID-2</option>
                  </select>
                  {selectError && (
                    <p className={styles.errorField}>{selectError}</p>
                  )}
              </div>

              <div style={{ marginTop: "18px" }}>
                {loading && <Spinner radius={2} />}
              </div>

              {
                showUploadModule ? 
                (
                  loadExisting ? (
                    <div style={{ marginTop: "20px" }}>
                      <Spinner radius={2} />
                    </div>
                  ): 
                  existingFile != null && editPRA !== true && !isMid2 ? (
                  <div className={styles.editflex}>                    
                  {
                    deadLineInfo != null && 
                    <div  className={styles.instructions}><strong><u>INSTRUCTIONS:</u></strong>
                        <div>{deadLineInfo.instructions}</div>
                    </div>}
                    <p className={styles.pratitle}><strong style={{color:'#0E72AB'}}>Title :</strong> {praTitle}</p>
                    <p className={styles.fileName}><strong style={{color:'#0E72AB'}}>File Uploaded :</strong>{fileName}</p>
                   <button
                      onClick={() => seteditPRA(true)}
                      className={styles.editbutton}>
                      Edit PRA
                    </button>
                  </div>) :
                   (                  

                  <div className={styles.fileUploadModule}>
                  
                    <div className={styles.instructions}>
                     <strong><u>INSTRUCTIONS:</u></strong>
                      {
                        deadLineInfo != null && 
                        <div>{deadLineInfo.instructions}</div>
                      }
                    </div>
                {mid==1 ? (


                    <div >
                      
                      { (deadLineInfo != null && (new Date() < deadLineInfo.lastDate.toDate()))?                    
                      (
                        <div>
                      <p className="praInfo" style={{color:'#0E72AB', marginBottom:'10px', fontWeight:'500'}}>Upload an abstract for your PRA.(in <strong><u>PDF</u></strong> format only)</p>

                      <div>
                        <label className={styles.praLabel}>PRA Title:</label>
                        <input
                          size={30}
                          type="text"
                          placeholder="TITLE OF THE ACTIVITY"
                          className={styles.UploadinputStyle}
                          value={praTitle}
                          onChange={(e) => handleTitle(e.target.value)}
                          maxLength={50}                          
                        />
                        </div>
                      <p className={styles.titleErrorField}>{titleError}</p> </div> ):(
                       <div> 
                         <ul>
                        <li className="praInfo" style={{color:'#0E72AB', marginBottom:'10px', fontWeight:'500'}}>Upload an abstract for your PRA.(Maximum file size limit 200KB)</li>
                        <li className="praInfo" style={{color:'#0E72AB', marginBottom:'10px', fontWeight:'500'}}>Upload file in <strong><u>PDF</u></strong> format only.</li>
                        </ul>
                        <p className={styles.pratitle}><strong style={{color:'#0E72AB'}}>Title :</strong> {praTitle}</p>
                        <p className={styles.fileName}><strong style={{color:'#0E72AB'}}>File Uploaded :</strong>{fileName}</p>
                        <p className={styles.errorField} style={{alignItems:"center"}}>Deadline crossed. Cannot make any changes.</p>
                      </div>)
                      }
                    </div> 
                    ):
                    ( 
                    <div> 
                      <p className="praInfo" style={{color:'#0E72AB', marginBottom:'10px', fontWeight:'500',alignSelf:'center'}}>Upload proof of PRA (Maximum file size limit 1GB).</p>
                      
                        { (praTitle==="") ?
                        (<div>
                          console.log(praTitle);
                          <label className={styles.praLabel}>PRA Title:</label>
                          <input
                            size={30}
                            type="text"
                            placeholder="TITLE OF THE ACTIVITY"
                            className={styles.UploadinputStyle}
                            value={praTitle}
                            onChange={(e) => handleTitle(e.target.value)}
                            maxLength={50}                          
                          /> </div>
                        ):(
                          <div>
                             <p className={styles.pratitle}><strong style={{color:'#0E72AB'}}>Title :</strong> {praTitle}</p>
                          </div>
                        ) }                        
                      </div>)}
                    {deadLineInfo != null && (
                      <div>
                        {new Date() < deadLineInfo.lastDate.toDate() && (
                          <div className={styles.customflex}>
                            <div
                              className={styles.fileContainer}
                              style={{ marginBottom: "30px"}}
                            >
                              <label className={styles.customFileUpload}>
                                {mid === 1 ? (
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={onChange}
                                  />
                                ) : (
                                  <input type="file" onChange={onChange} />
                                  
                                )}
                                {fileName.length > 0 ? "Change File" : "Add File"}
                              </label>
                              {(fileError.length > 0 || fileName.length > 0) && (
                                <div style={{ width: "30px" }}></div>
                              )}
                              {fileError.length > 0 ? (
                                <p className={styles.errorField}>{fileError}</p>
                              ) : (
                                <p className={styles.praTitle}><strong style={{color:'#0E72AB'}}>File :</strong> {fileName}</p>
                              )}
                            </div>
                            <Button
                              className={
                              styles.uploadbutton
                              }
                              onClick={() => {submit();}}
                              disabled={fileError || titleError||fileName==null||praTitle==null}
                            >
                            <i className="fas fa-upload"></i>
                              Upload
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {error && (
                      <div>
                        <p className={styles.errorField}>{error}</p>
                      </div>
                    )}
                  </div>
                )
              ) 
                :praError?(<div>{praError}</div>):null
              }

              <div style={{ marginTop: "18px" }}>
                {fileUploadLoading && <Spinner radius={2} />}
              </div>

            </div>
          </div>
          ) 
          : 
          <div>{pageLoadError}</div>
      }
    </div>
  );
};

export default Upload;

//TODO
// change email
// change useLocation
//   <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
//                 <div className="mt4" style={{ height: '120px', padding:'0px',width:'80px', margin:'0px' }}>
//                 {
//                     res!=null?
//                     <Viewer fileUrl={res} />:
//                     <p>forferge</p>
//                 }
//                 </div>
//             </Worker>

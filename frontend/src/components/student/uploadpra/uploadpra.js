import React, { useState, useEffect } from "react";
import styles from "./uploadpra.module.css";
import Button from "../../global_ui/buttons/button";
import Navbar from "../../global_ui/navbar/navbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { getUploadedFile, uploadFile } from "../services/storageServices";
import { LoadingScreen, Spinner } from "../../global_ui/spinner/spinner";
import Dialog from "../../global_ui/dialog/dialog";
import { useNavigate } from "react-router-dom";
import {
  getDeadLines,
  getFileUploadDetails,
  getStudentData,
} from "../services/studentServices";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const Upload = () => {
  let location = useLocation();
  const [subject, setSubject] = useState("");

  const [loading, setLoading] = useState(false);
  const [showUploadModule, setShowUploadModule] = useState(false);
  const [error, setError] = useState(null);
  //error for deadlines
  const [praTitle, setPraTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [url, setUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [fileUploadLoading, setfileUploadLoading] = useState(false);
  // DATA FROM THE PREVIOUS SCREEN
  console.log(location.state.rollno);
  console.log(location.state.subject);

  function handleTitle(e) {
    let value = e;
    setPraTitle(value);
    if (value.length < 8) {
      setTitleError("Title must have atleast 8 characters");
      return false;
    } else {
      setTitleError("");
      return true;
    }
  }

  const onChange = (e) => {
    let files = e.target.files[0];
    let size = 200000;
    if (mid === "1") {
      size = 200000;
    } else if (mid === "2") {
      size = 1048576000;
    }
    if (files.size > size) {
      setUrl(null);
      setFileError("File Limit Exceeded");
    } else {
      setFileError("");
      setFileName(files.name);
      setUrl(e.target.files[0]);
    }
  };

  async function submit() {
    setfileUploadLoading(true);
    let res;
    if ((url != null) & handleTitle(praTitle)) {
      res = await uploadFile(
        url,
        user.course,
        user.year,
        user.department,
        user.section,
        location.state.subject,
        mid,
        location.state.rollno,
        praTitle
      );
      if (res == null) {
        setfileUploadLoading(false);
        setError(null);
        setshowDialog(true);
      } else {
        setfileUploadLoading(false);
        setError(res);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } else {
      if (url == null) {
        setFileError("File not Uploaded");
      }
    }
    setfileUploadLoading(false);
  }

  async function getFile(val) {
    setloadExisting(true);
    // console.log( user.course,user.year,user.department,
    //     user.section,"Computer Networks","1","18p61a0513@vbithyd.ac.in");
    try {
      // console.log("wfoifihofhirfihf");
      const res = await getFileUploadDetails(
        location.state.rollno,
        location.state.subject,
        val
      );
      // console.log(res,"fnowennvnenvvn");
      // const res = await getUploadedFile(
      //     user.course,user.year,user.department,
      //     user.section,subject,val,"18p61a0513@vbithyd.ac.in"
      // );
      // console.log(res.url,10101001010);
      // console.log(res);
      if (res.error == null) {
        setPraTitle(res.data.topic);
        console.log("Iron Man");
        setexistingFile(res.data.link);
        setloadExisting(false);
      } else {
        setexistingFile(null);
        setloadExisting(false);
      }
    } catch (error) {
      setexistingFile(null);
      setloadExisting(false);
      console.log(error);
    }
  }

  const [showDialog, setshowDialog] = useState(false);
  const { currentUser } = useAuth();
  let navigate = useNavigate();

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




  async function handleSelect(value) {
    setShowUploadModule(false);
    setError(null);
    setMid(value);
    if (value !== "SELECT_MID") {
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
      console.log(res);
      if (res.error == null) {
        console.log("If");
        setShowUploadModule(true);
        setLoading(false);
        setDeadLineInfo(res.data);
        console.log("Abcd");
        await getFile(value);
        console.log("dhdh");
        //dead line logic
        console.log(res.data);
      } else {
        console.log("Else");
        setLoading(false);
        setPraError(res.error.toString());
      }
      console.log("Ended");
    } else {
      setLoading(false);
      setSelectError("select mid number to continue");
    }
  }

  function dialogClose(x) {
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
    } else {
      // console.log("Else");
      setPageLoadError(res.error);
      setPageLoad(false);
    }
    console.log("Intialized");
  }

  const [editPRA, seteditPRA] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  return pageLoad ? (
    <LoadingScreen />
  ) : (
    <div>
      {pageLoadError === null ? (
        <div>
          <Navbar title={location.state.subject} backURL={'/student/subjectslist'} logout={true}></Navbar>
          {showDialog && (
            <Dialog message={"Upload Successful"} onOK={dialogClose} />
          )}
          <div className={styles.main}>
            <div>
            
                <select
                className={styles.selectList}
                value={mid}
                onChange={(e) => handleSelect(e.target.value)}
              >
                <option className="option" value="SELECT_MID">Select MID</option> 
                <option className="option" value="1">MID-1</option> 
                <option className="option" value="2">MID-2</option>
              </select>
              {selectError && (
                <p className={styles.errorField}>{selectError}</p>
              )}
            </div>
            <div style={{ marginTop: "18px" }}>
              {loading && <Spinner radius={2} />}
            </div>

            {showUploadModule ? (
              loadExisting ? (
                <div style={{ marginTop: "20px" }}>
                  <Spinner radius={2} />
                </div>
              ) : existingFile != null && editPRA !== true ? (
                <div className={styles.editflex}>
                {deadLineInfo != null && <p className={styles.instructions}>Instructions : {deadLineInfo.instructions}</p>}
                  <p className={styles.pratitle}>Title : {praTitle}</p>
                  <p className={styles.fileName}>{fileName}</p>
                  <button
                    onClick={() => seteditPRA(true)}
                    className={styles.editbutton}
                    
                  >
                    Edit PRA
                  </button>
                </div>
              ) : (
                <div className={styles.fileUploadModule}>
                
                  <div
                    className={styles.instructions}
                    style={{ alignSelf: "center" }}
                  >
                    {deadLineInfo != null && <p>Instructions : {deadLineInfo.instructions}</p>}
                  </div>
{mid==1 ? (

                  <div>
                    <label className={styles.praLabel}>PRA Title : </label>
                    <input
                  
                      type="text"
                      placeholder="TITLE OF THE ACTIVITY"
                      className={styles.UploadinputStyle}
                      value={praTitle}
                      onChange={(e) => handleTitle(e.target.value)}
                      maxLength={50}
                    />
                    <p className={styles.errorField}>{titleError}</p>
                  </div>
):( <p className={styles.pratitle}>Title : {praTitle}</p>)}
                  {deadLineInfo != null && (
                    <div>
                      {new Date() < deadLineInfo.lastDate.toDate() && (
                        <div className={styles.customflex}>
                          <div
                            className={styles.fileContainer}
                            style={{ marginBottom: "30px" }}
                          >
                            <label className={styles.customFileUpload}>
                              {mid === 1 ? (
                                <input
                                  type="file"
                                  accept=".pdf"
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
                              <p className={styles.fileName}>{fileName}</p>
                            )}
                          </div>
                          <Button
                            className={
                             styles.uploadbutton
                            }
                            onClick={() => {
                              submit();
                            }}
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
            ) : praError ? (
              <div>{praError}</div>
            ) : null}

            <div style={{ marginTop: "18px" }}>
              {fileUploadLoading && <Spinner radius={2} />}
            </div>
          </div>
        </div>
      ) : (
        <div>{pageLoadError}</div>
      )}
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

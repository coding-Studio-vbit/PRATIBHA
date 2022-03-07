import React, { useState, useEffect } from "react";
import styles from "./uploadpra.module.css";

import cx from "classnames";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../global_ui/navbar/navbar";
import { uploadFile } from "../services/storageServices";
import { LoadingScreen, Spinner } from "../../global_ui/spinner/spinner";
import Dialog from "../../global_ui/dialog/dialog";
import { useNavigate } from "react-router-dom";
import {
  getDeadLines,
  getFileUploadDetails,
  getStudentData,
} from "../services/studentServices";
import { useLocation } from "react-router-dom";
import { fetchisMid1, fetchisMid2 } from "../services/studentServices";
import Download from "../../global_ui/download/download";

const Upload = () => {
  //DATA FROM THE PREVIOUS SCREEN
  let location = useLocation();
  const [isMid1, setisMid1] = useState(false);
  const [isMid2, setisMid2] = useState(false);
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

  const { currentUser } = useAuth();

  function handleTitle(e) {
    let value = e;
    setPraTitle(value);
    if (value == null) {
      setTitleError("Title must have atleast 8 characters");
      return false;
    } else if (value.length < 8) {
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
    if (mid == "2") {
      size = 1048576000;
    }
    if (files != null) {

        let ext;
        ext = files.name.split(".").pop();
        if (mid == 1) {
          //DONT CHANGE == to === plis
          if (ext == "pdf") {
            if (files.size > size) {
              setUrl(null);
              setFileError("File size limit exceeded");
            } 
            else{

              setFileError("");
              setFileName(files.name);
              setUrl(e.target.files[0]);
            }
          } else {
            setUrl(null);
            setFileError("File not in PDF format");
          }
        } else if (mid == 2) {
        
            //DONT CHANGE == to === plis
         if (ext == "pptx") {
            setUrl(null);
            setFileError("Convert PPT to PDF format for submission");
          } else if (
            ext !== "pdf" &&
            ext !== "jpeg" &&
            ext !== "jfif" &&
            ext !== "jpg" &&
            ext !== "png" &&
            ext !== "mp4" &&
            ext !== "avi" &&
            ext !== "mov" &&
            ext !== "m4v"
          ) {
            setUrl(null);
            setFileError(
              `${ext} file extension is not supported. Convert into another format and submit again.`
            );
          } else   if (files.size > size) {
            setUrl(null);
            setFileError("File size limit exceeded");
          }
          else {
            setFileError("");
            setFileName(files.name);
            setUrl(e.target.files[0]);
          }
        } else {
          //why this else?
          setFileError("");
          setFileName(files.name);
          setUrl(e.target.files[0]);
        }
      
    } else {
      setUrl(null);
      setFileError("File not uploaded");
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
        user.regulation,
        user.department,
        user.section,
        location.state.subject,
        mid,
        location.state.rollno,
        praTitle,
        fileName
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
    try {
      let res;
      if (val === "1") {
        res = await getFileUploadDetails(
          location.state.rollno,
          location.state.subject,
          val
        );
      } else {
        res = await getFileUploadDetails(
          location.state.rollno,
          location.state.subject,
          val
        );
        const mid1Res = await getFileUploadDetails(
          location.state.rollno,
          location.state.subject,
          "1"
        );
        if (mid1Res.error == null) {
          setMid1NotSubmitted(false);
        } else {
          setMid1NotSubmitted(true);
        }
      }
      if (res.error == null) {
        setPraTitle(res.data.topic);
        setFileName(res.data.fileName);
        setexistingFile(res.data.link);
        setloadExisting(false);
      } else {
        if (res.data.topic != null) {
          setPraTitle(res.data.topic);
        }
        setexistingFile(null);
        setloadExisting(false);
        setFileName(" ");
      }
    } catch (error) {
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

  async function midboolean() {
    const isMid1 = await fetchisMid1(
      location.state.course,
      location.state.year
    );
    const isMid2 = await fetchisMid2(
      location.state.course,
      location.state.year
    );
    setisMid1(isMid1);
    setisMid2(isMid2);
  }

  async function handleSelect(value) {
    setPraTitle("");
    setFileName("");
    setShowUploadModule(false);
    setError(null);
    setMid(value);

    if (value !== "SELECT_MID") {
      setSelectError(null);
      setLoading(true);
      const res = await getDeadLines(
        user.course,
        user.year,
        user.regulation,
        user.department,
        user.section,
        location.state.subject,
        value
      );
      if (res.error == null) {
        setShowUploadModule(true);
        setLoading(false);
        setDeadLineInfo(res.data);
        await getFile(value);
      } else {
        setLoading(false);
        setPraError(res.error.toString());
      }
    } else {
      setLoading(false);
      setSelectError("select mid to continue");
    }
  }

  function dialogClose(x) {
    setshowDialog(false);
    navigate("/student/subjectslist");
  }

  async function getUserData() {
    setPageLoad(true);
    const res = await getStudentData(location.state.rollno);
    if (res.error == null) {
      setUser({
        course: res.document["course"],
        year: res.document["year"],
        department: res.document["department"],
        section: res.document["section"],
        regulation: res.document["regulation"],
      });
      setPageLoad(false);
      setPageLoadError(null);
    } else {
      console.log(res.error);
      setPageLoadError(res.error);
      setPageLoad(false);
    }
  }

  const [editPRA, seteditPRA] = useState(false);
  useEffect(() => {
    getUserData();
    midboolean();
  }, []);

  return pageLoad ? (
    <LoadingScreen />
  ) : (
    <div>
      {pageLoadError === null ? (
        <div className={styles.uploadScreen}>
          <Navbar
            title={location.state.subject}
            backURL={"/student/subjectslist"}
            logout={false}
          ></Navbar>

          {showDialog && (
            <Dialog message={"Uploaded Successfully"} onOK={dialogClose} />
          )}

          <div className={styles.main}>
            <div id="selectMid">
              <select
                className={styles.selectList}
                value={mid}
                onChange={(e) => handleSelect(e.target.value)}
              >
                <option className="option" value="SELECT_MID">
                  Select MID
                </option>
                 
                <option className="option" value="1">
                  MID-1
                </option>
                 
                <option className="option" disabled={!isMid2} value="2">
                  MID-2
                </option>
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
              ) : existingFile != null && editPRA !== true && !isMid2 ? (
                <div className={styles.editflex}>
                  {deadLineInfo != null && (
                    <div className={styles.instructions}>
                      <strong>
                        <u>INSTRUCTIONS:</u>
                      </strong>
                      <div>{deadLineInfo.instructions}</div>
                    </div>
                  )}
                  <p className={styles.fileName}>
                    <strong style={{ color: "#0E72AB" }}>Title :</strong>{" "}
                    {praTitle}
                  </p>
                  <p className={styles.fileName}>
                    <strong style={{ color: "#0E72AB" }}>
                      File Uploaded :
                    </strong>
                    {fileName}
                    {/* <Download isIcon={true} url={existingFile} userID={currentUser.email.slice(0,10)}/> */}
                    <p className={styles.downloadBtn} style={{ margin: "0%" }}>
                      <Download
                        isIcon={true}
                        url={existingFile}
                        userID={currentUser.email.slice(0, 10)}
                      />
                    </p>
                  </p>
                  <button
                    onClick={() => seteditPRA(true)}
                    className={styles.editbutton}
                  >
                    Edit PRA
                  </button>
                </div>
              ) : (
                <div className={styles.fileUploadModule}>
                  <div className={styles.instructions}>
                    <strong style={{ fontSize: "20px", marginTop: "20px" }}>
                      <u>INSTRUCTIONS:</u>
                    </strong>

                    {deadLineInfo != null && (
                      <div>{deadLineInfo.instructions}</div>
                    )}
                  </div>
                  {mid == 1 ? (
                    <div>
                      {deadLineInfo != null &&
                      new Date() < deadLineInfo.lastDate.toDate() ? (
                        <div>
                          <ul className={styles.praInfo}>
                            <li
                              style={{
                                color: "#0E72AB",
                                marginBottom: "10px",
                                fontWeight: "500",
                              }}
                            >
                              Upload an abstract for your PRA.(Maximum file size
                              limit <strong>200KB</strong> )
                            </li>
                            <li
                              style={{
                                color: "#0E72AB",
                                marginBottom: "10px",
                                fontWeight: "500",
                              }}
                            >
                              Upload file in <strong>PDF</strong> format only.
                            </li>
                          </ul>

                          <div>
                            <label className={styles.praLabel}>PRA Title</label>
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
                          <p className={styles.titleErrorField}>{titleError}</p>
                        </div>
                      ) : (
                        <div>
                          <p className={styles.fileName}>
                            <strong style={{ color: "#0E72AB" }}>
                              Title :
                            </strong>{" "}
                            {praTitle}
                          </p>

                          <p className={styles.fileName}>
                            <strong style={{ color: "#0E72AB" }}>
                              File Uploaded :
                            </strong>
                            {fileName}
                            {(fileName !== "" || praTitle !== "") && (
                              <div>
                                <span
                                  className={styles.downloadBtn}
                                  style={{ margin: "0%", alignSelf: "center" }}
                                >
                                  <Download
                                    isIcon={true}
                                    url={existingFile}
                                    userID={currentUser.email.slice(0, 10)}
                                  />
                                </span>
                              </div>
                            )}
                            {/* <Download isIcon={true} url={existingFile} userID={currentUser.email.slice(0,10)}/> */}
                          </p>
                          <p
                            className={styles.errorField}
                            style={{ alignItems: "center" }}
                          >
                            Deadline Exceeeded.Cannot make any changes for Mid-1
                            submissions.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className={styles.praInfo}>
                        Upload proof of PRA (Maximum file size : 1GB).
                      </p>
                      <div>
                        {deadLineInfo != null &&
                        new Date() < deadLineInfo.lastDate.toDate() ? (
                          <div>
                            {mid1NotSubmitted ? (
                              <div>
                                <label className={styles.praLabel}>
                                  PRA Title{" "}
                                </label>
                                <input
                                  size={30}
                                  type="text"
                                  placeholder="TITLE OF THE ACTIVITY"
                                  className={styles.UploadinputStyle}
                                  value={praTitle}
                                  onChange={(e) => handleTitle(e.target.value)}
                                  maxLength={50}
                                />
                                <div>
                                  <p className={styles.titleErrorField}>
                                    {titleError}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className={styles.pratitle}>
                                  <strong style={{ color: "#0E72AB" }}>
                                    Title :
                                  </strong>{" "}
                                  {praTitle}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {/* Deadline crossed message  */}
                            <p className={styles.pratitle}>
                              <strong style={{ color: "#0E72AB" }}>
                                Title :
                              </strong>{" "}
                              {praTitle}
                            </p>
                            <p className={styles.fileName}>
                              <strong style={{ color: "#0E72AB" }}>
                                File Uploaded :
                              </strong>
                              {fileName}
                              <p
                                className={styles.downloadBtn}
                                style={{ margin: "0%", alignSelf: "center" }}
                              >
                                <Download
                                  isIcon={true}
                                  url={existingFile}
                                  userID={currentUser.email.slice(0, 10)}
                                />
                              </p>
                            </p>

                            <p
                              className={styles.errorField}
                              style={{ alignItems: "center" }}
                            >
                              Deadline crossed. Cannot make any changes for
                              Mid-2 submissions.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                            ) : fileName.length > 0 ? (
                              <p
                                className={cx(
                                  styles.fileName,
                                  styles.fileUploadView
                                )}
                              >
                                <i class="far fa-file"></i>

                                <strong style={{ color: "#0E72AB" }}></strong>
                                {fileName}
                              </p>
                            ) : (
                              <p></p>
                            )}
                          </div>
                          <button
                            className={styles.uploadbutton}
                            onClick={() => {
                              submit();
                            }}
                            disabled={
                              fileError ||
                              titleError ||
                              fileName == null ||
                              praTitle == null
                            }
                          >
                            Upload
                            <i
                              className="fas fa-upload"
                              style={{ marginLeft: "14px" }}
                            ></i>
                          </button>
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

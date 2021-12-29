import * as React from "react";
import "./grading.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Docviewer from "./docviewer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { LoadingScreen } from "../../global_ui/spinner/spinner";
import { getUploadedFileByPath } from "../../student/services/storageServices";
import { getMarks,postMarks } from "../services/facultyServices";
import { useAuth } from "../../context/AuthContext";
import Dialog from "../../global_ui/dialog/dialog";
import { db } from "../../../firebase";

const Grading = () => {
  //  let location = useLocation();
  let location = {
    state:{
      path:"BTech/3/CSE/D/Computer Networks/1/18p61a0513",
      className:"BTech_1_CSB_A_Mathematics1"
    }
  }

   const {currentUser} = useAuth();
   let navigate =useNavigate();

   const [subject, setSubject] = useState("Computer Networks");
   const [rollNo, setRollNo] = React.useState('18p61a0513');

   const [pageLoading, setPageLoading] = React.useState();
   const [pageLoadError, setPageLoadError] = React.useState();
   
   const [innovation1 , setInnovation1] = React.useState()
   const [subRel1 , setSubRel1] = React.useState()
   const [individuality1 , setIndividuality1] = React.useState()
   const [preparation1 , setPreparation1] = React.useState()
   const [presentation1 , setPresentation1] = React.useState()
   const [innovation2 , setInnovation2] = React.useState()
   const [subRel2 , setSubRel2] = React.useState()
   const [individuality2 , setIndividuality2] = React.useState()
   const [preparation2 , setPreparation2] = React.useState()
   const [presentation2 , setPresentation2] = React.useState();

   const [remarks, setRemarks] = useState();

  async function updateMarks(){
    let marks={};
    if(midNo==="1"){
      marks.Individuality1=parseInt(individuality1);
      marks.Innovation1=parseInt(innovation1);
      marks.Preparation1=parseInt(preparation1);
      marks.Presentation1=parseInt(presentation1);
      marks.Subject_Relevance1=parseInt(subRel1);

    }else{
      marks.Individuality2=parseInt(individuality2);
      marks.Innovation2=parseInt(innovation2);
      marks.Preparation2=parseInt(preparation2);
      marks.Presentation2=parseInt(presentation2);
      marks.Subject_Relevance2=parseInt(subRel2);
    }
    
    const res = await postMarks('cse@vbithyd.ac.in','BTech_2_CSE_D_DAA','19p61a05i2',midNo,marks,remarks); 
    if(res==null){
      setSetDialog(`${midNo} Marks Updated Successfully`);
    }else{
      setSetDialog(null);
    }
  }

  const [userDetails, setUserDetails] = useState('')

  async function searchRoll() {
    console.log("Calling");
    let value= setRollNo;
    
    db.collection('users').doc(value).get()
        .then(snapshot => setUserDetails(snapshot.data()))  
  }

    const [midNo,setMid] = React.useState("1");
    const [url, setUrl] = React.useState(null);
    

    
   


    const [setDialog, setSetDialog] = useState();

    async function getUserData() {
      setPageLoading(true);                

      console.log("getting marks");
      const response = await getMarks(
        "vsridharreddy@vbithyd.ac.in",location.state.className,rollNo

        // currentUser.email,location.state.className,rollNo
      );

      console.log("got marks");

      if(response.error==null){
           setIndividuality1(response.data["mid1"]["Individuality1"]);
           setIndividuality2(response.data["mid2"]["Individuality2"]);

           setInnovation1(response.data["mid1"]["Innovation1"]);
           setInnovation2(response.data["mid2"]["Innovation2"]);

          setPreparation1(response.data["mid1"]["Preparation1"]);
          setPreparation2(response.data["mid2"]["Preparation2"]);

          setPresentation1(response.data["mid1"]["Presentation1"]);
          setPresentation2(response.data["mid2"]["Presentation2"]);

          setSubRel1(response.data["mid1"]["Subject_Relevance1"]);
          setSubRel2(response.data["mid2"]["Subject_Relevance2"]);
      }

      console.log("getting file");     

      const res = await getUploadedFileByPath(
        location.state.path
      );
      
      console.log("got file");

      if(res.error==null){
        setUrl(res.url);     
      }
      else{
        setUrl(null);
      }      
      setPageLoading(false);
      if(res.error!=null && response.error!=null){
        console.log(res.error,response.error);
        setPageLoadError("Error in Fetching details");
      }       
    }

    const [val, setVal] = useState();

  useEffect(() => {        
    getUserData()  
  },[])

  return (!pageLoading)? (         
    pageLoadError==null?
    <div className="grading">
      {
        setDialog!=null && <Dialog message={setDialog} onOK={()=>navigate('/')}/>
      }

      <div className="left">

        {/* <i style={{
              position:'absolute',
              left:'16px',
              top:'16px',
              cursor:'pointer'
            }} className="fas fa-arrow-left"  onClick={()=>navigate('/faculty/studentlist')}>
        </i> */}

        <h3 style={{ textAlign: "center" }}>Student Details</h3>

        <div className="details">

            <div style={{
                display:'flex',
                gap:'8px',
                alignItems:'center'
              }}>
              <span>Roll no:</span>
                <div>
                    <input type="text" maxLength={10}  value={rollNo} onChange={(e)=>setRollNo(e.target.value)}></input>
                    <button className="searchBtn" onClick={searchRoll} >
                        <i style={{cursor:'pointer'}} class="fa fa-search" ></i>
                    </button>
                </div>
            </div>
          
            <div style={{
                  display:'flex',
                  gap:8,
                  padding:'8px 8px 0px 8px',
                }}><span>Subject:</span>
              <span style={{fontWeight:'bold'}}>{subject}</span>
            </div>

        </div>         
       
        <div className="mid1">
            <div>
                <span>Innovation:(2M)</span>
                <input  className="inputStyle" type="number" maxLength={1} 
                value={innovation1} onChange={(e)=>{
                  if(e.target.value<3 && e.target.value>-1){
                    setInnovation1(e.target.value)
                  }else{
                    setInnovation1(2)
                  }
                }}
                />
            </div>
            <div>
                <span>Subject Relevance:(2M)</span>
                <input  className="inputStyle"  type="number" maxLength={1} 
                  value={subRel1} onChange={(e)=>{
                    if(e.target.value<3 && e.target.value>-1){
                      setSubRel1(e.target.value)
                    }else{
                      setSubRel1(2)
                    }
                  }}
                />
            </div>
          <div>
              <span>Individuality:(2M)</span>
              <input  className="inputStyle" type="number" maxLength={1} 
              value={individuality1} onChange={(e)=>{
                if(e.target.value<3 && e.target.value>-1){
                  setIndividuality1(e.target.value)
                }else{
                  setIndividuality1(2)
                }
              }}/>
          </div>
          <div>
              <span>Preparation:(2M)</span>
              <input  className="inputStyle" type="number" maxLength={1}  
              value={preparation1} onChange={(e)=>{
                if(e.target.value<3 && e.target.value>-1){
                  setPreparation1(e.target.value)
                }else{
                  setPreparation1(2)
                }
              }}
              />
          </div>
          <div>
              <span>Presentation:(2M)</span>
              <input className="inputStyle"  type="number" maxLength={1}  
                value={presentation1} onChange={(e)=>{
                  if(e.target.value<3 && e.target.value>-1){
                    setPresentation1(e.target.value)
                  }else{
                    setPresentation1(2)
                  }
                }}
              />
          </div>          
          <div style={{marginTop:'4%', justifyContent: "space-between", marginRight:'3px', fontWeight:'bolder'}}>
              <span>MID-I: 10M</span>
              <span style={{backgroundColor:'#E5E4E2', color:'black', width:'40px', padding:'3px', height:'20px', textAlign:'center', borderRadius:'10px'}}>
                {(parseInt(individuality1)+parseInt(subRel1)+parseInt(innovation1)+parseInt(preparation1)+parseInt(presentation1))?
                (parseInt(individuality1)+parseInt(subRel1)+parseInt(innovation1)+parseInt(preparation1)+parseInt(presentation1)):" "
                }
              </span>
          </div>
        </div>

        {
          midNo==="2" &&        
          <div className="mid2">
              <div>               
                <span>Innovation:(2M)</span>
                <input className="inputStyle" type="number" maxLength={1} 
                  value={innovation2} onChange={(e)=>{
                    if(e.target.value<3 && e.target.value>-1){
                      setInnovation2(e.target.value)
                    }else{
                      setInnovation2(2)
                    }
                  }}
                />
              </div>

              <div>
                <span>Subject Relevance:(2M)</span>
                <input className="inputStyle"  type="number" maxLength={1} 
                  value={subRel2} onChange={(e)=>{
                    if(e.target.value<3 && e.target.value>-1){
                      setSubRel2(e.target.value)
                    }else{
                      setSubRel2(2)
                    }
                  }}/>
              </div>

              <div>
                <span>Individuality:(2M)</span>
                <input className="inputStyle"  type="number" maxLength={1} 
                  value={individuality2} onChange={(e)=>{
                    if(e.target.value<3 && e.target.value>-1){
                      setIndividuality2(e.target.value)
                    }else{
                      setIndividuality2(2)
                    }
                  }}
                />
              </div>

              <div>
                <span>Preparation:(2M)</span>
                <input className="inputStyle"  type="number" maxLength={1} 
                  value={preparation2} onChange={(e)=>{
                    if(e.target.value<3 && e.target.value>-1){
                      setPreparation2(e.target.value)
                    }else{
                      setPreparation2(2)
                    }
                  }}/>
              </div>

              <div>
                <span>Presentation:(2M)</span>
                <input className="inputStyle"  type="number" maxLength={1}
                  value={presentation2} onChange={(e)=>{
                    if(e.target.value<3 && e.target.value>-1){
                      setPresentation2(e.target.value)
                    }else{
                      setPresentation2(2)
                    }
                  }}/>
              </div>

              <div style={{marginTop:'4%', justifyContent: "space-between", marginRight:'3px', fontWeight:'bolder'}}>
                <span >MID-II:(10M)</span>
                <span style={{backgroundColor:'#E5E4E2', color:'black', width:'40px', padding:'3px',height:'20px', textAlign:'center', borderRadius:'10px'}}> 
                {(parseInt(individuality2)+parseInt(subRel2)+parseInt(innovation2)+parseInt(preparation2)+parseInt(presentation2))?
                  (parseInt(individuality2)+parseInt(subRel2)+parseInt(innovation2)+parseInt(preparation2)+parseInt(presentation2)):" "
                  }
                </span>
              </div>
          </div>
        }
        {/* <div className="footer">
          <i class="fas fa-chevron-circle-left fa-2x" style={{ cursor: "pointer" }} onClick={Save}></i>
          <i class="fas fa-chevron-circle-right fa-2x" style={{ cursor: "pointer" }} onClick={Save}></i>
        </div> */}
      </div> 

      <div className="right">
          <div className="preview" style={{ display: "grid", gridTemplateColumns: "0.3fr 0.3fr 0.3fr" }}> 

              <span style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: "16px",
                  gridArea: "title",
                  alignSelf: "center",
                }}>PREVIEW
              </span>

              <div className="dropdown" style={{
                  alignSelf: "end",
                  padding: "16px",
                  justifySelf: "end",
                }}>
                  <i className="fa fa-angle-down dropdown-i" aria-hidden="true"></i>                  
                  <select
                    style={{
                      width: "200px",
                      padding: "8px",
                      borderRadius: "24px",
                      marginRight: "12px",
                    }}
                    value={midNo}
                    onChange={
                      (e)=>setMid(e.target.value)
                    }
                    name="selectList"
                    id="selectList">
                    <option value="1">MID-I</option> 
                    <option value="2">MID-II</option>
                  </select>
              </div>

              <div className="display">
                {
                  (midNo==="1") &&                   
                    url!==null?
                    <Docviewer extension="pdf" object={url}/>:" "
                }
                {
                  (midNo==="2") &&                   
                  url!==null?
                  <Docviewer extension="pptx" object={url}/>:" "
                }                   
              </div>

              <div className="remarksCon">
                <span className="remarks-title">REMARKS</span>
                <textarea 
                value={remarks}
                onChange={(e)=>setRemarks(e.target.value)}
                rows={3} className="remarks" style={{ resize: "none", backgroundColor:"#bbe8ff", opacity:"0.7"}} />
                <button
                  style={{
                    backgroundColor: "#0e72ab",
                    color: "white",      
                    margin: "auto",
                    padding: "8px 16px",
                    cursor:'pointer',
                    borderRadius: 25,
                    textAlign: "center",
                    border: "none",
                  }}
                  onClick={()=>updateMarks()}
                >
                  SAVE
                </button>
              </div>
          </div>
      </div>
    </div>: 
    <div>{pageLoadError}</div>
  ): 
  <LoadingScreen />
};

export default Grading;

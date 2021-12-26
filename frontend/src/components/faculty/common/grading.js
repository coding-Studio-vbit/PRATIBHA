import * as React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import styles from "./grading.css";
import Button from "../../global_ui/buttons/button";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import Docviewer from "./docviewer";
import Dialog from "../../global_ui/dialog/dialog";



const Grading = () => {
   const [url, setUrl] = React.useState('');
   const [loading, setLoading] = React.useState(false); 
   const [rollNo, setRollNo] = React.useState('');
   const [isMid1 , setIsMid1] = React.useState(true)
   const [innovation1 , setInnovation1] = React.useState('')
   const [subRel1 , setSubRel1] = React.useState('')
   const [individuality1 , setIndividuality1] = React.useState()
   const [preparation1 , setPreparation1] = React.useState()
   const [presentation1 , setPresentation1] = React.useState()
   const [innovation2 , setInnovation2] = React.useState()
   const [subRel2 , setSubRel2] = React.useState()
   const [individuality2 , setIndividuality2] = React.useState()
   const [preparation2 , setPreparation2] = React.useState()
   const [presentation2 , setPresentation2] = React.useState()
  const data=
    {
      NAME:"Mahita",
      SUBJECT:"DM"
    }
  ;
   const searchRoll=()=>{
     if(rollNo.length===10 )
     {
       setLoading(true)
       //http request 
       setLoading(false)
     }

     else
     {
       
     }
   }

  function Save () {
    //save values
    
  } 

        function onChange (e)  {
          const files = e.target.files;
          files.length > 0 && setUrl(URL.createObjectURL(files[0]));
      };

  return (
    
    <div className="grading">
      <div className="left">
        <i style={{
            position:'absolute',
            left:'16px',
            top:'16px',
            
        }} className="fas fa-arrow-left black" aria-hidden="true"></i>
        <h3 style={{ textAlign: "center" }}>Student Details</h3>
        <div className="details">
          <div style={{
            display:'flex',
            gap:'8px',
            alignItems:'center'
          }} >
          <span>Roll no:</span>
          <div>
          <input type="text" maxLength={10} value={rollNo} onChange={(e)=>setRollNo(e.target.value)}></input>
          <i style={{cursor:'pointer'}} onClick={searchRoll} class="fa fa-search" ></i>
          </div>
          </div>
          
          <div>
          <div style={{
            display:'flex',
            gap:8,
            padding:'8px 8px 0px 8px',
          }} ><span>Name :</span>
            <span style={{fontWeight:'bold'}}>{data.NAME} </span>
          </div>
          </div>
          <div>
          <div style={{
            display:'flex',
            gap:8,
            padding:'8px 8px 0px 8px',
          }} ><span>Subject:</span>
            <span style={{fontWeight:'bold'}}>{data.SUBJECT}</span>
          </div>
          </div>
          </div>
          
        
        <div className="mid1">
          <div>
            <span>Innovation:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              
              type="text"
              maxLength={1} value={innovation1} onChange={(e)=>setInnovation1(e.target.value)}
              
            />
          </div>
          <div>
            <span>Subject Relevance:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              type="text"
              maxLength={1} value={subRel1} onChange={(e)=>setSubRel1(e.target.value)}
            />
          </div>
          <div>
            <span>Individuality:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              type="text"
              maxLength={1} value={individuality1} onChange={(e)=>setIndividuality1(e.target.value)}
            />
          </div>
          <div>
            <span>Preparation:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              type="text"
              maxLength={1} value={preparation1} onChange={(e)=>setPreparation1(e.target.value)}
            />
          </div>
          <div>
            <span>Presentation:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              type="text"
              maxLength={1} value={presentation1} onChange={(e)=>setPresentation1(e.target.value)}
            />
          </div>          
          <div style={{marginTop:'4%', justifyContent: "space-between", marginRight:'3px', fontWeight:'bolder'}}>
            <span >MID-I:(10M) </span>
            <span style={{backgroundColor:'#E5E4E2', color:'black', width:'40px', padding:'3px', height:'20px', textAlign:'center', borderRadius:'10px'}}>
               {(parseInt(individuality1)+parseInt(subRel1)+parseInt(innovation1)+parseInt(preparation1)+parseInt(presentation1))?

              (parseInt(individuality1)+parseInt(subRel1)+parseInt(innovation1)+parseInt(preparation1)+parseInt(presentation1)):" "
               }
               </span>

          </div>
        </div>

        <div className="mid2">
          <div>
            <span>Innovation:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              type="text"
              maxLength={1} value={innovation2} onChange={(e)=>setInnovation2(e.target.value)}
            />
          </div>
          <div>
            <span>Subject Relevance:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize:'none'
              }}
              type="text"
              maxLength={1} value={subRel2} onChange={(e)=>setSubRel2(e.target.value)}
            />
          </div>
          <div>
            <span>Individuality:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
                resize: "none",
              }}
              type="text"
              maxLength={1} value={individuality2} onChange={(e)=>setIndividuality2(e.target.value)}
            />
          </div>
          <div>
            <span>Preparation:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
              }}
              type="text"
              maxLength={1} value={preparation2} onChange={(e)=>setPreparation2(e.target.value)}
            />
          </div>
          <div>
            <span>Presentation:(2M)</span>
            <input
              style={{
                width: "24px",
                borderRadius: "10px",
                textAlign: "center",
              }}
              type="text"
              maxLength={1} value={presentation2} onChange={(e)=>setPresentation2(e.target.value)}
            />
          </div>
          <div style={{marginTop:'4%', justifyContent: "space-between", marginRight:'3px', fontWeight:'bolder'}}>
            <span >MID-II:(10M)</span>
            <span style={{backgroundColor:'#E5E4E2', color:'black', width:'40px', padding:'3px', textAlign:'center', borderRadius:'10px'}}> 
            {parseInt(individuality2)+parseInt(subRel2)+parseInt(innovation2)+parseInt(preparation2)+parseInt(presentation2)}
            </span>
          </div>
        </div>
        <div className="footer">
          <i class="fas fa-chevron-circle-left fa-2x" style={{ cursor: "pointer" }} onClick={Save}></i>
          <i class="fas fa-chevron-circle-right fa-2x" style={{ cursor: "pointer" }} onClick={Save}></i>
        </div>
      </div> 

      <div className="right">
        <div
          className="preview"
          style={{ display: "grid", gridTemplateColumns: "0.3fr 0.3fr 0.3fr" }}
        >
          <div></div>
          <span
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              padding: "16px",
              gridArea: "title",
              alignSelf: "center",
            }}
          >
            PREVIEW
          </span>
          <div
            className="dropdown"
            style={{
              alignSelf: "end",
              padding: "16px",
              justifySelf: "end",
            }}
          >
            <i className="fa fa-angle-down dropdown-i" aria-hidden="true"></i>
            <select
              style={{
                width: "200px",
                padding: "8px",
                borderRadius: "24px",
                marginRight: "12px",
              }}
              onChange={(e)=>{
                
                
                  setIsMid1(e.target.value === 'm1'?true:false)
                
              }}
              name="selectList"
              id="selectList"
            >
                <option value="m1">Mid-I  </option> 
              <option value="m2">Mid-II </option>
            </select>
          </div>

          <div className="display">
                      
                <Docviewer extension="mp4" object="https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx" /> 
    
                
              </div>
          <div className="remarksCon">
            <span className="remarks-title">REMARKS</span>
            <textarea rows={3} className="remarks" style={{ resize: "none", backgroundColor:"#bbe8ff", opacity:"0.7"}} />
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

              onClick={Save}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grading;

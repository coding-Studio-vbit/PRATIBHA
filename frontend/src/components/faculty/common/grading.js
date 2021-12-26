import * as React from "react";
import { Viewer } from "@react-pdf-viewer/core";
// import styles from "./grading.css";
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
            top:'16px'
        }} className="fas fa-arrow-left black" aria-hidden="true"></i>
        <h3 style={{ textAlign: "center" }}>Student Details</h3>
        <div className="details">
          <div style={{
            display:'flex',
            gap:'8px'
          }} >
          <span>Roll no:</span>
          <div>
          <input type="text" maxLength={10} value={rollNo} onChange={(e)=>setRollNo(e.target.value)}></input>
          <i style={{cursor:'pointer'}} onClick={searchRoll} class="fa fa-search" aria-hidden="true"></i>
          </div>
          </div>
          
          <div>
          <div style={{
            display:'flex',
            gap:8,
            padding:'8px 8px 0px 8px',
          }} ><span>Name :</span>
            <span style={{fontWeight:'bold'}} >Revanth :)</span>
          </div>
          </div>
          <div>
          <div style={{
            display:'flex',
            gap:8,
            padding:'8px 8px 0px 8px',
          }} ><span>Subject:</span>
            <span style={{fontWeight:'bold'}} >DM :/</span>
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
              
              type="number"
              min='0'
              max='2'
              
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
              type="number"
              pattern="[0-2]{1}"
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
              type="number"
              pattern="[0-2]{1}"
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
              type="tel"
              pattern="[0-2]{1}"
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
              type="number"
              pattern="[0-2]{1}"
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
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
            />
          </div>
          <div>
            <span>MID-II:(10M)</span>
          </div>
        </div>
        <div className="footer">
          <i
            class="fas fa-chevron-circle-left fa-2x"
            style={{ cursor: "pointer" }}
          ></i>
          <i class="fas fa-chevron-circle-right fa-2x" style={{ cursor: "pointer" }}></i>
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
            <i className="fa fa-angle-down" aria-hidden="true"></i>
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
                <option value="m1">Mid-I </option> 
              <option value="m2">Mid-II </option>
            </select>
          </div>
          <div className="display">
           {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            <input type="file" accept=".pdf" onChange={onChange} aria-hidden="false" />

            <div className="mt4" style={{ height: '480px' }}>
                {url ? (
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            height: '100%',
                        }}
                    >

                        <Viewer fileUrl={url} />
                    </div>
                ) : (
                    <div
                        style={{
                            alignItems: 'center',
                            //border: '2px dashed rgba(0, 0, 0, .3)',
                            display: 'flex',
                            fontSize: '2rem',
                            height: '100%',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        Preview area
                    </div>
                )}
            </div>
            </Worker>  */}
            
            <Docviewer extension="jpg" />

            
          </div>
          <div className="remarksCon">
            <span className="remarks-title">REMARKS</span>
            <textarea rows={3} className="remarks" style={{ resize: "none" }} />
            <button
              style={{
                backgroundColor: "#0e72ab",
                color: "white",      
                margin: "auto",
                padding: "4px 8px !important",
                cursor:'pointer',
                borderRadius: 25,
                textAlign: "center",
                border: "none",
              }}
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

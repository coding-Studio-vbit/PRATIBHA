import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import "./grading.css";
import Button from "../../global_ui/buttons/button";
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
// import { ProSidebar, SidebarHeader, Menu, MenuItem, SubMenu, SidebarContent  } from 'react-pro-sidebar';
// import "react-pro-sidebar/dist/css/styles.css";
//import FileViewer from "react-file-viewer";

const Grading=()=>{
    
    //  const [menuCollapse, setMenuCollapse] = useState(false);

    //  function menuIconClick () {
    //      menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    //    }

   
    //      const [url, setUrl] = React.useState('');
      
    //      function onChange (e)  {
    //        const files = e.target.files;
    //        files.length > 0 && setUrl(URL.createObjectURL(files[0]));
    //    };
    
    //  const file = "";
    //  const type = "";

    //  const onError = (e) => {
    //          console.log(e, "error in file-viewer");
    //  };

    return(
        
           <div className="grading">
                 {/* <div className="leftnav">
              <i class="fas fa-bars"></i>

      </div>   */}
              <div className="left">
              <i class="fas fa-arrow-left" aria-hidden="true" style={{position: 'absolute',top: '8px',left: '16px'}}></i>
                <span>Student Details</span>
                <div style={{display:'flex',placeContent:'center'}}>
                    <span>Roll no:</span>
                    <input type='text' ></input>
                    <i class="fa fa-search" aria-hidden="true"></i>
                </div>
                <p>Name:Pranchal Agarwal</p>
                <p>Subject: DM</p>
                <div className='mid1'>
                    <div>
                        <span>Innovation:(2M)</span>
                        <input style={{width:'24px', borderRadius:'10px'}} type="number" pattern="[0-2]{1}"/>
                    </div>
                    <div>
                        <span>Subject Relevance:(2M)</span>
                        <input style={{width:'24px', justifyContent:'', borderRadius:'10px'}} type="number" pattern="[0-2]{1}"/>
                    </div>
                    <div>
                        <span>Individuality:(2M)</span>
                        <input style={{width:'24px', borderRadius:'10px'}} type="number" pattern="[0-2]{1}"/>
                    </div>
                    <div>
                        <span>Preparation:(2M)</span>
                        <input style={{width:'24px', borderRadius:'10px'}} type="number" pattern="[0-2]{1}"/>
                    </div>
                    <div>
                        <span>Presentation:(2M)</span>
                        <input style={{width:'24px', borderRadius:'10px'}} type="number" pattern="[0-2]{1}"/>
                    </div>
                </div>
            </div>  

             

            <div className="right">
              <div className="preview" style={{display:'grid',gridTemplateColumns:'0.3fr 0.3fr 0.3fr'}}>
                  <div>

                  </div>
                  <span style={{
                      marginLeft:'auto',
                      marginRight:'auto',
                      padding:'16px',
                      gridArea:'title',
                      alignSelf:'center'
                      

                  }} >PREVIEW</span>
                  <div className="dropdown" style={{
                      alignSelf:'end',
                      padding:'16px',
                      justifySelf:'end'
                  }} >
                     

                  <i className="fa fa-angle-down" aria-hidden="true"></i>
                  <select style={{width:'200px', padding:'8px',borderRadius:'24px',marginRight:'12px'}} name="selectList" id="selectList">
                            <option value="option 1" >Mid-I </option>
                            <option value="option 2" >Mid-II </option>
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

                 {/* <FileViewer fileType={type} filePath={file} onError={onError} height={"100%"}/>  */}
                </div> 
                <div className='remarksCon' style={{
                    position:'absolute',
                    bottom:'0',
                    left:'16px',
                    right:'16px',
                    width:'100vw',
                    flexDirection:'column',
                    transform:'translateY(100px)',
                    display:'flex'
                }} >
                <span className="remarks-title" >REMARKS</span>
                <textarea rows={3} className="remarks"/>                    
                <Button buttonStyle={{
                width:'20ch',
                gridColumnStart:'2',
                gridColumnEnd:'2',
                justifySelf:'center'
                
            }} >Save</Button>
                </div>
                   </div>
            </div>
        
        </div>
    )
}

export default Grading;
import * as React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";

const ViewPPT=({object})=>{
    return <div>PPT</div>;
}

const ViewImage=({object})=>{
    return(
        <div>
            <img src={object} alt="Unable to Load Image"/>
        </div>
    );
}
const ViewVideo=({object})=>{
    return(
        <div>
            <iframe src={object} alt="Unable to Load Image"></iframe>
        </div>
    );
}

const ViewPdf=({object})=>{
    return(
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js">
            <div className="mt4" style={{ height: '520px', padding:'0px',width:'100%', margin:'0px' }}>
                {object ? (
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            height: '100%',
                            
                        }}
                    >

                        <Viewer fileUrl={object} />
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
                        File Cannot be previewed
                    </div>
                )}
            </div>
        </Worker>
    );    
}

function Docviewer({extension,object}){
    switch(extension){
        case 'pdf':
            return <ViewPdf object={object}/>
        case 'pptx':
            return <ViewPPT object={object}/>
        case 'jpeg':
        case 'jpg':
        case 'png':
            return <ViewImage object={object}/>
        case 'mp4':
        case 'avi':
        case "mov":
        case 'm4v':
            return <ViewVideo object={object}/>
        default:return (
                <p>File Extension Not Supported</p>
            );        
    }    
}

export default Docviewer;



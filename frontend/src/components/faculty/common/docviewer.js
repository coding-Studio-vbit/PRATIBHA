import * as React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";


const ViewPPT=({object})=>{
    const linkToPPTFile =
      "https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx";
    return (
        <>
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${linkToPPTFile}`}
             width="100%"
             height="500px"
            frameBorder="0"
            title="slides"
          ></iframe>
        </>
      );
}

const ViewImage=({object})=>{
    return(
        <div>
            <img width="100%"
             height="500px"
             src="https://static.toiimg.com/photo/msid-72954933/72954933.jpg" alt="Unable to Load Image"/>
        </div>
    );
}
const ViewVideo=({object})=>{
    return(
        <video width="100%" height="500px" controls >
      <source src="https://vod-progressive.akamaized.net/exp=1640442433~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F714%2F14%2F353573670%2F1436889546.mp4~hmac=37216186eae76a1428c2235043ed6e4f4cea5e9e7b4d5b53b0eb83e0333c1860/vimeo-prod-skyfire-std-us/01/714/14/353573670/1436889546.mp4" type="video/mp4"/>
</video>
    );
}

const ViewPdf=({object})=>{
    console.log(object);
    return(
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            <div className="mt4" style={{ height: '520px', padding:'0px',width:'100%', margin:'0px' }}>
                {object ? (
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            height: "500px",
                            width:"100%"
                            
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



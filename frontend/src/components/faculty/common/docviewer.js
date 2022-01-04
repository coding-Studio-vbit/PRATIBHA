import * as React from "react";
import { Spinner, Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { getStorage, ref, getMetadata } from "firebase/storage";
import { storage } from "../../../firebase";
import { useEffect,useState } from "react";

import { Component } from 'react';
// import logger from 'logging-library';
import FileViewer from 'react-file-viewer';
// import { CustomErrorComponent } from 'custom-error';

class MyComponent extends Component {
  render() {
    return (
      <FileViewer
        fileType={this.props.type} 
        filePath={this.props.object}
        errorComponent={<h1>fuhhgueihg</h1>}
        onError={this.onError}/>
    );
  }
}



const ViewPPT=({object})=>{
    useEffect(() => {
        console.log(object);
    }, [])
    
    const linkToPPTFile =
      "https://storage.googleapis.com/slidescarnival_powerpoints/Paulina%20%C2%B7%20SlidesCarnival.pptx";
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
        <img height="510"
        style={{backgroundSize:'contain'}} src={object} alt="Unable to Load"/>
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
    // console.log(object);
    return(
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            <div className="mt4" style={{  padding:'0px',width:'100%', margin:'0px' }}>
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

function Docviewer({link}){
    const forestRef = ref(storage,link);  

    const [extension, setextension] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        console.log(link);
        console.log("XYZ");
        getMetadata(forestRef)
        .then((metadata) => {
            console.log(metadata.contentType.split("/")[1]);
            setextension(metadata.contentType.split("/")[1]);
            setloading(false);
        })
        .catch((error) => {
            // console.log(error,1010);
            setextension(null)
            setloading(false);
        });
    }, [link])

    return (
        extension!=null?
        <Module extension={extension} object={link}/>:
        <div>
            {
                loading?<Spinner radius={2}/>:
                <div>Unknown Error Occured</div>
            }                                  
        </div>        
    )      
}

function Module({extension,object}) {
    console.log(extension,1010);
    switch(extension){
        case 'pdf':
            return <ViewPdf object={object} />
        case 'vnd.openxmlformats-officedocument.presentationml.presentation':
            return <ViewPPT object={object}/>
        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
            return <div style={{height:'60vh'}}><MyComponent object={object} type="docx"/></div>
        case 'jpeg':
            return <img src={object} alt="Done" height={80} width={80}/>
        case 'jpg':
            return <img src={object} alt="Done" height={80} width={80}/>
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



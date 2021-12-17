
import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import styles from "./uploadpra.module.css";
import Button from "../../global_ui/buttons/button";
import Navbar from "../../global_ui/navbar/navbar";
import '@react-pdf-viewer/core/lib/styles/index.css';
//import { Worker } from '@react-pdf-viewer/core';
import { uploadFile } from '../../../firebase';




	

const Upload =() => {
    const [url, setUrl] = React.useState('');
    const [praTitle, setPraTitle] = React.useState('');
    

    // Handle the `onChange` event of the `file` input
    const onChange = (e) => {
        let files=e.target.files[0]
        console.log(files.size);
        if (files.size > 200000){
            setUrl(null)
            console.log("File limit exceeded");
        }
        else
        {
            console.log("File uploaded");
               setUrl(URL.createObjectURL(e.target.files[0]));
        }
    }

    const submit = () => {
      let a= uploadFile(url,url.name);
      console.log(a,10);	
	}; 
  
    return(
           <>
              <Navbar title="UPLOAD PRA"></Navbar>
              <div className={styles.main}>
                <div>
                    <span>PRA : </span>
                    <input style={{padding:'2px', borderRadius:'24px', width:'400px', padding:'5px', fontSize:'18px', alignSelf:'center'}} type="text" placeholder="TITLE OF THE ACTIVITY" required />
                </div>           
                <p style={{marginTop:'2%', color:'red'}}>*Upload an abstract for your activity in not more than 150 words.</p>
               

                    <div>
                        <input type="file" accept=".pdf" data-max-size= "200000" value={url} uploadonChange={onChange} />

                        {/* <div style={{ height: '750px' }}>
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
                            border: '2px dashed rgba(0, 0, 0, .3)',
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
            </div> */}
        </div>


                

            <Button buttonStyle={{
                width:'20ch',
                alignSelf:'center',
                marginTop:'20px'
                
            }} 
            onClick={()=>{submit()}}
            >Upload</Button>
        </div>
        </>
    );
    
 
}
export default Upload;
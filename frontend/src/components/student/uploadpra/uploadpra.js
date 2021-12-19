import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import styles from "./uploadpra.module.css";
import Button from "../../global_ui/buttons/button";
import Navbar from "../../global_ui/navbar/navbar";
import '@react-pdf-viewer/core/lib/styles/index.css';
import { uploadFile } from '../../../firebase';


const Upload =() => {
    const [url, setUrl] = React.useState('');
    const [fileName, setFileName] = React.useState('');    
    const [praTitle, setPraTitle] = React.useState('');
    const [fileError, setFileError] = React.useState('');   
    const [titleError, setTitleError] = React.useState('');    
    const [isMid1, setIsMid1]= React.useState(false)
 

    const onChange = (e) => {
        let files=e.target.files[0]
        console.log(files.size);
        if (files.size > 200000){
            setUrl(null)
            setFileError("File Limit Exceeded");
            console.log("File limit exceeded");
        }
        else
        {
            setFileError("");
            setFileName(files.name)
            console.log("File uploaded");
            setUrl(URL.createObjectURL(e.target.files[0]));
        }
    }


    const handleTitle=(e)=> {
        let value=e.target.value
         if(value.length<8){
            setTitleError("Title must have atleast 8 characters");
        }
        else{
            setTitleError("")
        }   
        setPraTitle(value)             
    }

    const submit = () => {
      let a= uploadFile(url,url.name);
      console.log(a,10);	
	}; 
  
    return(
        <>
            <Navbar title="UPLOAD PRA"></Navbar>
            <div className={styles.main}>
                {
                    (!isMid1)&&(<div>
                        Mid
                    </div>
                        )
                }
                <div>
                    <span>PRA : </span>
                    <input style={{padding:'5px', borderRadius:'24px', width:'400px', fontSize:'18px', alignSelf:'center'}} 
                    type="text"  placeholder="TITLE OF THE ACTIVITY" 
                    value={praTitle} onChange={handleTitle} maxLength={50} />

                    <p style={{marginTop:'1%', color:'red',  fontSize:'12px',textAlign:'center'}}>{titleError}</p>         
                </div> 

                <p style={{marginTop:'2%', color:'red'}}>*Upload an abstract for your activity in not more than 150 words.</p>              

                <div>
                    {/* <input type="file" accept=".pdf" data-max-size= "200000" value={url} onChange={onChange} /> */}
                    <label className={styles.customFileUpload}>
                        <input type="file" accept=".pdf"  onChange={onChange} /> 
                        {
                            fileName.length>0?"Change File":"Add File"
                        }
                        </label>
                    {
                        fileError.length>0?
                        <p style={{marginTop:'2%', color:'red', fontSize:'16px',textAlign:'center'}}>{fileError}</p> 
                        :<p>{fileName}</p>          
                    }
                    
                </div>               

                <Button buttonStyle={{
                    width:'20ch',
                    alignSelf:'center',
                    marginTop:'20px'                    
                }} onClick={()=>{submit()}}>
                Upload
                </Button>
            </div>
        </>
    );
}

export default Upload;
import React from 'react'
import styles from './dialog.module.css'
import Download from '../download/download';

function Dialog({message,onOK,onConfirm,onCancel,twoButtons=false,download=false,rollNo,url,setShowDialog}) {
    return (        
        <div className={styles.dialogOverlay}>
            <div className={styles.dialog}>
                <p className={styles.message}>{message}</p>
              
                {
                    twoButtons? (
                    <div style={{display:"flex",gap:'100px'}}>
                        <button onClick={()=>onConfirm()} className={styles.btn}>Delete</button>
                        <button onClick={()=>onCancel()} className={styles.btn}>Cancel</button>
                    </div>):download && rollNo ?
                    <div style={{align:"center"}}>
                        <Download url={url} userID={rollNo} isIcon={false} setShowDialog={setShowDialog}/>
                    </div>                   
                    :  (<button onClick={()=>onOK()} className={styles.btn}>Okay</button>)
                }
            </div> 
        </div>       
    )
}

export default Dialog;
//use dialog like this <Dialog message={'This is wrong'}/>
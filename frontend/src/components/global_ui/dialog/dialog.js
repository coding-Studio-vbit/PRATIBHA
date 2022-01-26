import React from 'react'
import styles from './dialog.module.css'

function Dialog({message,onOK,onConfirm,onCancel,twoButtons=false}) {
    return (        
        <div className={styles.dialogOverlay}>
            <div className={styles.dialog}>
                <p className={styles.message}>{message}</p>
              
                {twoButtons? (<div>
                 <button onClick={()=>onConfirm()} className={styles.btn}>Confirm Delete</button>
                 <button onClick={()=>onCancel()} className={styles.btn}>Cancel</button>)
            </div>):  (<button onClick={()=>onOK()} className={styles.btn}>Okay</button>)}
        </div> 
        </div>       
    )
}

export default Dialog;
//use dialog like this <Dialog message={'This is wrong'}/>
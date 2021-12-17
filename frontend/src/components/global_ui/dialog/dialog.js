import React from 'react'
import styles from './dialog.module.css'

function Dialog({message,setviewDialog}) {
    return (        
        <div className={styles.dialogOverlay}>
            <div className={styles.dialog}>
                <p className={styles.message}>{message}</p>
                <button onClick={()=>setviewDialog(false)} className={styles.btn}>Okay</button>
            </div>
        </div>        
    )
}

export default Dialog;

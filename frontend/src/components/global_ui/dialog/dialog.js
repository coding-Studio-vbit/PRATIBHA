import React from 'react'
import styles from './dialog.module.css'

function Dialog({message,onOK}) {
    return (        
        <div className={styles.dialogOverlay}>
            <div className={styles.dialog}>
                <p className={styles.message}>{message}</p>
                <button onClick={()=>onOK()} className={styles.btn}>Okay</button>
            </div>
        </div>        
    )
}

export default Dialog;
//use dialog like this <Dialog message={'This is wrong'}/>
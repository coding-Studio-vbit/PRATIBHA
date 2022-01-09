import React from 'react';
import './spinner.css';
import styles from "../dialog/dialog.module.css"

/**
 * 
 * @param {string} radius radius of spinner
 * @returns Spinner component
 */

const Spinner = ({radius}) => {
    return ( 
        <div className="spinner" style={{width:radius+'em',height:radius+'em'}}></div>
    );
}
 


const LoadingScreen = ({isTransparent=false}) => {
    return ( 
        <div className="loadingScreen" style={{
            background:isTransparent?'white':'white',
            zIndex:100,
            }} >
            <Spinner radius={2} />
        </div>
     );
}
export  {Spinner,LoadingScreen};
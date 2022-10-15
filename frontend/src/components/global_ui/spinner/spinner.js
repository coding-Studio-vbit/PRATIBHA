import React from 'react';
import './spinner.css';

/**
 * 
 * @param {string} radius radius of spinner
 * @returns Spinner component
 */

const Spinner = ({radius,isDark=false}) => {
    return ( 
        <div class="spinner-block" style={{marginTop:'15px',marginBottom:'15px'}} >
            <div className={`${!isDark?"spinner spinner-1":"spinnerDark spinnerDark-1"}`}  ></div>
        </div>
    );
}

const LoadingScreen = ({isTransparent=false,height}) => {
    return ( 
        <div className="loadingScreen" style={{
            background: isTransparent ? 'transparent' : 'white',
            height: height ? height : '100vh',
            zIndex:100,
            }} >
            <Spinner/>
        </div>
     );
}
export  {Spinner,LoadingScreen};
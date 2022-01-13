import React from 'react';
import './spinner.css';

/**
 * 
 * @param {string} radius radius of spinner
 * @returns Spinner component
 */

const Spinner = ({radius}) => {
    return ( 
        <div class="spinner-block">
            <div class="spinner spinner-1"></div>
        </div>
    );
}
 


const LoadingScreen = ({isTransparent=false}) => {
    return ( 
        <div className="loadingScreen" style={{
            background:isTransparent?'white':'white',
            zIndex:100,
            }} >
            <Spinner/>
        </div>
     );
}
export  {Spinner,LoadingScreen};
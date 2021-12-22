import React from 'react';
import './spinner.css';

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
 
const LoadingScreen = () => {
    return ( 
        <div className="loadingScreen" >
            <Spinner radius={2} />
        </div>
     );
}
export  {Spinner,LoadingScreen};
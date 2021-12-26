import React from 'react'
import './download.css'
function Download({url,text="DOWNLOAD"}) {
    return (
        <a href={url} className='download' download>
            {text}            
        </a>
    )
}

export default Download

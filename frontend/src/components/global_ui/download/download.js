import React from 'react'
import './download.css'
import axios from 'axios'

function Download({url,text="DOWNLOAD",userID="random"}) {
    function download() {
        console.log("Satrte");
        console.log(url);
        axios({
              url: url,
              method: 'GET',
              responseType: 'blob'
        })
              .then((response) => {
                  console.log(response.data.type.split('/').pop());
                    const url = window.URL
                          .createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download',userID+"."+response.data.type.split('/').pop());
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
              })
  }
    return (
        <button className='download' onClick={()=>download()}>
           <i class="fas fa-cloud-download-alt downloadIcon" ></i>           
        </button>
    )
}

export default Download

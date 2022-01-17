import React from "react";
// import "./download.css";
import axios from "axios";

function Download({ url, text = "DOWNLOAD", userID = "random", isIcon=true }) {
  function download() {
    // console.log("Satrte");
    console.log(url);
    axios({
      url: url,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      console.log(response.data.type.split("/").pop());
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      if(response.data.type.split("/").pop()=="vnd.openxmlformats-officedocument.presentationml.presentation"){
        link.setAttribute(
          "download",
          userID + ".pptx" 
        );
      }else if(response.data.type.split("/").pop()=="vnd.ms-powerpoint"){
        link.setAttribute(
          "download",
          userID + ".ppt" 
        );
      }      
      else{
        link.setAttribute(
          "download",
          userID + "." + response.data.type.split("/").pop()
        );
      }      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
  return (
    <button
      className="download"
      onClick={() => download()}
      style={{ 
        display:'flex',
        alignItems:'center',
        background:isIcon?"none":"#0E72AB",
        color:isIcon?"#0E72AB":"white", 
        border: "none", cursor: "pointer",borderRadius:'6px',padding:isIcon?"auto":"6px 16px" }}
    >
      <p style={{fontSize:'16px'}}>{isIcon?"":"DOWNLOAD"}</p>
      <i
        class="fas fa-cloud-download-alt downloadIcon"
        style={{ color:isIcon?"#0E72AB":"white"}}
      ></i>
    </button>
  );
}

export default Download;

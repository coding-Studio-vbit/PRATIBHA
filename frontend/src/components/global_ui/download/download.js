import React from "react";
// import "./download.css";
import axios from "axios";

function Download(url) {
  function download() {
    console.log("Satrte");
    axios({
      url: url,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "image.jpg");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
  return (
    <button className="download" onClick={() => download()}>
      <i
        className="fa fa-download"
        aria-hidden="true"
        style={{ color: "rgba(11, 91, 138, 1)" }}
      ></i>
    </button>
  );
}

export default Download;

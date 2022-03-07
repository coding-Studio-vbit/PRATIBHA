import React from "react";
// import "./download.css";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./../../../firebase";

function Download({
  url,
  text = "DOWNLOAD",
  userID = "random",
  isIcon = true,
  setShowDialog,
}) {
  async function download() {
    if (url !== null) {
      if (url.slice(0, 5) == "https") {
        //do nothing
      } else {
        await getDownloadURL(ref(storage, url)).then((ux) => {
          url = ux;
        });
      }
      axios({
        url: url,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        if (
          response.data.type.split("/").pop() ==
          "vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          link.setAttribute("download", userID + ".pptx");
        } else if (response.data.type.split("/").pop() == "vnd.ms-powerpoint") {
          link.setAttribute("download", userID + ".ppt");
        } else {
          link.setAttribute(
            "download",
            userID + "." + response.data.type.split("/").pop()
          );
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } else {
      setShowDialog("File does not exist");
    }
  }
  return (
    <button
      className="download"
      onClick={() => download()}
      style={{
        display: "flex",
        alignItems: "center",

        background: isIcon ? "none" : "#0E72AB",
        color: isIcon ? "#0E72AB" : "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "6px",
        padding: isIcon ? "auto" : "0px 16px",
      }}
    >
      {!isIcon && (
        <p style={{ fontSize: "16px" }}>{isIcon ? "" : "DOWNLOAD"}</p>
      )}
      <i
        class="fas fa-cloud-download-alt downloadIcon"
        style={{
          color: isIcon ? "#0E72AB" : "white",
          fontSize: isIcon ? "28px" : "12px",
        }}
      ></i>
    </button>
  );
}

export default Download;

import React, { useEffect ,useState} from "react";
import "./loginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../global_ui/spinner/spinner";
import Footer from "./footer/footer";


// import Announcement from "./announcements/announcements";

export default function LoginPage() {
  const { signInWithGoogle, currentUser, loading } = useAuth();
  const nav = useNavigate();
  const text="Participatory Report Assessment of Theme and Innovation Based Harmonic Activities";
  
  const [displayText, setdisplayText] = useState("");
  let i=0;

  function animate() {
    
    setTimeout(() => {
      setdisplayText(text.slice(0,i));  
      i+=1;
      animate()    
    }, 75); 

  }
  
  useEffect(() => {
    animate()
    if (currentUser) {
      if (currentUser.userType === "STUDENT") {
        if (currentUser.isFirstTime) {
          nav("/student/enroll", { replace: true });
        } else {
          nav("/student/subjectslist", { replace: true });
        }
      } else if (currentUser.userType === "FACULTY") {
        if (currentUser.isFirstTime) {
          nav("/faculty/enroll", { replace: true });
        }  else if (currentUser.isCOE) {
          nav("/faculty/coesearch", { replace: true });
        } else {
          nav("/faculty/classlist", { replace: true });
        }}
    }
    else{
      nav("/")
    }
  }, [currentUser]);

  return loading === false ? (
    <div className="page">
      <div className="loginComponent">
        
        <div className="logos">
          <div className="pratibha">
              <img alt="Pratibha" height={100} src="/pratibhamainfin.png"/>
              {/* <span className="titleStyle" >PRATIBHA</span> */}
          </div>
          <img alt="vbit" className="vbit" src="/vbit.png" />       
          <img alt="codingStudio" className="cs_logo" src="/cs_logo.png" />
        </div>

        <div className="landingCard">
            <div className="titleLogin">
                <img className="pLogo" alt="Pratibha" src="/PRATIBHAmaintitle.png"/>
                <div className="pLogo" style={{marginTop:'30px',height:'100px'}}>
                  <span className="line1">
                      {displayText}
                  <span className="animtypewriter">|</span>
                  </span>
                </div>
                
            </div>

            <div className="row">

              <div className="button-and-icon">
                <i class="fas fa-user-graduate icons"></i>            
                <button className="loginBtn" onClick={signInWithGoogle}>
                    Login as Student
                  </button>
              </div>

              <div className="button-and-icon">
                  <i className="fas fa-users icons"></i>
                  <button className="loginBtn" onClick={signInWithGoogle}>
                    Login as Faculty
                  </button>
              </div>
              
            </div>
        </div>
      
      </div> 

      {/* <Announcement/>      */}
    
      <Footer/>
    </div>
  ) : (
    <LoadingScreen/>
  );
}

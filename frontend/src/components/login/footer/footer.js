import React from 'react'
import ContactPage from '../contactPage/contactPage'
import './footer.css'

function Footer() {
    return (
        <footer className='customFooter'>

            <div className="content1">
                <div className='footerLogo'>
                    <img src="/VBIT_LOGO_WHITE.png" height={60} width={300} />
                    <span style={{fontSize:'18px',color:"white",marginTop:'20px'}}>Vignana Bharathi Institute of Technology emerged as a hub for engineering excellence. At VBIT, students will discover engineering in a different light. Students will experience an engineering education that is on par with the industry requirement.</span>
                </div>
                <ContactPage/>                
            </div>

            <hr/>

            <div className="content1" style={{alignItems:"center"}}>
                <p className='txt'>Copyright © {new Date().getFullYear()}  Vignana Bharathi Institute Of Technology All Rights Reserved</p>
                <div className='links'>
                    <span>Follow us on</span>
                    <i className="fab fa-instagram"></i>
                    <i className="fab fa-facebook-f"></i>
                    <i class="fas fa-link"></i>
                </div>
            </div>

            <div className='dev'>
                <img src='/cs_logo.png' height={30}></img>                
                <a className='devInfo' href='https://codingstudio.club' >coding.Studio();
                </a>
            </div>
            
        </footer>
    )
}

export default Footer

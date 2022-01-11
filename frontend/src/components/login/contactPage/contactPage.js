import React,{useState} from 'react'
import './contactPage.css'

function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [query, setQuery] = useState("");

    const [errors, setErrors] = useState({
        nameError:null,
        emailError:null,
        queryError:null
    })  
    
    function validate() {
        let nameError=null;
        let emailError=null;
        let queryError=null;
        if(name.length<6){
            nameError="name cannot be less than 6 characters"            
        }
        if(email.length<15){
            emailError="email cannot be less than 15 characters"
        }
        if(query.length<15){
            queryError="query cannot be less than 10 characters"
        }
        setErrors({
            nameError:nameError,
            emailError:emailError,
            queryError:queryError
        })
    }

    function handleSubmit() {
        setErrors({
            nameError:null,
            emailError:null,
            queryError:null
        });
        validate();
        console.log(errors);
        if(errors.nameError==null && errors.emailError==null && errors.queryError==null){
            console.log("Valid Call Function");
        }else{
            console.log("Errors");
        }
                        
    }

    return (
        <div className="contactComponent">
            <div className='formComponent'>
                <p className='contactTitle'>For queries Contact Us</p>
                <div className='field'>
                    <label className='labelStyle'>Name</label>
                    <br/>
                    <input 
                    className={errors.nameError==null?"inputFieldStyle":"errorFieldStyle"} type="text" 
                    onChange={(e)=>setName(e.target.value)} placeholder='Name'
                    ></input>
                    {/* {
                        errors.nameError && <p className='errorField'>{errors.nameError}</p>
                    } */}
                </div>

                <div className='field'>
                    <label className='labelStyle'>Email</label>
                    <br/>

                    <input className={errors.emailError==null?"inputFieldStyle":"errorFieldStyle"} type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Email'></input>
                    {/* {
                        errors.nameError && <p className='errorField'>{errors.emailError}</p>
                    } */}
                </div>

                <div className='field'>
                    <label className='labelStyle'>Query</label>
                    <br></br>

                    <textarea className={errors.queryError==null?"inputFieldStyle":"errorFieldStyle"} onChange={(e)=>setQuery(e.target.value)} placeholder='Query'></textarea>
                    {/* {
                        errors.nameError && <p className='errorField'>{errors.queryError}</p>
                    } */}
                </div>

                <button className='contactButton' type="submit" onClick={()=>handleSubmit()}>SUBMIT</button>
            </div>
        </div>
    )
}

export default ContactPage

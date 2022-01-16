import React,{useState} from 'react'
import './contactPage.css'
import {db} from '../../../firebase';
import { addDoc, collection, doc,setDoc} from "firebase/firestore"; 
import {Spinner} from '../../global_ui/spinner/spinner'

function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    async function postAQuery() {
        setLoading(true);
        let data = {
            name:name,
            email:email,
            query:query
        }
        const collectionRef = collection(db, 'queries');   
        try{
            await addDoc(collectionRef,data); 
            setResult("Query Posted Successfully");
            setName("");
            setEmail("");
            setQuery("");
        }
        catch(e){
            setResult(e.toString());
        }  
        setTimeout(() => {
            setLoading(false);   
            setResult(null);   
        }, 3000);
        
    }

    const [errors, setErrors] = useState({
        nameError:null,
        emailError:null,
        queryError:null
    })  
    
    function validate() {
        setErrors({
            nameError:null,
            emailError:null,
            queryError:null
        })
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
        if(nameError==null && emailError==null && queryError==null){
            return true;
        }else{
            return false;
        }
    }

    async function handleSubmit() {
        if(validate()){
            await postAQuery();
        }else{
            console.log("Errors");
        }                        
    }

    return (
        <div className="contactComponent">
            <div className='formComponent'>
                <p className='contactTitle'>Contact Us</p>
                <div className='field'>
                    <p className='labelStyle'>Name</p>
                    <input 
                    className={errors.nameError==null?"inputFieldStyle":"errorFieldStyle"} type="text" 
                    onChange={(e)=>setName(e.target.value)} placeholder='Name' value={name}
                    ></input>
                    {/* {
                        errors.nameError && <p className='errorField'>{errors.nameError}</p>
                    } */}
                </div>

                <div className='field'>
                    <p className='labelStyle'>Email</p>
        
                    <input value={email} className={errors.emailError==null?"inputFieldStyle":"errorFieldStyle"} type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Email'></input>
                    {/* {
                        errors.nameError && <p className='errorField'>{errors.emailError}</p>
                    } */}
                </div>

                <div className='field'>
                    <p className='labelStyle'>Query</p>
                    
                    <textarea value={query} className={errors.queryError==null?"inputFieldStyle":"errorFieldStyle"} onChange={(e)=>setQuery(e.target.value)} placeholder='Query'></textarea>
                    {/* {
                        errors.nameError && <p className='errorField'>{errors.queryError}</p>
                    } */}
                </div>

                {
                    loading?
                    result!=null?<p>{result}</p>:<Spinner isDark={true}/>:
                    <button className='contactButton' type="submit" onClick={()=>handleSubmit()}>SUBMIT</button>
                }
                </div>
        </div>
    )
}

export default ContactPage

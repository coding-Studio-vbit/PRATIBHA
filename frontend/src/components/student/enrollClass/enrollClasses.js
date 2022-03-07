import React,{useState} from 'react'
import Navbar from '../../global_ui/navbar/navbar';
import Select from "react-select";
import { enrollCourse, fetchDepartments, fetchRegulationOptions,fetchisMid1,fetchisMid2, fetchisSem1, fetchisSem2, fetchSemNumber } from '../services/studentServices';
import Button from '../../global_ui/buttons/button';
import { Spinner } from '../../global_ui/spinner/spinner';
import { useAuth } from '../../context/AuthContext';
import './enrollClasses.css'
import Dialog from '../../global_ui/dialog/dialog';
import { useNavigate } from 'react-router-dom';

function EnrollClasses() {
    const navigator = useNavigate();

    const {currentUser}= useAuth();
    const [dialog, setdialog] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [buttonTitle, setButtonTitle] = useState("Get Departments");
    const [data, setData] = useState();
    const[isSuccess,setisSuccess]=useState(false);

    const [course, setCourse] = useState("");
    const courses = [
        { value: "BTech", label: "B.Tech" },
        { value: "MTech", label: "M.Tech" },
        { value: "MBA", label: "MBA" },
    ];

    const [year, setYear] = useState("");
    const years = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" }
    ];

    const yearsList=(type)=>{
        if(type==="BTech" ){
            return years;
        }else if(type==='MBA' || type==="MTech"){
            return years.slice(0,2);
        }
        else{
            return [];
        }
    }
    const [regulation,setRegulation]=useState('');
    const[regoptionss,setregoptionss]=useState([]);
   async function regoptions(){
    const res = await fetchRegulationOptions();
  setregoptionss(res.data);
   } 


    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState(null);
    const [depLock, setdepLock] = useState(false);

    const [section, setSection] = useState("");
    const [sections, setSections] = useState(null);

    const [openElectives, setOpenElectives] = useState(null);
    const [oe, setOe] = useState("");

    const [professionalElectives, setProfessionalElectives] = useState(null);
    const [pe, setPe] = useState("");

    const [subjects, setSubjects] = useState();
    // const [oeCount, setoeCount] = useState();
    // const [peCount, setpeCount] = useState();
    function getData(val){
        let sect=[];
        data.forEach((e)=>{
            if(e.id===val){ 
                setSubjects(e.data()['subjects'])              
                e.data()['sections'].forEach((s)=>{
                    sect.push({value:s,label:s});  
                })
                if(e.data()["OEs"]!=null){
                    setOpenElectives(e.data()["OEs"]);
                }else{
                    setOpenElectives(null);
                }
                if(e.data()["PEs"]!=null){
                    setProfessionalElectives(e.data()["PEs"]);
                }
                else{
                    setProfessionalElectives(null);
                }
            }
        })
        setSections(sect);  
    }
    async function isEnrollValid(course,year){
        try{
          const f1=await fetchisMid1(course,year);
          const f2=await fetchisMid2(course,year);
          if(f1||f2){
              return true;
          }
          else{
            return false;
          }
        }
        catch(e){
          console.log(e);
        }
      
      }

    async function fetchData(){
        if(departments==null && course!=="" && year!==""){
            setLoading(true);
            const res = await fetchDepartments(course.value,year.value);
            if(res.error!=null){
                console.log("Error",res.error);
            }else{
                setdepLock(true);
                setData(res.data);
                let depObj=[];
                res.data.forEach(element => {
                    depObj.push({value:element.id,label:element.id});
                });
                setDepartments(depObj);
            }
            setLoading(false); 
            setButtonTitle("Enroll");
        }else if(departments!=null){ 
            setLoading(true);
            let isValid=true;
            if(course!=="" && year!=="" && department!=="" && section!==""){
                let subs=subjects;
                if(professionalElectives==null){
                    //
                }else{
                    if(pe===""){
                        isValid=false;
                    }else{
                        subs.push(pe);
                    }
                }
                if(openElectives==null){
                    //
                }else{
                    if(oe===""){
                        isValid=false;
                    }else{
                        subs.push(oe);
                    }
                }
                if(isValid){
                    
                    const enrollValid = await isEnrollValid(course.value,year.value)
                    if(enrollValid){
                        const sem = await fetchSemNumber(course.value,year.value);
                        const res = await enrollCourse(currentUser.email,{
                            name:currentUser.username,
                            course:course.value,
                            year:year.value,
                            regulation:regulation.value,
                            department:department.value,
                            subjects:subjects,
                            section:section.value,
                            semester:sem                 
                        })
                        if(res==null){
                            setisSuccess(true);
                            setLoading(false);
                            setdialog("Enrolled Successfully")
                        }
                    }
                    else{
                        setLoading(false);
                        setdialog("Cannot Enroll.Deadlines crossed")
                    }

                 
                }else{
                    setLoading(false);
                }
            }else{
              
                setLoading(false);
            }          
        }
    }

    return (
        <div>
{currentUser.isFirstTime ?  (


     
        <div>
            <Navbar back={false} title="Enrollment" logout={false}/>
            {
                dialog && <Dialog message={dialog} onOK={()=>{isSuccess ? navigator('/student/subjectslist',{replace:true}):setdialog(false)}}/>
            } 
            <div className='enrollPage'>
                <div className='instructions'>
                    <ul>
                        <li>Update the details in the form to enroll to your class.</li>
                        <li>Once you enroll, the details cannot be changed.</li>
                    </ul>
                </div>
                <div className='enrollForm'>
                    <div className='inputBox'>
                        <p className="enroll-dropdown-title">Course</p>
                        <Select
                        placeholder=""
                        value={course}
                        isDisabled={depLock}
                        className="select"
                        options={courses}
                        onChange={(c) => {
                            setYear("")
                            setCourse(c);
                            regoptions();
                        }}
                        />
                    </div>
                    <div className='inputBox'>
                        <p className="enroll-dropdown-title">Year</p>
                        <Select
                        placeholder=""
                        value={year}
                        isDisabled={depLock}
                        className="select"
                        options={yearsList(course.value)}
                        onChange={(y) => {
                            setYear(y);
                        }}
                        />
                    </div>
                    <div className='inputBox'>
                        <p className="enroll-dropdown-title">Regulation</p>
                        <Select
                        placeholder=""
                        value={regulation}
                        isDisabled={depLock}
                        className="select"
                        options={regoptionss}
                        onChange={(r) => {
                            setDepartment("");
                            setRegulation(r);
                        }}
                        />
                    </div>
                    {
                        departments!=null &&
                        <div className='inputBox'>
                            <p className="enroll-dropdown-title">Department</p>
                            <Select
                            placeholder=""
                            value={department}
                            className="select"
                            options={departments}
                            onChange={(y) => {
                                setOe("")
                                setPe("")
                                setSection("")
                                setDepartment(y);  
                                getData(y.value);                                 
                            }}
                            />
                        </div>
                    }
                    {
                        (department!=="" && sections!=null) &&
                        <div className='inputBox'>
                            <p className="enroll-dropdown-title">Section</p>
                            <Select
                            placeholder=""
                            value={section}
                            className="select"
                            options={sections}
                            onChange={(y) => {
                                setSection(y);    
                            }}
                            />
                        </div>                        
                    }
                    
                    {
                        professionalElectives!=null &&
                        <div className='inputBox'>
                            <p className="enroll-dropdown-title">Professional Electives</p>
                            <Select
                            placeholder=""
                            value={{value:pe.subject,label:pe.subject}}
                            className="select"
                            options={   
                                professionalElectives.map((a)=>({value:a.subject, label:a.subject}))
                            }
                            onChange={(selectedElective) => {
                                professionalElectives.forEach(element =>{
                                  if(element.subject===selectedElective.value){
                                    setPe(element);
                                  }
                                });
                              }}
                            />
                        </div>                        
                    }
                    {
                        openElectives!=null &&
                        <div className='inputBox'>
                            <p className="enroll-dropdown-title">Open Electives</p>
                            <Select
                            placeholder=""
                            value={{value:oe.subject,label:oe.subject}}
                            className="select"
                            options={
                                openElectives.map((a)=>({value:a.subject, label:a.subject}))
                            }
                            onChange={(y) => {
                                openElectives.forEach(element =>{
                                    if(element.subject===y.value){
                                      setOe(element);
                                    }
                                  });                                    
                            }}
                            />
                        </div>                        
                    }
                    <div className='btnSpinner'>
                        {                       
                            loading?<Spinner radius={1.5}/>:
                            <Button
                            onClick={fetchData}
                            className="enroll-button enrollBtn normal"
                            // disabled={button}
                            width="30"
                            height="40"
                            children={buttonTitle}/>                        
                        } 
                    </div>                                    
                </div>
            </div>            
        </div>
):(
    <Dialog
          message="Already Enrolled. Contact admin for making changes"
          onOK={() => {
            navigator(
              "/student/subjectslist",
              { state: currentUser },
              { replace: true }
            );
          }}
        />
)}
        </div>
    )
}
export default EnrollClasses;

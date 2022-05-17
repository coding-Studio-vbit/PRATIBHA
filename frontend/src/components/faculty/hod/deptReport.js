import React, { useEffect,useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../global_ui/navbar/navbar'
import { getIsEnrolled } from '../services/enrollFacultyServices';
import { getFirstYearStatistics, getStatistics } from '../services/hodServices';

export default function DeptReport() {
    const {currentUser } = useAuth();
    const [isEnrolled, setisEnrolled] = useState(false);
    const [dep,setDep] = useState(null);
    const [course,setCourse] = useState(null)
    const [firstyear,setfirstyear] = useState(null);
    const [secondyear,setsecondyear] = useState(null);
    const [thirdyear, setthirdyear] = useState(null);
    const [fourthyear, setfourthyear] = useState(null);

    async function notCreated(){
        if (currentUser.isFirstYearHOD){
            const res = await getFirstYearStatistics();
            setfirstyear(res);
        }
        else {
            if (course == "BTech")
{
    const res2 = await getStatistics(course,dep,'2');
    if (res2.length!=0){
        setsecondyear(res2)
    }
    const res3 = await getStatistics(course,dep,'3');
    if (res3.length!=0){
        setthirdyear(res3)
    }
    const res4 = await getStatistics(course,dep,'4');
    if(res4.length!=0){
        
        setfourthyear(res4);
    }
}         
else if (course == "MTech"||course=="MBA"){
    const res1 = await getStatistics(course,dep,'1');
    if(res1.length!=0){

        setfirstyear(res1)
    }
    const res2 = await getStatistics(course,dep,'2');
    if (res2.length!=0){
        setsecondyear(res2);
    }
}
    

        }
    }





    async function findIsEnrolled() {
        const res = await getIsEnrolled(currentUser.email);
    
        setisEnrolled(res.data);
      }
      useEffect(()=>{
          const department = currentUser.roles[0].split("_")[1]
          setDep(department);
          const courseRole = currentUser.roles[0].split("_")[0]
          setCourse(courseRole);
          findIsEnrolled();
          notCreated();
      
      });
  return (
    <div className='root-report'>
     <Navbar
        style={{ marginBottom: "30px" }}
        title={"Department Report"}
        logout={true}
        backURL={isEnrolled ? "/faculty/classlist" : "/faculty/enroll"}
      />
      <p className='dep-title'><u>{dep} Department</u></p>
      {currentUser.isFirstYearHOD?
      (
          <div className='firstyear'>
          {
              firstyear!=null && (
                  <>
                      <div>
                          <ol>


                          {firstyear.map((value, index) => {
        return <li key={index}>{value.split('_')[3]+" "+value.split('_')[4]+" "+value.split('_')[5]}</li>
      })}
                          </ol>

                      </div>
                  </>
              )
          }
          </div>
      ):
      (<>
      {
         course=="MTech"&&(
              <>
              <div className='year'>
          {
              firstyear!=null && (
                  <>
                      <div>
                      <p className='dep-title'>
                             FIRST YEAR
                          </p>
                          <ol>
                          {firstyear.map((value, index) => {
        return <li key={index}>{value.split('_')[3]+" "+value.split('_')[4]+" "+value.split('_')[5]}</li>
      })}
      </ol>

                      </div>
                  </>
              )
          }
          </div>

              </>
          )
      }
      {
         course=="MBA"&&(
              <>
              <div className='year'>
          {
              firstyear!=null && (
                  <>
                      <div>
                      <p className='dep-title'>
                             FIRST YEAR
                          </p>
                          <ol>

                          {firstyear.map((value, index) => {
        return <li key={index}>{value.split('_')[4]+" "+value.split('_')[5]}</li>
      })}
                          </ol>

                      </div>
                  </>
              )
          }
          </div>

              </>
          )
      }

          <div className='year'>
          {
            secondyear!=null && (
                  <>
                      <div>
                          <p className='dep-title'>
                              SECOND YEAR
                          </p>
                          <ol>

                          {secondyear.map((value, index) => {
        return <li key={index}>{value.split('_')[3]+" "+value.split('_')[4]+" "+value.split('_')[5]}</li>
      })}
                          </ol>

                      </div>
                  </>
              )
          }
          
          </div>
          <div className='year'>
          {
              thirdyear!=null && (
                  <>
                      <div>
                          <p className='dep-title'>
                              THIRD YEAR
                          </p>
                          <ol>

                          {thirdyear.map((value, index) => {
        return <li key={index}>{value.split('_')[3]+" "+value.split('_')[4]+" "+value.split('_')[5]}</li>
      })}
                          </ol>

                      </div>
                  </>
              )
          }
          
          </div>
          <div className='year'>
          {
              fourthyear!=null && (
                  <>
                      <div>
                          <p className='dep-title'>
                              FOURTH YEAR
                          </p>
                          <ol>

                          {fourthyear.map((value, index) => {
        return <li key={index}>{value.split('_')[3]+" "+value.split('_')[4]+" "+value.split('_')[5]}</li>
      })}
                          </ol>

                      </div>
                  </>
              )
          }
          
          </div>
      </>
      )
      }

    
    </div>
  )
}

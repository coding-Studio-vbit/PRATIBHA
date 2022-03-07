import React,{useState,useEffect} from 'react'
import './announcement.css'
import {getAnnouncements} from '../../student/services/studentServices'

function Announcement() {

    async function getData() {
        const data = await getAnnouncements();
        if(data!=null){
            setdata(data);
        }else{
            setdata(null);
        }
        
    }

    const [data, setdata] = useState(null);
    useEffect(() => {
        getData();
        
    }, [])
    
    return (
        <div className='mainCard'>
            <img className='micImage' src='/mic.png' ></img>
            <div className='announcementInfo'>
                <h1>Announcements</h1>
                <p>
                    {
                        data &&
                        <ul>
                            {
                                data.map((x)=>{
                                    return <li>{x}</li>
                                })
                            }
                        </ul>
                    }
                </p>
            </div>
        </div>
    )
}

export default Announcement;
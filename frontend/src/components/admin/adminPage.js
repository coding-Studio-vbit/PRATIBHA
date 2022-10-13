import React from 'react';
import './adminPage.css';
import Navbar from '../global_ui/navbar/navbar';
import Card from '../global_ui/card/card';
import { Spinner } from '../global_ui/spinner/spinner';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {

    const navigate = useNavigate();
    return (
        <div>
            <Navbar back={false} title={"Admin Page"} logout={true} />
            <div className="container">
                <Card text={"Bulk Enrolls"} onclick={()=>{navigate("/admin/bulkenrolls")}} />
            </div>
        </div>
    );
}
 
export default AdminPage;
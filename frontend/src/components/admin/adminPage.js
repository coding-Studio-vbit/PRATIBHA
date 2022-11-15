import React from 'react';
import styles from './adminPage.module.css';
import Navbar from '../global_ui/navbar/navbar';
import Card from '../global_ui/card/card';
import { Spinner } from '../global_ui/spinner/spinner';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {

    const navigate = useNavigate();
    return (
        <div>
            <Navbar back={false} title={"Admin Page"} logout={true} />
            <div className={styles.container}>
                <Card text={"Bulk Enrolls"} onclick={()=>{navigate("/faculty/admin/bulkenrolls")}} />
                <Card text={"Manual Enroll"} onclick={()=>{navigate("/faculty/admin/ManualEnroll")}} />
            </div>
        </div>
    );
}
 
export default AdminPage;
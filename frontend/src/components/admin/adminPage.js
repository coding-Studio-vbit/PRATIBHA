import React from 'react';
import styles from './adminPage.module.css';
import Navbar from '../global_ui/navbar/navbar';
import Card from '../global_ui/card/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
    const { currentUser } = useAuth();
    const userDept = currentUser?.department;
    const navigate = useNavigate();


    return (
        <div>
            <Navbar back={false} title={userDept ? `${userDept} Department Admin` : "Admin Page"} logout={true} />
            <div className={styles.container}>
                {userDept && (
                    <div className={styles.deptBanner}>
                        Department Portal: <strong>{userDept}</strong> &bull; Access to manage {userDept} department curriculum and subjects.
                    </div>
                )}
                <Card text={"Curriculum & Subjects"} subText={userDept ? `${userDept} (4 Years & 2 Semesters)` : "4 Years & 2 Semesters"} onclick={() => { navigate("/faculty/admin/curriculum") }} />
                {(!userDept || currentUser?.isCOE) && (
                    <>
                        <Card text={"Academic Years"} subText={"Pool & Active Cohorts"} onclick={() => { navigate("/faculty/admin/academic-years") }} />
                        <Card text={"Regulations"} subText={"Max Marks & Year Mapping"} onclick={() => { navigate("/faculty/admin/regulations") }} />
                    </>
                )}
                <Card text={"Bulk Enrolls"} subText={"Batch Student Enrollment"} onclick={() => { navigate("/faculty/admin/bulkenrolls") }} />
                <Card text={"Manual Enroll"} subText={"Single Student Enrollment"} onclick={() => { navigate("/faculty/admin/ManualEnroll") }} />
            </div>
        </div>
    );
}

export default AdminPage;

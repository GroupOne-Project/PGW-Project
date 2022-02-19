import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import Dashboard from "./Dashboard";

const Create = () => {

    // Dashborad call
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    
        // fetchUserName();
    }, [user, loading]);
    


    return (
        <>
            {/* Dashboard */}
            <div className="dashboard">
                <div className="dashboard__container">
                    <div>Welcome</div>
                    Logged in as
                    {/* <div>{name}</div> */}
                    <div>{user?.email.split("@")[0]}</div>
                    <div>With email:</div>
                    <div>{user?.email}</div>
                    <button className="dashboard__btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main */}
            <div className="create-project">Welcome to create Project</div>
            
        </>
    );
    
};

export default Create;
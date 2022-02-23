import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 

import { getDatabase, ref, set } from "firebase/database"

import Dashboard from "./Dashboard";

const Create_project = () => {

    // Dashborad call
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    // const [projects, setProjects] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    
        // fetchUserName();
    }, [user, loading]);
    
    const projects = {
        "1" : {'name': '','task': {'id': 0,'label': '','date_start': '','date_end': '','precedent': 0,}}
    };

    const createNewProject = async () => {        
        try {    

            // const res = await createUserWithEmailAndPassword(auth, email, password);
            // const user = res.user;
            // await addDoc(collection(db, "users"), {
            //   uid: user.uid,
            //   name,
            //   authProvider: "local",
            //   email,
            //   projects,
            // });
        

            // Add a new document in collection "user"
            await setDoc(doc(db, "user", "projects"), {
              projects: projects
            });

            // set on Firestore the user information
            // set(ref(db, 'users/' + user.uid), {
            //     projects: projects
            // });
            console.log(projects);
        
          } catch (err) {
            console.error(err);
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    
        // createNewProject();
    }, [user, loading]);


    return (
        <>
            {/* Dashboard */}
            {/* <div className="dashboard">
                <div className="dashboard__container">
                    <div>Welcome</div>
                    Logged in as
                    <div>{user?.email.split("@")[0]}</div>
                    <div>With email:</div>
                    <div>{user?.email}</div>
                    <button className="dashboard__btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div> */}

            {/* Main */}
            <div className="create-project">Welcome to create Project</div>
            <button onClick={createNewProject}>Create</button>

            {/* Get all data about self project and save this last one into Firebase / Firestore */}
            
            
        </>
    );
    
};

export default Create_project;
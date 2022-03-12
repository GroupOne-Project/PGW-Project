import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Project() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    
    // console.log(window.location.pathname);    
    const projectId = window.location.href.split('?')[1];
    console.log("ok");
    console.log(projectId);

    const [projects, setProjects] = useState("");
    
    // fetch user project who id == project.id
    const fetchUserProject = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            

            setProjects(data.projects);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    }; 
    console.log(projects[projectId]);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    
        fetchUserProject();
        // fetchUserName();
    }, [user, loading]);
    
    return (
        <div>Hi welcome</div>
    );

}

export default Project;
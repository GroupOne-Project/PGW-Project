import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";


function Project() {
    // console.log(window.location.pathname);    
    const projectId = window.location.href.split('?')[1];
    console.log("ok");
    console.log(projectId);

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();        

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
    

    // les render(s)
    if (projectId == 0) {
        console.log("return");        
        return (
            <div className="retour">
                <div>Retour</div>
                <button>
                    <Link to="/create_project">Create Project</Link>
                </button>
            </div>
        );
    } else {
        console.log("yes");
        return (
            <div>Hi welcome</div>
        );
    }

}

export default Project;
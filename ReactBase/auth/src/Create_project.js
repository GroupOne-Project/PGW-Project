import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, setDoc, updateDoc, addDoc} from "firebase/firestore"; 

import { getDatabase, ref, set } from "firebase/database"

import Dashboard from "./Dashboard";

const Create_project = () => {

  // Fetch userProject when userID
  const fetchUserProject = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setProjects(data.projects);
      console.log(data.projects);
      

    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }; 

    // Fetch userName using user?.uid
    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();

        setName(data.name);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    }; 

    // Dashborad call les variables
    const [projects, setProjects] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    // const [projects, setProjects] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
      
        fetchUserProject()
        fetchUserName();
    }, [user, loading]);
    
    const newProjects =
      {'name': '','task': {'id': 0,'label': '','date_start': '','date_end': '','precedent': 0,}}
    ;

    const createNewProject = async () => {        
        try {    

            const userDocByName = doc(db, "users", name);
            const projectsMap = Object.entries(projects);
            if ( projectsMap.length == 0 ){
              projects["1"] = newProjects;              
              await updateDoc(userDocByName, {
                projects: projects
              });
              console.log("ok new project set");
            } else {
              const projectsMap = Object.entries(projects);

              // get last project id
              const projectsId = projectsMap.length;
              const newProjectsId = parseInt(parseInt(projectsId)+1);

              projects[newProjectsId] = newProjects;
              // console.log(typeof(newProjectsId));
              await updateDoc(userDocByName, {
                projects: projects
              });
              console.log("not new project but set");
            }
        
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
 

            {/* Main */}
            <div className="create-project">Welcome to create Project</div>
            <button onClick={createNewProject}>Create</button>

            {/* Get all data about self project and save this last one into Firebase / Firestore */}
            
            
            
        </>
    );
    
};

export default Create_project;
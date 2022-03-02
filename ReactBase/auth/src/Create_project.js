import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, setDoc, updateDoc, addDoc} from "firebase/firestore"; 

import { getDatabase, ref, set } from "firebase/database"
import Dashboard from "./Dashboard";

import "./Create_project.css";

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

    // Dashborad call (les variables)
    const [projectName, setProjectName] = useState("");
    const [responsableName, setResponsableName] = useState("");
    const [dateIn, setDateIn] = useState("");
    const [dateOut, setDateOut] = useState("");
    const [description, setDescription] = useState("");

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
    
    // set new project
    const newProjects = {'name': projectName,'responsable': responsableName,'date_in': dateIn,'date_out': dateOut,'description': description};    

    const createNewProject = async () => {        
        try {    

            // onst q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const userDocByName = doc(db, "users", name);
            const projectsMap = Object.entries(projects);
            // console.log(projectsMap[0][0]);
            if ( !projectsMap[0][0] ){
              projects["1"] = newProjects;              
              await updateDoc(userDocByName, {
                projects: projects
              });
              console.log("ok new project");
            } else {
              const projectsMap = Object.entries(projects);
              // get last project id
              const projectsId = projectsMap[projectsMap.length -1][0];
              const newProjectsId = parseInt(parseInt(projectsId)+1);

              projects[newProjectsId] = newProjects;
              // console.log(typeof(newProjectsId));
              await updateDoc(userDocByName, {
                projects: projects
              });
              console.log("not first project");
            }
        
          } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    
        // createNewProject();
    }, [user, loading]);

    return (
        <>            
            {/* <input id="number" 
                type="time" 
                onChange={(evt) => { setProjectName(evt.target.value); console.log(projectName)}}>
            </input> */}
            
            {/* Main */}
            {/* <div className="create-project">Welcome to create Project</div>
            <button onClick={createNewProject}>Create</button> */}
            <link href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"></link>

            <div className="form">
              <form>
                <div className="title">Nouveau projet</div>
                <div className="inputs">
                  <input type="text" placeholder="Nom du projet"></input>
                  <input type="text" placeholder="Responsable"></input>
                  <input type="date" placeholder="Date de debut"></input>
                  <input type="date" placeholder="Date de fin"></input>
                  <input type="text" placeholder="Description"></input>
                </div>

                <div>
                  <button href={`/project?$`} onClick={createNewProject} className="ok" type="submit">Ok</button>                  
                  <button className="annuler" type="submit">Annuler</button>
                  <button className="help" type="submit">Help</button>
                </div>
              </form>
            </div>

        </>
    );
    
};

export default Create_project;
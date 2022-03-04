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

    // Dashborad call les variables
    const [projects, setProjects] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    // const [projects, setProjects] = useState("");
    const [projectName, setProjectName] = useState("");
    const [responsable, setResponsable] = useState("");
    const [date_start, setDateStart] = useState("");
    const [date_end, setDateEnd] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
      
        fetchUserProject()
        fetchUserName();
    }, [user, loading]);
    
    // le project map
    // 'task': {
    //   'id': 0,
    //   'label': '',
    //   'date_start': '',
    //   'date_end': '',
    //   'precedent': 0
    // }
    const newProjects = {
        'name': '',
        'responsable': '',
        'date-start': '',
        'date_end': '',
        'description': ''
    };
    
    const createNewProject = async () => {        
      try {
            
            const newProjects = {
                'name': projectName,
                'responsable': responsable,
                'date-start': date_start,
                'date_end': date_end,
                'description': description
            };

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
            {/* <div className="create-project">Welcome to create Project</div>
            <button onClick={createNewProject}>Create</button> */}

            {/* Get all data about self project and save this last one into Firebase / Firestore */}
            
            <div className="form">
              {/* <form> */}
                <h5>Nouveau projet</h5>
                <div className="inputs">
                  <input onChange={(e) => setProjectName(e.target.value)} type="text" placeholder="Nom du projet" title="Donner un nom au projet"></input>
                  <input onChange={(e) => setResponsable(e.target.value)} type="text" placeholder="Responsable" title="Donner le nom du responsable"></input>
                  <input onChange={(e) => setDateStart(e.target.value)} type="date" placeholder="Date de debut" title="Choisisser la date de debut"></input>
                  <input onChange={(e) => setDateEnd(e.target.value)} type="date" placeholder="Date de fin" title="Choisisser la date de fin"></input>
                  <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Description" title="Donner une description au projet"></input>
                </div>

                <div className="valide">
                  <button onClick={createNewProject} className="ok" type="submit">Ok</button>
                  <button className="annuler" type="submit">Annuler</button>
                  <button className="help" type="submit">Aide</button>
                </div>
              {/* </form> */}
            </div>
            
            
        </>
    );
    
};

export default Create_project;
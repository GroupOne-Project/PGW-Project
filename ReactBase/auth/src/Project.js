import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import "./Project.css";

import jsPERT from "js-pert";
import { Gantt, DefaultTheme, MaterialTheme } from "@dhtmlx/trial-react-gantt";

function Project() {

    const print = async () => {      
      window.print();
    };

    // pert

    // gantt
    // const tasks = [
    //     {
    //       id: 'Task 1',
    //       name: 'Redesign website',
    //       start: '2016-12-28',
    //       end: '2016-12-31',
    //       progress: 20,
    //       dependencies: 'Task 2, Task 3',
    //       custom_class: 'bar-milestone' // optional
    //     },        
    // ]    
    // const gantt = new Gantt("#gantt", tasks);
    // console.log(gantt);

    // console.log(window.location.pathname);    
    const projectId = window.location.href.split('?')[1][0];
    console.log("ok");
    console.log(projectId);

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();        
    const [name, setName] = useState("");
    const [projects, setProjects] = useState("");
    const [projectsAfterDel, setProjectsAfterDel] = useState("");
    
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


    const deleteUserProject = async () => {
        // delete user project by id
        const projectToDeleteId = parseInt(projectId);        
        console.log("id to del",projectToDeleteId);
        // const cityRef = doc(db, 'cities', 'BJ');
        // Remove the 'capital' field from the document
        // await updateDoc(cityRef, {
          // projects: deleteField()
        // });
        try {                
            const projectsAfterDel = {};

            const userDocByName = doc(db, "users", name);
            const projectsMap = Object.entries(projects);            
            console.log("all");
            console.log(projectsMap);
            console.log(typeof(projectsMap));
            
            // le map est en fait un tableau ou chaqke id est la pos dans le tableau
            for( var i = 0; i < projectsMap.length; i++){             
                if ( projectsMap[i][0] == projectToDeleteId ) {                     
                    projectsMap.splice(i, 1);
                    console.log('ok dell');
                }            
            }

            for( var i = 0; i < projectsMap.length; i++){             
                projectsAfterDel[projectsMap[i][0]] = projectsMap[i][1]
            }
            // console.log(projectsAfterDel);

            await updateDoc(userDocByName, {
                projects: projectsAfterDel
            });
            console.log('dell');
            alert("Projet supprimer avec succes, Vous pouvez retourner au Menu");
            alert("")

          } catch (err) {
            console.error(err);
            console.log(err.message);
        }
    };

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
        fetchUserName();
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
            <>

        {/* ---------header-------------- */}
        <header className="header-dash">
          <div className="header-logo">
            <a href="/" className="logo">
              <img alt="" src="images/icone/logo.svg"></img>
            </a>
          </div>

          <div className="nav">
            <ul className="navigation">
                <li><button><Link className="acc" to="/dashboard">Acceuil</Link></button></li>
                <li><button>A Propos</button></li>
                <li><button>Langue</button></li>
                <li><button onClick={logout}>
                  Se deconcter
                  </button>
                </li>
            </ul>
          </div>

          {/* <div className="search-box">
            <input className="search-btn" type="text" placeholder="Rechercher"></input>
            <a className="search-btn" href="#">
              <img alt="" src="images/icone/search.png" ></img>
            </a>
          </div> */}

          <div className="toggle">
          <i className="ouvrir"><img alt="" src="icone/menu.png"></img></i>
           <i className="fermer"><img alt="" src="icone/fermer-la-croix.png"></img></i>
          </div>
        </header>
        {/* ------------- */}                

                <div className="ap-sup">
                    <button onClick={print} className="ap">Exporter</button>
                    <button className="sup" onClick={(event) => [deleteUserProject()]}>Supprimer</button>
                </div>

        {/* ----------gantt------------ */}
        <div>
            <DefaultTheme />

            <div class="wx-default">
                <Gantt />
                {/* <Gantt scales={scales} columns={columns} tasks={tasks} links={links} /> */}
            </div>       
        </div>
        {/* ------------------------- */}

        </>
        );
    }

}

export default Project;
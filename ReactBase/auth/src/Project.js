import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import "./Project.css";
// import Ganttt from "./Ganttt";

import jsPERT from "js-pert";
import { Gantt, DefaultTheme, MaterialTheme } from "@dhtmlx/trial-react-gantt";
import { async } from "@firebase/util";

function Project() {

      // les inputs de task
      const [taskName, setTaskName] = useState("");
      const [duration, setTaskDuration] = useState("");
      const [start, setTaskStart] = useState("2011-01-11");
      var starts = "2022-03-12";
      // setTaskStart(starts);
      const [end, setTaskEnd] = useState("2011-01-11");
      const [predecessors, setTaskPrec] = useState("");
      const [progression, setTaskProgression] = useState("");    

    const print = async () => {     
      const content = document.getElementsByClassName('wx-default');
      console.log(content);
      window.print(content.innerHTML);
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


    const scales = [
      { unit: "month", step: 1, format: "MMMM yyy" },
      { unit: "day", step: 1, format: "d" },
  ];
   
  const columns = [
      { name: "text", label: "Tache", width: "100%" },
      { name: "start", label: "Debut", align: "center" },   
      { name: "duration", label: "Durrée", width: "70px", align: "center" },
      // { name: "add-task", label: "", width: "50px", align: "center" },
  ];

  const tasks = [
    {
        id: 1,
        open: true,
        start_date: "2022-03-09",
        duration: 2,
        text: "tache 1",
        progress: 60,
        type: "project",
    },
    {
        id: 2,
        // open: true,
        parent: 1,
        start_date: "2022-03-10",
        duration: 4,
        text: "tache 2",
        progress: 10,
    },
  //   {
  //     id: 3,
  //     parent: 2,
  //     start_date: "2022-03-09",
  //     duration: 5,
  //     text: "do",
  //     progress: 80,
  // },
  
];
  
  const trueTasks = [
      {
          id: 1,
          // open: true,
          start_date: start,
          duration: duration,
          text: taskName,
          progress: progression,
          type: "project",
      },      
    
  ];  
   
    const links = [{ source: 3, target: 1, type: 0 }];    

    // console.log(window.location.pathname);    
    const projectId = window.location.href.split('?')[1][0];
    // console.log("ok");
    console.log(projectId);
    
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();        
    const [name, setName] = useState("");
    const [projects, setProjects] = useState("");
    const [projectsTask, setProjectsTask] = useState("");
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

      const run = async () => {   
        const star = document.getElementById("star").value;
        alert("Le Gantt se genere automatiquement remplissez juste le tableau");
        console.log(taskName);
        // alert(start);
      }
      
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
            setProjectsTask(data.projects.task);
            // console.log(projects[projectId].name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    }; 
    // console.log(projects[projectId]);

    // fetch true task
    console.log(projectsTask);
    // const trueTasks = projectsTask;

    // update on firebase
    const updateProjectstask = async () => {
      projects["task"] = trueTasks;
      console.log(projects);
      const userDocByName = doc(db, "users", name);
      const projectsMap = Object.entries(projects);
      await updateDoc(userDocByName, {
        projects: projects
      });
      alert("Sauvegarde termine");
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");

        fetchUserProject();
        fetchUserName();
        // updateProjectstask();
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
        // console.log("yes");

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
                    <div className="project-fetch">
                      <div className="project-name">Projet: {projects[projectId].name}</div>          
                      <div className="project-resp">Responsable: {projects[projectId].responsable}</div>
                      <div className="project-date-start">Debut du projet: {projects[projectId].date_start}</div>
                      <div className="project-date-start">Debut du projet: {projects[projectId].date_end}</div>          
                    </div>  
                    <div className="run">
                      <button onClick={updateProjectstask} className="run-btn">Enregistrer</button>
                      <button onClick={print} className="ap">Exporter</button>
                      <button className="sup" onClick={(event) => [deleteUserProject()]}>Supprimer</button>
                    </div>                    
                </div>

        {/* ----------gantt------------ */}
        <div>
          <div className="wbs-title">WBS</div>
        <div className="input-taches">
                <div class="container">
    <div class="tableau">
      <table summary="Editable table with datasets ordered in columns" class="table-fill">  
        <tbody className="tbody">
          
          <tr className="tr" >  
            <th className="th" scope="col"> Nom de la tache </th>  
            <th className="th" scope="col"> Duree / jours</th>  
            <th className="th" scope="col"> Date debut </th>  
            <th className="th" scope="col"> Date fin </th> 
            <th className="th" scope="col"> Predecesseur </th>  
            <th className="th" scope="col"> Progression </th>  
      
          </tr>  
          <tr className="tr" >  
              <td className="td"><input onChange={(e) => setTaskName(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskDuration(e.target.value)} type="number"></input></td>
              <td className="td"><input onChange={(e) => setTaskStart(e.target.value)} defaultValue="2011-01-11" id="star" type="date"></input></td>
              <td className="td"><input defaultValue="2022-01-11" onChange={(e) => setTaskEnd(e.target.value)} type="date"></input></td>
              <td className="td"><input onChange={(e) => setTaskPrec(e.target.value)} type="number"></input></td>
              <td className="td"><input onChange={(e) => setTaskProgression(e.target.value)} type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr> 
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr> 
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="text"></input></td>
              <td className="td"><input type="number"></input></td>
              <td className="td"><input type="number"></input></td>
          </tr>                               
        </tbody>  
      </table> 
    </div>
  </div>
</div>

  {/* <div className="run"><button onClick={run} className="run-btn">Gantt ...</button></div> */} 
            <DefaultTheme />

            <div class="wx-default">
                <div className="gantt-title">GANTT</div>
                {/* <Gantt /> */}                
                <Gantt scales={scales} columns={columns} tasks={trueTasks} links={links} />
            </div>       
        </div>
        <div className="paginator"></div>
        {/* ------------------------- */}        

        </>
        );
    }

}

export default Project;
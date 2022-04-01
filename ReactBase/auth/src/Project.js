import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import "./Project.css";
// import Ganttt from "./Ganttt";

import jsPERT from "js-pert";
import * as go from "gojs"
import { ReactDiagram } from 'gojs-react';
import $ from "jquery";
import { Gantt, DefaultTheme, MaterialTheme } from "@dhtmlx/trial-react-gantt";
import { async } from "@firebase/util";


function initDiagram() {
    // colors used, named for easier identification
    var blue = "#0288D1";
    var pink = "#B71C1C";
    var pinkfill = "#F8BBD0";
    var bluefill = "#B3E5FC";

  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram =
    $(go.Diagram,
      {
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.LayeredDigraphLayout),
        'undoManager.isEnabled': true,  // must be set to allow for model change listening
        // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: new go.GraphLinksModel(
          {
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          })
      });

  // define a simple Node template
  diagram.nodeTemplate =
    $(go.Node, 'Auto',  // the Shape will go around the TextBlock
    $(go.Shape, "Rectangle",  // the border
    { fill: "white", strokeWidth: 2 },
    new go.Binding("fill", "critical", b => b ? pinkfill : bluefill),
    new go.Binding("stroke", "critical", b => b ? pink : blue)),
  $(go.Panel, "Table",
    { padding: 0.5 },
    $(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
    $(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
    $(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: "white", coversSeparators: true }),
    $(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
    $(go.TextBlock, // earlyStart
      new go.Binding("text", "earlyStart"),
      { row: 0, column: 0, margin: 5, textAlign: "center" }),
    $(go.TextBlock,
      new go.Binding("text", "length"),
      { row: 0, column: 1, margin: 5, textAlign: "center" }),
    $(go.TextBlock,  // earlyFinish
      new go.Binding("text", "",
        d => (d.earlyStart + d.length).toFixed(2)),
      { row: 0, column: 2, margin: 5, textAlign: "center" }),

    $(go.TextBlock,
      new go.Binding("text", "text"),
      {
        row: 1, column: 0, columnSpan: 3, margin: 5,
        textAlign: "center", font: "bold 14px sans-serif"
      }),

    $(go.TextBlock,  // lateStart
      new go.Binding("text", "",
        d => (d.lateFinish - d.length).toFixed(2)),
      { row: 2, column: 0, margin: 5, textAlign: "center" }),
    $(go.TextBlock,  // slack
      new go.Binding("text", "",
        d => (d.lateFinish - (d.earlyStart + d.length)).toFixed(2)),
      { row: 2, column: 1, margin: 5, textAlign: "center" }),
    $(go.TextBlock, // lateFinish
      new go.Binding("text", "lateFinish"),
      { row: 2, column: 2, margin: 5, textAlign: "center" })
  )  // end Table Panel
    );

    function linkColorConverter(linkdata, elt) {
      var link = elt.part;
      if (!link) return blue;
      var f = link.fromNode;
      if (!f || !f.data || !f.data.critical) return blue;
      var t = link.toNode;
      if (!t || !t.data || !t.data.critical) return blue;
      return pink;  // when both Link.fromNode.data.critical and Link.toNode.data.critical
    }
    diagram.linkTemplate =
        $(go.Link,
          { toShortLength: 6, toEndSegmentLength: 20 },
          $(go.Shape,
            { strokeWidth: 4 },
            new go.Binding("stroke", "", linkColorConverter)),
          $(go.Shape,  // arrowhead
            { toArrow: "Triangle", stroke: null, scale: 1.5 },
            new go.Binding("fill", "", linkColorConverter))
        );
    const nodeDataArray=[
          { key: 1, text: "Start", length: 0, earlyStart: 0, lateFinish: 0, critical: true },
          { key: 2, text: "a", length: 4, earlyStart: 0, lateFinish: 4, critical: true },
          { key: 3, text: "b", length: 5.33, earlyStart: 0, lateFinish: 9.17, critical: false },
          { key: 4, text: "c", length: 5.17, earlyStart: 4, lateFinish: 9.17, critical: true },
          { key: 5, text: "d", length: 6.33, earlyStart: 4, lateFinish: 15.01, critical: false },
          { key: 6, text: "e", length: 5.17, earlyStart: 9.17, lateFinish: 14.34, critical: true },
          { key: 7, text: "f", length: 4.5, earlyStart: 10.33, lateFinish: 19.51, critical: false },
          { key: 8, text: "g", length: 5.17, earlyStart: 14.34, lateFinish: 19.51, critical: true },
          { key: 9, text: "Finish", length: 0, earlyStart: 19.51, lateFinish: 19.51, critical: true }
        ];
    const linkDataArray=[
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 },
          { from: 3, to: 6 },
          { from: 4, to: 6 },
          { from: 5, to: 7 },
          { from: 6, to: 8 },
          { from: 7, to: 9 },
          { from: 8, to: 9 }
        ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, "Rectangle",  // the border
          { fill: bluefill }),
        $(go.Panel, "Table",
          $(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
          $(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
          $(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: bluefill, coversSeparators: true }),
          $(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
          $(go.TextBlock, "Early Start",
            { row: 0, column: 0, margin: 5, textAlign: "center" }),
          $(go.TextBlock, "Length",
            { row: 0, column: 1, margin: 5, textAlign: "center" }),
          $(go.TextBlock, "Early Finish",
            { row: 0, column: 2, margin: 5, textAlign: "center" }),

          $(go.TextBlock, "Activity Name",
            {
              row: 1, column: 0, columnSpan: 3, margin: 5,
              textAlign: "center", font: "bold 14px sans-serif"
            }),

          $(go.TextBlock, "Late Start",
            { row: 2, column: 0, margin: 5, textAlign: "center" }),
          $(go.TextBlock, "Slack",
            { row: 2, column: 1, margin: 5, textAlign: "center" }),
          $(go.TextBlock, "Late Finish",
            { row: 2, column: 2, margin: 5, textAlign: "center" })
        )  // end Table Panel
      ));
  
      
      return diagram;
    }
    window.addEventListener('DOMContentLoaded', initDiagram);


/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
 function handleModelChange(changes) {
  // alert('GoJS model changed!');
}

function Project() {

      // les inputs de task
      const [taskName, setTaskName] = useState("");
      const [duration, setTaskDuration] = useState("");
      const [start, setTaskStart] = useState("2022-04-11");
      var starts = "2022-03-12";
      // setTaskStart(starts);
      const [end, setTaskEnd] = useState("2022-04-17");
      const [predecessors, setTaskPrec] = useState("");
      const [progression, setTaskProgression] = useState(""); 
      // -----------------------------------------------------------
      const [taskName1, setTaskName1] = useState("");
      const [duration1, setTaskDuration1] = useState("");
      const [start1, setTaskStart1] = useState("2022-04-11");
      // setTaskStart(starts);
      const [end1, setTaskEnd1] = useState("2022-04-17");
      const [predecessors1, setTaskPrec1] = useState(1);
      const [progression1, setTaskProgression1] = useState(""); 
      // -----------------------------------------------------------
      const [taskName2, setTaskName2] = useState("");
      const [duration2, setTaskDuration2] = useState("");
      const [start2, setTaskStart2] = useState("2022-04-11");
      // setTaskStart(starts);
      const [end2, setTaskEnd2] = useState("2022-04-17");
      const [predecessors2, setTaskPrec2] = useState(2);
      const [progression2, setTaskProgression2] = useState(""); 
      // -----------------------------------------------------------
      const [taskName3, setTaskName3] = useState("");
      const [duration3, setTaskDuration3] = useState("");
      const [start3, setTaskStart3] = useState("2022-04-11");
      // setTaskStart(starts);
      const [end3, setTaskEnd3] = useState("2022-04-17");
      const [predecessors3, setTaskPrec3] = useState(3);
      const [progression3, setTaskProgression3] = useState(""); 

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
      {
        id: 2,
        // open: true,
        start_date: start1,
        duration: duration1,
        text: taskName1,
        progress: progression1,
        // parent: predecessors1,
        source: predecessors1,
      },
      {
        id: 3,
        // open: true,
        start_date: start2,
        duration: duration2,
        text: taskName2,
        progress: progression2,
        // parent: predecessors2,
        source: predecessors2,
      },  
      {
        id: 4,
        // open: true,
        start_date: start3,
        duration: duration3,
        text: taskName3,
        progress: progression3,
        // parent: predecessors3, 
        source: predecessors3,       
      },      
    
  ];  

  console.log(trueTasks);
   
    const links = [{ target: 1, type: 0 }];    

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
      console.log(projectId);
      const projectIdMap = projects[projectId];      
      projectIdMap["task"] = trueTasks;
      console.log(projectIdMap);
      projects[projectId] = projectIdMap;
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
                <li><button><a href="/dashboard">Acceuil</a></button></li>
                {/* <li><button>A Propos</button></li> */}
                {/* <li><button>Langue</button></li> */}
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
                      {/* <div className="project-name"><li>Projet: {projects[projectId].name}</li></div>          
                      <div className="project-resp"><li>Responsable: {projects[projectId].responsable}</li></div>
                      <div className="project-date-start"><li>Date de debut: {projects[projectId].date_start}</li></div>
                      <div className="project-date-start"><li>Date de fin: {projects[projectId].date_end}</li></div>           */}
                    </div>  
                    <div className="run">
                      {/* <button className="run-btn">Enregistrer</button> */}
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
            <th className="th" scope="col"> Date debut </th>  
            <th className="th" scope="col"> Duree / jours</th>  
            {/* <th className="th" scope="col"> Date fin </th>  */}
            <th className="th" scope="col"> Progression </th>  
            <th className="th" scope="col"> Predecesseur </th>  
      
          </tr>  
          <tr className="tr" >  
              <td className="td"><input onChange={(e) => setTaskName(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskStart(e.target.value)} defaultValue="2022-04-11" id="star" type="date"></input></td>
              <td className="td"><input onChange={(e) => setTaskDuration(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd(e.target.value)} type="date"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskProgression(e.target.value)} type="number"></input></td>
              <td className="td"><input onChange={(e) => setTaskPrec(e.target.value)} type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input onChange={(e) => setTaskName1(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskStart1(e.target.value)} defaultValue="2022-04-11" id="star" type="date"></input></td>
              <td className="td"><input onChange={(e) => setTaskDuration1(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd1(e.target.value)} type="date"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskProgression1(e.target.value)} type="number"></input></td>
              <td className="td"><input onChange={(e) => setTaskPrec1(e.target.value)} type="number"></input></td>
          </tr>   
          <tr className="tr" >  
              <td className="td"><input onChange={(e) => setTaskName2(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskStart2(e.target.value)} defaultValue="2022-04-11" id="star" type="date"></input></td>
              <td className="td"><input onChange={(e) => setTaskDuration2(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd2(e.target.value)} type="date"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskProgression2(e.target.value)} type="number"></input></td>
              <td className="td"><input onChange={(e) => setTaskPrec2(e.target.value)} type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input onChange={(e) => setTaskName3(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskStart3(e.target.value)} defaultValue="2022-04-11" id="star" type="date"></input></td>
              <td className="td"><input onChange={(e) => setTaskDuration3(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd3(e.target.value)} type="date"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskProgression3(e.target.value)} type="number"></input></td>
              <td className="td"><input onChange={(e) => setTaskPrec3(e.target.value)} type="number"></input></td>
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

        <div className="pert-title">PERT</div>
        <div className="pert" class="p-4 w-full">
        <div>      
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'        
        
        onModelChange={handleModelChange}
      />      
    </div>
        </div>

        </>
        );
    }

}

export default Project;
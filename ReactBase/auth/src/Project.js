import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import "./Project.css";
// import Ganttt from "./Ganttt";

// import jsPERT from "js-pert";
import * as go from "gojs"
import { ReactDiagram } from 'gojs-react';
// import $ from "jquery";
import { Gantt, DefaultTheme, MaterialTheme } from "@dhtmlx/trial-react-gantt";
// import { async } from "@firebase/util";

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
   
    // diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, "Rectangle",  // the border
          { fill: bluefill }),
        $(go.Panel, "Table",
          $(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
          $(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
          $(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: bluefill, coversSeparators: true }),
          $(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
          // $(go.TextBlock, "Early Start",
          //   { row: 0, column: 0, margin: 5, textAlign: "center" }),
          // $(go.TextBlock, "Length",
          //   { row: 0, column: 1, margin: 5, textAlign: "center" }),
          // $(go.TextBlock, "Early Finish",
          //   { row: 0, column: 2, margin: 5, textAlign: "center" }),

          // $(go.TextBlock, "Activity Name",
          //   {
          //     row: 1, column: 0, columnSpan: 3, margin: 5,
          //     textAlign: "center", font: "bold 14px sans-serif"
          //   }),

          // $(go.TextBlock, "Late Start",
          //   { row: 2, column: 0, margin: 5, textAlign: "center" }),
          // $(go.TextBlock, "Slack",
          //   { row: 2, column: 1, margin: 5, textAlign: "center" }),
          // $(go.TextBlock, "Late Finish",
          //   { row: 2, column: 2, margin: 5, textAlign: "center" })
        )  // end Table Panel
      ));
  
      
      return diagram;
    }
    setTimeout(() =>  {
      window.addEventListener('DOMContentLoaded', initDiagram);
    }, 2000)

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
//  function handleModelChange(changes) {
//   alert('GoJS model changed!');
// }

function Project() {

      // console.log(window.location.pathname);    
      const projectId = (window.location.href.split('?')[1][0]);
      // console.log("ok");
      console.log(typeof(projectId));
      console.log(projectId);
    
      const [user, loading, error] = useAuthState(auth);
      const navigate = useNavigate();        
      const [name, setName] = useState("");
      const [projects, setProjects] = useState("");
      const [projectsTask, setProjectsTask] = useState("");
      const [projectsAfterDel, setProjectsAfterDel] = useState("");

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
      const [predecessors1, setTaskPrec1] = useState("");
      const [progression1, setTaskProgression1] = useState(""); 
      // -----------------------------------------------------------
      const [taskName2, setTaskName2] = useState("");
      const [duration2, setTaskDuration2] = useState("");
      const [start2, setTaskStart2] = useState("2022-04-11");
      // setTaskStart(starts);
      const [end2, setTaskEnd2] = useState("2022-04-17");
      const [predecessors2, setTaskPrec2] = useState("");
      const [progression2, setTaskProgression2] = useState(""); 
      // -----------------------------------------------------------
      const [taskName3, setTaskName3] = useState("");
      const [duration3, setTaskDuration3] = useState("");
      const [start3, setTaskStart3] = useState("2022-04-11");
      // setTaskStart(starts);
      const [end3, setTaskEnd3] = useState("2022-04-17");
      const [predecessors3, setTaskPrec3] = useState("");
      const [progression3, setTaskProgression3] = useState(""); 
      // -----------------------------------------------------------
      const [taskName4, setTaskName4] = useState("");
      const [duration4, setTaskDuration4] = useState("");
      const [start4, setTaskStart4] = useState("2022-04-11");
      // setTaskStart(starts);
      const [end4, setTaskEnd4] = useState("2022-04-17");
      const [predecessors4, setTaskPrec4] = useState("");
      const [progression4, setTaskProgression4] = useState(""); 
      // -----------------------------------------------------------
      const [critical0, setCritical0] = useState(false);

    const print = async () => {     
      const content = document.getElementsByClassName('wx-default');
      console.log(content);
      window.print(content.innerHTML);
    };

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
      {
        id: 5,
        // open: true,
        start_date: start4,
        duration: duration4,
        text: taskName4,
        progress: progression4,
        // parent: predecessors3, 
        source: predecessors4,       
      },      
    
  ];
  
  // ?s
  const critixal  = async () => {
    if (duration < 50) {
      setCritical0(true);
    }
  }

  // console.log(trueTasks);
   
    const links = [{ target: 1, type: 0 }];    

    
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

          } catch (err) {
            console.error(err);
            console.log(err.message);
        }
    };

    // fetch user project who id == project.id
    const fetchUserProject = async () => {
        try {
            console.log("pro",projectId);
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();            
            setProjects(data.projects);  
            if ( data.projects[projectId].task != undefined ) {                          
              console.log(data.projects[projectId].task[0]);     
              // setProjectsTask(data.projects[projectId].task);
              // setProjectsTask(data.projects.task);
              // console.log(projects[projectId].name);            
              // console.log(projectsTask);
              setTaskName((data.projects[projectId].task[0]).text);
              setTaskDuration(data.projects[projectId].task[0].duration);
              setTaskStart((data.projects[projectId].task[0].start_date));           
              setTaskProgression(parseInt(data.projects[projectId].task[0].progress));
              setTaskPrec(parseInt(data.projects[projectId].task[0].parent))
              
              setTaskName1(data.projects[projectId].task[1].text);
              setTaskDuration1(data.projects[projectId].task[1].duration);
              setTaskStart1((data.projects[projectId].task[1].start_date));           
              setTaskProgression1(parseInt(data.projects[projectId].task[1].progress));
              setTaskPrec1(parseInt(data.projects[projectId].task[1].parent))

              setTaskName2(data.projects[projectId].task[2].text);
              setTaskDuration2(data.projects[projectId].task[2].duration);
              setTaskStart2((data.projects[projectId].task[2].start_date));           
              setTaskProgression2(parseInt(data.projects[projectId].task[2].progress));
              setTaskPrec2(parseInt(data.projects[projectId].task[2].parent))

              setTaskName3(data.projects[projectId].task[3].text);
              setTaskDuration3(data.projects[projectId].task[3].duration);
              setTaskStart3((data.projects[projectId].task[3].start_date));           
              setTaskProgression3(parseInt(data.projects[projectId].task[3].progress));
              setTaskPrec3(parseInt(data.projects[projectId].task[3].parent))

              setTaskName4(data.projects[projectId].task[4].text);
              setTaskDuration4(data.projects[projectId].task[4].duration);
              setTaskStart4((data.projects[projectId].task[4].start_date));           
              setTaskProgression4(parseInt(data.projects[projectId].task[4].progress));
              setTaskPrec4(parseInt(data.projects[projectId].task[4].parent))
            }
            console.log(predecessors4);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };     

    // update on firebase
    const updateProjectstask = async () => {
      console.log(projectId);
      const projectIdMap = projects[projectId];   
      const trueTasksFinal = [
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
          parent: predecessors1,
          source: predecessors1,
        },
        {
          id: 3,
          // open: true,
          start_date: start2,
          duration: duration2,
          text: taskName2,
          progress: progression2,
          parent: predecessors2,
          source: predecessors2,
        },  
        {
          id: 4,
          // open: true,
          start_date: start3,
          duration: duration3,
          text: taskName3,
          progress: progression3,
          parent: predecessors3, 
          source: predecessors3,       
        },    
        {
          id: 5,
          // open: true,
          start_date: start4,
          duration: duration4,
          text: taskName4,
          progress: progression4,
          parent: predecessors3, 
          source: predecessors4,       
        },      
      
    ];   
      projectIdMap["task"] = trueTasksFinal;
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
        
        fetchUserName();
        fetchUserProject();        
        // updateProjectstask();        
        // fetchUsertask();
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
                  Se deconnecter
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
              <td className="td"><input defaultValue={taskName} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input onChange={(e) => setTaskStart(e.target.value)} defaultValue={start} id="star" type="date"></input></td>
              <td className="td"><input defaultValue={duration} onChange={(e) => setTaskDuration(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd(e.target.value)} type="date"></input></td> */}
              <td className="td"><input defaultValue={progression} onChange={(e) => setTaskProgression(e.target.value)} type="number"></input></td>
              <td className="td"><input defaultValue={predecessors} onChange={(e) => setTaskPrec(e.target.value)} type="number"></input></td>
          </tr>  
          <tr className="tr" >  
              <td className="td"><input defaultValue={taskName1} onChange={(e) => setTaskName1(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input defaultValue={start1} onChange={(e) => setTaskStart1(e.target.value)} id="star" type="date"></input></td>
              <td className="td"><input defaultValue={duration1} onChange={(e) => setTaskDuration1(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd1(e.target.value)} type="date"></input></td> */}
              <td className="td"><input defaultValue={progression1} onChange={(e) => setTaskProgression1(e.target.value)} type="number"></input></td>
              <td className="td"><input defaultValue={predecessors1} onChange={(e) => setTaskPrec1(e.target.value)} type="number"></input></td>
          </tr>   
          <tr className="tr" >  
              <td className="td"><input defaultValue={taskName2} onChange={(e) => setTaskName2(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input defaultValue={start2} onChange={(e) => setTaskStart2(e.target.value)} id="star" type="date"></input></td>
              <td className="td"><input defaultValue={duration2} onChange={(e) => setTaskDuration2(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd1(e.target.value)} type="date"></input></td> */}
              <td className="td"><input defaultValue={progression2} onChange={(e) => setTaskProgression2(e.target.value)} type="number"></input></td>
              <td className="td"><input defaultValue={predecessors2} onChange={(e) => setTaskPrec2(e.target.value)} type="number"></input></td>
          </tr>   
          <tr className="tr" >  
              <td className="td"><input defaultValue={taskName3} onChange={(e) => setTaskName3(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input defaultValue={start3} onChange={(e) => setTaskStart3(e.target.value)} id="star" type="date"></input></td>
              <td className="td"><input defaultValue={duration3} onChange={(e) => setTaskDuration3(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd1(e.target.value)} type="date"></input></td> */}
              <td className="td"><input defaultValue={progression3} onChange={(e) => setTaskProgression3(e.target.value)} type="number"></input></td>
              <td className="td"><input defaultValue={predecessors3} onChange={(e) => setTaskPrec3(e.target.value)} type="number"></input></td>
          </tr>   
          <tr className="tr" >  
              <td className="td"><input defaultValue={taskName4} onChange={(e) => setTaskName4(e.target.value)} type="text"></input></td>
              {/* <td className="td"><input defaultValue={projectsTask[0].text} onChange={(e) => setTaskName(e.target.value)} type="text"></input></td> */}
              <td className="td"><input defaultValue={start4} onChange={(e) => setTaskStart4(e.target.value)} id="star" type="date"></input></td>
              <td className="td"><input defaultValue={duration4} onChange={(e) => setTaskDuration4(e.target.value)} type="number"></input></td>
              {/* <td className="td"><input defaultValue="2022-04-17" onChange={(e) => setTaskEnd1(e.target.value)} type="date"></input></td> */}
              <td className="td"><input defaultValue={progression4} onChange={(e) => setTaskProgression4(e.target.value)} type="number"></input></td>
              <td className="td"><input defaultValue={predecessors4} onChange={(e) => setTaskPrec4(e.target.value)} type="number"></input></td>
          </tr>                                     
        </tbody>  
      </table> 
    </div>
  </div>
</div>

  {/* <div className="run"><button onClick={run} className="run-btn">Gantt ...</button></div> */} 
            <DefaultTheme />

            <div className="wx-default">
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

        nodeDataArray={[
          { key: 1, text: taskName, length: 0, earlyStart: 0, lateFinish: 0, critical: false },
          { key: 2, text: taskName1, length: 4, earlyStart: 0, lateFinish: 4, critical: false },
          { key: 3, text: taskName2, length: 5.33, earlyStart: 0, lateFinish: 9.17, critical: false },
          { key: 4, text: taskName3, length: 5.17, earlyStart: 4, lateFinish: 9.17, critical: false },
          { key: 5, text: taskName4, length: 5.17, earlyStart: 4, lateFinish: 9.17, critical: false },
        ]}       
        linkDataArray={[
          { from: 0, to: 1 },
          { from: predecessors1, to: 2 },
          { from: predecessors2, to: 3 },
          { from: predecessors3, to: 4 },
          { from: predecessors4, to: 5 }
        ]}

      />      
    </div>
        </div>
        
        </>
        );
    }

}

export default Project;
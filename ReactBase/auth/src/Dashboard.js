import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { async } from "@firebase/util";

import { deleteDoc } from "firebase/firestore";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";

function Dashboard() {

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [projects, setProjects] = useState("");
  const [recentProjects, setRecentProjects] = useState("");
  const [recentProjectss, setRecentProjectss] = useState("");
  const navigate = useNavigate();


  const deleteUser = async () => {
    console.log("let's delet");    
  };


  // Fetch userProject when userID
  // const project = data.project;
  // console.log(project);
  const fetchUserProject = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setProjects(data.projects);
      console.log(data.projects)
      // get all recents projects id and name
      const recentProjects = [];
      for (var [key, value] of  Object.entries(data.projects)) {
        const e = `${key}: ${value["name"]}`;
        recentProjects.push(e);
        console.log(recentProjects);
      
      console.log(recentProjects);
      // retrun format of project recent
      const recentProjectss = recentProjects.map((recentProject) =>
          <div>                        
            <div class="blocitem">
                <div class="item1">
                  <button>
                    {/* route to project page fetching project id */}
                    <a className="recent-a" href={ `/project?${recentProject}` }>{recentProject.split(":")[1]}</a>
                  </button>
                </div>               
            </div>           
          </div>
          
          );

        setRecentProjects(recentProjectss);
      }
      // setRecentProjects(recentProjects);
     
      if (recentProjects == 0) {
        console.log("pas")
        setRecentProjects("vide");
      }

    } catch (err) {
      console.error(err);
      alert("Problème de connexion");
    }
  }; 

  // Fetch userName when userID
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

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserProject();
    fetchUserName();
  }, [user, loading]);

  return (
    <>    
      {/* Main */}
      <div className="main-dash">

        {/* ---------header-------------- */}
        <header className="header-dash">
          <div className="header-logo">
            <a href="/" className="logo">
              <img alt="" src="images/icone/logo.svg"></img>
            </a>
          </div>

          <div className="nav">
            <ul className="navigation">
            <li><button><a className="acceuil-dash" href="/dashboard">Acceuil</a></button></li>
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
          <i class="ouvrir"><img alt="" src="icone/menu.png"></img></i>
           <i class="fermer"><img alt="" src="icone/fermer-la-croix.png"></img></i>
          </div>
        </header>
        {/* ------------- */}

        {/* -------------main------------- */}
        <section className="home-dash">
        <div class="container-dash">
            <div class="item-dash"><button>
          <Link to="/create_project">CREER UN PROJET</Link>
        </button></div>            
        </div>
        
        <div class="container2">
          {/* User recents Project */}
          <div class="title">Projet recent</div>
            <div className="re">{recentProjects}</div>          
          </div>
        </section>
        {/* --------------main------------- */}

      </div>      

      {/* Dashboard */}
      {/* <div className="dashboard">
        <div className="dashboard__container">
          <div>Welcome</div>
          Logged in as
          <div>{name}</div>    
          <div>With email:</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
        <div>
          <button onClick={deleteUser}>Delete Account</button>
        </div>
      </div> */}    
    </>

  );
}

export default Dashboard;

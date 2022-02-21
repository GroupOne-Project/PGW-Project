import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";


function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [projects, setProjects] = useState("");
  const [recentProject, setRecentProjects] = useState("");
  const navigate = useNavigate();


  // Fetch userProject when userID
  // const project = data.project;
  // console.log(project);
  const fetchUserProject = async () => {

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const projects = doc.data().projects;      
      setProjects(projects)
      console.log(projects);
      const recentProject = projects["1"]["name"];
      setRecentProjects(recentProject)
    });
    
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
    {/* Dashboard */}
      <div className="dashboard">
        <div className="dashboard__container">
          <div>Welcome</div>
          Logged in as
          <div>{name}</div>
          {/* <div>{user?.email.split("@")[0]}</div> */}
          <div>With email:</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main */}
      <div className="main">
        <button>
          <Link to="/create_project">Create Project</Link>
        </button>
      </div>

      {/* User recents Project */}    
      <div>project recents : {recentProject}</div>


    </>
  );
}

export default Dashboard;

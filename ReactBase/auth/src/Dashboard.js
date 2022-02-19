import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

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
      <div>Your old project here</div>

      {/* read user project */}
      


    </>
  );
}

export default Dashboard;

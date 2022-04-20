import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./firebase";
import "./Register.css";


function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="register">
      <div className="form">
        <h1>INSCRIPTION</h1>
        <div className="inputs">
          <br></br>
          <label>Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Entrez votre nom"></input> 
          <label>Prenom</label>
          <input placeholder="Entrez votre prenom"></input>  
          <label >Sexe</label>
          <select><option >Femme</option><option>Homme</option></select>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Entrez votre email"></input>          
          <label>Mot de Passe</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="Entrez un mot de pass"></input>
        </div>

        <div className="btn">
          <div className="con">
            <button onClick={register}>S'inscrire</button>
          </div>
          <div className="con-google">
            <button onClick={signInWithGoogle}>S'inscrire avec Google</button>       
          </div>
        </div> 
        <div className="already">
          J'ai deja un compte <Link to="/Login">Me connecter</Link> meintenant.
        </div>      
      </div>

      {/* --------------------------------------- */}
      {/* <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}

          // setName on dashboard
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>

        <div>
          Already have an account? <Link to="/Login">Login</Link> now.
        </div>
      </div> */}
    </div>
  );
}

export default Register;

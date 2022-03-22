import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();  
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    // if user login go to dashboard
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="login">
      <div className="form">
        <h1>CONNEXION</h1>
        <div className="inputs">
          <br></br>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Entrez votre email"></input>          
          <label>Mot de Pass</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Entrez votre mot de pass"></input>
        </div>

        <div className="btn">
          <div className="con">
            <button onClick={() => logInWithEmailAndPassword(email, password)} type="submit">Se connecter</button>
          </div>
          <div className="con-google">
            <button onClick={signInWithGoogle} type="submit">Se connecter avec Google</button>
          </div>
        </div>
        <div className="forget">          
          <div className="forget-pass"><Link to="/reset">Mot de pass oublier</Link></div>
          <p>Je n'ai pas de compte <Link to="/register"> Créer un compte</Link></p>
        </div>
      </div>

      {/* <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div> */}
    </div>    
  );
}

export default Login;

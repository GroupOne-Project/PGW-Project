import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import Create_project from "./Create_project";
import Project from "./Project";

// Import each components of DOM
// Add route of each components of DOM

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/create_project" element={<Create_project />} />
          <Route exact path="/project" element={<Project />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

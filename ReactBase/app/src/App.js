import Register from './components/Register.js'
import './App.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDkp08kxPn4IZ74PeyH5S3iUZo6R7dEWY",
  authDomain: "reactbase-f9ce5.firebaseapp.com",
  projectId: "reactbase-f9ce5",
  storageBucket: "reactbase-f9ce5.appspot.com",
  messagingSenderId: "928559675325",
  appId: "1:928559675325:web:aba5bbbdae1b00579984d4"
};

function App() {
  return (
    <div className="App">
      <Register/>
    </div>
  );
}

export default App;
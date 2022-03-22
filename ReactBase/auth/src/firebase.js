import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  doc,
  setDoc,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

import { getDatabase, ref, set } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBDkp08kxPn4IZ74PeyH5S3iUZo6R7dEWY",
  authDomain: "reactbase-f9ce5.firebaseapp.com",
  projectId: "reactbase-f9ce5",
  storageBucket: "reactbase-f9ce5.appspot.com",
  messagingSenderId: "928559675325",
  appId: "1:928559675325:web:aba5bbbdae1b00579984d4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const projects = {};

// user projects
// const projects = {
// 'name': '',
// 'task': {
//   'id': 0,
//   'label': '',
//   'date_start': '',
//   'date_end': '',
//   'precedent': 0,}
// };

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    console.log(err.message);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {

  try {    
        
    // set on Firestore the user informations on user doc call {name}
    const userDoc = collection(db, "users");

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(userDoc, name), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      projects
    });

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};

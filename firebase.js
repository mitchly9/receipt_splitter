// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGuaJLfab6vqnF6PruvVpkRR-QDs5fZXI",
  authDomain: "costcosplitter.firebaseapp.com",
  projectId: "costcosplitter",
  storageBucket: "costcosplitter.appspot.com",
  messagingSenderId: "852670835257",
  appId: "1:852670835257:web:02a3673363428d3b41bbe8",
  measurementId: "G-LW7D4SG1TD",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytic/s(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };

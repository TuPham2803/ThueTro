// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpIHafT7WfBaZg36iDnv2QEdiZSl7dx1k",
  authDomain: "roomrental-da167.firebaseapp.com",
  projectId: "roomrental-da167",
  storageBucket: "roomrental-da167.appspot.com",
  messagingSenderId: "1064998633608",
  appId: "1:1064998633608:web:ec2d05898446f4bb389f3d",
  measurementId: "G-6XZQ6YHY6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
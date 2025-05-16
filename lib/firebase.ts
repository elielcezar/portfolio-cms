import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAC0gvpwHp9s4tgxEK0z_Os0s0pgtz_FyI",
    authDomain: "ecwd-e53bb.firebaseapp.com",
    projectId: "ecwd-e53bb",
    storageBucket: "ecwd-e53bb.firebasestorage.app",
    messagingSenderId: "639621795300",
    appId: "1:639621795300:web:5975427848533bf63e8bf1",
    measurementId: "G-2360LDNZ8Y"
};

// Reinicializar a aplicação Firebase
if (getApps().length) {
    getApps().forEach(app => deleteApp(app));
}
const app = initializeApp(firebaseConfig);

const provider = new EmailAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app, "portfolio2");
const auth = getAuth(app);

// 👇🏻 exports each variable for use within the application
export { provider, auth, storage };
export default db;
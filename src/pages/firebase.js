import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCa8bRS2_F85XLooudJT7rkSgHkLo5iwQc",
  authDomain: "mediconnect-9d8cf.firebaseapp.com",
  databaseURL: "https://mediconnect-9d8cf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mediconnect-9d8cf",
  storageBucket: "mediconnect-9d8cf.firebasestorage.app",
  messagingSenderId: "699772546891",
  appId: "1:699772546891:web:f1d8769b995364532ec2ce"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const database = getDatabase(app);

export default app;
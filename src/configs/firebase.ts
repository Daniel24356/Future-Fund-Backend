import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || "{}");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

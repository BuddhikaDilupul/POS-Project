var admin = require("firebase-admin");

var serviceAccount = require("../../firestore.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sms-demo-8cc11-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const db = admin.firestore();
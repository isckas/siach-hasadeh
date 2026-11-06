/* Firebase web config. These values are public by design: security comes from
   firestore.rules (only admins can write) and the Google sign-in, not from hiding them. */
window.SHUL_FIREBASE = {
  apiKey: "AIzaSyAfpUQEN6fspczSQp-pcGr4YAR8HFsFQvk",
  authDomain: "siach-hasadeh.firebaseapp.com",
  projectId: "siach-hasadeh",
  storageBucket: "siach-hasadeh.firebasestorage.app",
  messagingSenderId: "988340803420",
  appId: "1:988340803420:web:80e9bf0527286bdea81399"
};
/* Built-in owners: can always sign in, edit, and manage the admin list.
   Keep in sync with isBuiltInOwner() in firestore.rules. */
window.SHUL_OWNERS = ["isaac.kass@gmail.com"];

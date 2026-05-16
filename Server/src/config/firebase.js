const admin = require('firebase-admin');

const { env } = require('./env');

let firebaseApp;

function initializeFirebase() {
  if (firebaseApp !== undefined) {
    return firebaseApp;
  }

  if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
    firebaseApp = null;
    return firebaseApp;
  }

  try {
    firebaseApp =
      admin.apps[0] ||
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebaseProjectId,
          clientEmail: env.firebaseClientEmail,
          privateKey: env.firebasePrivateKey,
        }),
      });
  } catch {
    firebaseApp = null;
  }

  return firebaseApp;
}

module.exports = {
  initializeFirebase,
};

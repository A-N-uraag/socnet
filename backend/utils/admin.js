const { response } = require('express');
const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const serviceAcc = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAcc),
    storageBucket: 'socnet-swe.appspot.com'
});

const bucket = getStorage().bucket();

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })

module.exports = {admin, db, bucket};
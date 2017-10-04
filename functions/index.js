const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.creteUser = functions.https.onRequest((req, res) => {

    var docRef = db.collection('users').doc(req.body.id);

    docRef.set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob
    })
        .catch(e => {
            console.log("error in writing in db: ", e);
            res.send("error in writing in db, check logs");
        })
        .then(ref => {
            console.log("user added with id: " + ref.id);
            res.send("user added with id: " + ref.id)
        });
});

exports.getUser = functions.https.onRequest((req, res) => {

    db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});
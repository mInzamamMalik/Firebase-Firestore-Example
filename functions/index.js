const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

// create a user in db: provide all required (id, firstName, lastName, dob) in request body when calling this http trigger
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
        .then(querySnapshot => {
            res.send("user added with id: " + req.body.id)
        });


    // AUTO GENRATED PUSH ID APPROACH

    // 1)
    // var docRef = db.collection('users');
    // docRef.add({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     dob: req.body.dob
    // })

    // 2)
    // var docRef = db.collection('users').doc();
    // docRef.set({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     dob: req.body.dob
    // })
});
// get whole collection of users in json at once
exports.getUsers = functions.https.onRequest((req, res) => {

    db.collection('users').get()

        .catch((err) => {
            console.log('Error getting documents', err);
            res.send('Error getting documents, check logs')
        })
        .then((docSnapshot) => {

            var jsonData = {};

            docSnapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                jsonData[doc.id] = doc.data(); //processing data
            });
            res.send(jsonData);
        });
});

// get single user, provide user id in request body and it will return user
exports.getUser = functions.https.onRequest((req, res) => {

    db.collection('users').doc(req.body.id).get()
        .catch((err) => {
            console.log('Error getting documents', err);
            res.send('Error getting documents, check logs')
        })

        .then((docSnapshot) => {

            if (!docSnapshot.exists) {
                console.log('No such document!');
                res.send('No such document!');
            } else {
                console.log('Document data:', docSnapshot.data());
                res.send(docSnapshot.data())
            }
        });

    // OTHER APPROACHES OF SAME THING:
    // db.collection('users').where('id','==', req.body.id)
    //     .then((docSnapshot) => {

    //         if (!docSnapshot.exists) {
    //             console.log('No such document!');
    //             res.send('No such document!');
    //         } else {
    //             console.log('Document data:', docSnapshot.data());
    //             res.send(docSnapshot.data())
    //         }
    //     });
});
import firebase from 'firebase/app';
import IO from '../Utils/iosys';
import 'firebase/auth';
import 'firebase/firestore'
import $ from '../js/jquery';
import { ipcRenderer } from 'electron';
IO.init();

firebase.initializeApp(IO.getJsonData("firebase_config"));
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        console.log("current user uid: " + user.uid);
    } else {
        console.log("Unknown");
    }
});
let database = firebase.firestore();
firebase.firestore().enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

var provider = new firebase.auth.GoogleAuthProvider();
function googleSignin() {
    firebase.auth()

        .signInWithPopup(provider).then(function (result) {
            var user = result.user;
            console.log(user)
            const userRef = database.collection('users').doc(user.uid)
            userRef.get().then(async (snapshot: any) => {
                if (!snapshot.exists) {
                    console.log("Snapshot not exists")
                    await userRef.set({
                        provider: user.providerData[0].providerId,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lists: []
                    })
                }
                ipcRenderer.send('logged-in');
            })


            firebase.auth().currentUser.getIdTokenResult( /* forceRefresh */ true).then(function (idToken) {
                // Send token to your backend via HTTPS
                // ...

            }).catch(function (error) {
                // Handle error
            });

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(error.code)
            console.log(error.message)
        });
}

function googleSignout() {
    firebase.auth().signOut()

        .then(function () {
            console.log('Signout Succesfull')
        }, function (error) {
            console.log('Signout Failed')
        });
}

ipcRenderer.on("sign-out", function (evt, message) {
    googleSignout();
    console.log("sig out");
});

var provider2 = new firebase.auth.GithubAuthProvider();

function githubSignin() {
    firebase.auth().signInWithPopup(provider2)

        .then(function (result) {
            var user = result.user;
            console.log(user)
            const userRef = database.collection('users').doc(user.uid)
            userRef.get().then(async (snapshot: any) => {
                if (!snapshot.exists) {
                    await userRef.set({
                        provider: user.providerData[0].providerId,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lists: []
                    })
                    ipcRenderer.send('logged-in');
                }
            })
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code)
            console.log(error.message)
        });
}

function githubSignout() {
    firebase.auth().signOut()

        .then(function () {
            console.log('Signout successful!')
        }, function (error) {
            console.log('Signout failed')
        });
}
$("#gg_signin_btn").click(googleSignin);
$("#gh_signin_btn").click(githubSignin);
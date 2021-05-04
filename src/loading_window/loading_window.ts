import { ipcRenderer } from 'electron';
import firebase from 'firebase/app';
import IO from '../utils/iosys';
import 'firebase/auth';

IO.init();
if (firebase.apps.length === 0) {
    const firebase_config = IO.getJsonData("firebase_config");
    // InitializeApp is synchronous
    firebase.initializeApp(firebase_config);
}
ipcRenderer.on("identify-login-status", async (event, message) => {
    let user: firebase.User = await new Promise<firebase.User>((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        })
    })
    let userNeededData: { provider: string; displayName: string; email: string; photoURL: string; uid: string };
    console.log(user);
    if (user) {
        userNeededData = {
            provider: user.providerData[0].providerId,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
        }
    } else {
        event.sender.send('current-login-status', null);
        IO.writeData("user", JSON.stringify(userNeededData, null, 4));
        return;
    }
    IO.writeData("user", JSON.stringify(userNeededData, null, 4));
    event.sender.send('current-login-status', userNeededData);
})
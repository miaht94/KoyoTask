import { ipcMain, Menu, BrowserWindow } from 'electron';
// import firebase from 'firebase/app'
import IO from './utils/iosys';
import "firebase/auth";
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;


// Initialize iosystem
IO.init();
let userData = IO.getData("user");
export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static firebase: any;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;
    static MAIN_WINDOW_WEBPACK_ENTRY: any;
    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object. 
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nativeWindowOpen: true
            },
            minHeight: 500,
            minWidth: 800,
            titleBarStyle: 'hiddenInset',
            transparent: true
        });
        Main.mainWindow.webContents.on('did-finish-load', () => {
            Main.mainWindow.webContents.send('Receive root path', Main.MAIN_WINDOW_WEBPACK_ENTRY)
        })
        Main.mainWindow.webContents.openDevTools();
        if(userData.uid == null) {
            Main.mainWindow.loadURL("https://southamerica-east1-fourth-jigsaw-305509.cloudfunctions.net/function-1")
        }
        else{
            Main.mainWindow
            .loadURL(Main.MAIN_WINDOW_WEBPACK_ENTRY);
        }
        Main.mainWindow.on('closed', Main.onClose);
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow, MAIN_WINDOW_WEBPACK_ENTRY: any, firebase: any) {
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        Main.application = app;
        Main.firebase = firebase;
        Main.application.userAgentFallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36';
        Main.MAIN_WINDOW_WEBPACK_ENTRY = MAIN_WINDOW_WEBPACK_ENTRY;
        if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
            app.quit();
        }
        Main.BrowserWindow = browserWindow;
        const firebase_config = IO.getJsonData("firebase_config");
        Main.firebase.initializeApp(firebase_config);
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        var argument;
        ipcMain.on('token', function (event, arg) {
            console.log("token : " + event + " : " + arg);
            argument = arg;
            let credential = firebase.auth.GoogleAuthProvider.credential(null, arg);
            firebase.auth().signInWithCredential(credential).then(() => {
              userData.uid = firebase.auth().currentUser.uid;
              userData.fullname = firebase.auth().currentUser.displayName;
              userData.account_type = "Logged";
              IO.writeData("user", JSON.stringify(userData, null, 2));
              Main.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
            })
          });
        ipcMain.on("requestCredential", (event, arg) => {
            console.log("received")
            event.reply('credential-reply', argument)
        })
        ipcMain.on('show-context-menu', (event) => {
            const template = [
                {
                    label: 'Menu Item 1',
                    click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
                }
            ]
            const menu = Menu.buildFromTemplate(template)
            menu.popup(BrowserWindow.fromWebContents(event.sender) as Electron.PopupOptions)
        })
    }
}
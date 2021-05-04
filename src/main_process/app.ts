import { ipcMain, Menu, BrowserWindow } from 'electron';
import firebase from 'firebase/app'
import IO from '../utils/iosys';
import "firebase/auth";
import "firebase/firestore"
import { User } from '../main_window/Model/User';
import portscanner from 'portscanner';
import express from 'express'
import path from 'path'
// Initialize iosystem
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const LOGIN_WINDOW_WEBPACK_ENTRY: any;
declare const LOADING_WINDOW_WEBPACK_ENTRY: any
IO.init();

export default class Main {
    static mainWindow: Electron.BrowserWindow = null;
    static rootDir: string;
    static firebase: any;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;
    static MAIN_WINDOW_WEBPACK_ENTRY: any = MAIN_WINDOW_WEBPACK_ENTRY;
    static LOGIN_WINDOW_WEBPACK_ENTRY: any = LOGIN_WINDOW_WEBPACK_ENTRY;
    static LOADING_WINDOW_WEBPACK_ENTRY: any = LOADING_WINDOW_WEBPACK_ENTRY;
    static userData: any;
    static database: firebase.firestore.Firestore;
    static appExpress = express();
    static port: number = null;
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
        console.log("App Ready")
        Main.mainWindow = new Main.BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nativeWindowOpen: true,
                webSecurity: false
            },
            minHeight: 500,
            minWidth: 800,
            // titleBarStyle: 'hiddenInset',

        });
        Main.mainWindow.webContents.on('did-finish-load', () => {
            Main.mainWindow.webContents.send('Receive root path', Main.MAIN_WINDOW_WEBPACK_ENTRY)
        })
        Main.mainWindow.webContents.openDevTools();
        // if (Main.userData.uid == null) {
        //     Main.mainWindow.loadURL(Main.LOGIN_WINDOW_WEBPACK_ENTRY)
        // }
        // else {
        //     Main.mainWindow
        //         .loadURL(Main.MAIN_WINDOW_WEBPACK_ENTRY);
        // }

        Main.mainWindow.on('closed', Main.onClose);
        console.log("On Ready Done")
    }

    static configRootDir(): void {
        Main.rootDir = path.resolve(__dirname, "..", "renderer");
    }

    static makeEntryAdaptive(): void {
        if (Main.port === null) throw new Error("Port Null")
        let entry = "http://localhost:" + Main.port;
        Main.MAIN_WINDOW_WEBPACK_ENTRY = entry + "/main_window";
        Main.LOGIN_WINDOW_WEBPACK_ENTRY = entry + "/login_window";
        Main.LOADING_WINDOW_WEBPACK_ENTRY = entry + "/loading_window";
    }

    static async findFreePort(): Promise<number> {
        return new Promise((resolve, reject) => {
            portscanner.findAPortNotInUse(4100, 4110, '127.0.0.1', function (error, port) {
                if (error) {
                    reject(error);
                }
                console.log('AVAILABLE PORT AT: ' + port)
                Main.port = port;
                resolve(port);
            })
        })
    }

    static async configExpress(): Promise<boolean> {
        let port: number = await Main.findFreePort();
        return new Promise((resolve, reject) => {
            Main.appExpress.listen(port);
            console.log(__dirname);
            console.log("Root Dir: " + Main.rootDir)
            Main.appExpress.get('/__webpack_hmr', function (req, res) {
                res.redirect("http://localhost:3000/__webpack_hmr")
            });

            Main.appExpress.get('/:file', (req, res, next) => {
                let filename: string = req.params.file;
                if (!filename) next();
                if (filename && filename.match(".json$")) {
                    res.sendFile(filename, { root: Main.rootDir })
                } else next();
            })

            Main.appExpress.get('/main_window', function (req, res) {
                res.sendFile('main_window/index.html', { root: Main.rootDir })
            });
            Main.appExpress.use('/main_window', express.static(path.join(Main.rootDir, "main_window")))

            Main.appExpress.get('/login_window', function (req, res) {
                res.sendFile('login_window/index.html', { root: Main.rootDir })
            });
            Main.appExpress.use('/login_window', express.static(path.join(Main.rootDir, "login_window")))

            Main.appExpress.get('/loading_window', function (req, res) {
                res.sendFile('loading_window/index.html', { root: Main.rootDir })
            });
            Main.appExpress.use('/loading_window', express.static(path.join(Main.rootDir, "loading_window")))

            Main.appExpress.use('/img', express.static(path.join(Main.rootDir, "img")))
            Main.appExpress.use('/css', express.static(path.join(Main.rootDir, "css")))
            Main.appExpress.use('/js', express.static(path.join(Main.rootDir, "js")))
            console.log("Express Config Done");
            resolve(true);
        })
    }



    static setupMainIPC(): void {
        // var argument: string;
        ipcMain.on('logged-in', function (event, arg) {
            Main.mainWindow.loadURL(Main.MAIN_WINDOW_WEBPACK_ENTRY)
            // add new user for the first time login
        });
        ipcMain.on("logged-out", (event, arg) => {
            Main.userData.uid = null;
            Main.userData.fullname = "guest";
            Main.userData.account_type = "guest";
            Main.userData.email = "guest";
            Main.userData.avtURL = "guest";
            IO.writeData("user", JSON.stringify(Main.userData, null, 2));
            Main.mainWindow.loadURL(Main.LOGIN_WINDOW_WEBPACK_ENTRY);
            Main.mainWindow.webContents.on("did-finish-load", () => {
                Main.mainWindow.webContents.send("sign-out", "..");
            })
        });
        // ipcMain.on("requestCredential", (event, arg) => {
        //     console.log("received")
        //     event.reply('credential-reply', argument)
        // })

        ipcMain.on('show-context-menu', (event) => {
            const template = [
                {
                    label: Main.rootDir,
                    click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
                }
            ]
            const menu = Menu.buildFromTemplate(template)
            menu.popup(BrowserWindow.fromWebContents(event.sender) as Electron.PopupOptions)
        })

    }


    static async indentifyLoginStatus(): Promise<firebase.User> {
        if (firebase.apps.length !== 0) {
            return new Promise((resolve, reject) => {
                Main.mainWindow.loadURL(Main.LOADING_WINDOW_WEBPACK_ENTRY);
                Main.mainWindow.webContents.on('did-finish-load', () => {
                    Main.mainWindow.webContents.send('identify-login-status')
                })
                ipcMain.once('current-login-status', (event, message) => {
                    console.log("Received current login status : ")
                    console.log(message);
                    resolve(message)
                })
            })
        } else {
            try {
                const firebase_config = IO.getJsonData("firebase_config");
                // InitializeApp is synchronous
                Main.firebase.initializeApp(firebase_config);
                return await Main.indentifyLoginStatus();

            } catch (e) {
                console.error(e);
            }
        }
    }

    static async main(app: Electron.App, browserWindow: typeof BrowserWindow, firebase: any) {
        Main.configRootDir();
        Main.application = app;
        Main.firebase = firebase;
        Main.application.userAgentFallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36';
        if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
            app.quit();
        }
        Main.BrowserWindow = browserWindow;
        Main.userData = IO.getData("user");
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        Main.setupMainIPC();
        await this.configExpress();
        await Main.application.whenReady();
        console.log("When Ready Done")
        console.log(Main.mainWindow != null)
        Main.makeEntryAdaptive();

        console.log("Starting Init Firebase");
        const firebase_config = IO.getJsonData("firebase_config");
        // InitializeApp is synchronous
        try {
            const firebase_config = IO.getJsonData("firebase_config");
            // InitializeApp is synchronous
            Main.firebase.initializeApp(firebase_config);
        } catch (e) {
            console.error(e);
        }
        Main.database = firebase.firestore();
        console.log("Init Firebase complete")
        console.log("Starting indentify login status")
        let user = await Main.indentifyLoginStatus();
        if (!user) Main.mainWindow.loadURL(Main.LOGIN_WINDOW_WEBPACK_ENTRY);
        else Main.mainWindow.loadURL(Main.MAIN_WINDOW_WEBPACK_ENTRY)
        console.log("End");

        // Work flow :
        // Indentify User If they logged in => Init Main Firebase
        // If logged in send credential to renderer process
        // If not render login screen and after logged in send credential to main process
        // 
    }
}
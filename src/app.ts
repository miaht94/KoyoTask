import { ipcMain, BrowserWindow } from 'electron';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
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
        Main.mainWindow
            .loadURL(Main.MAIN_WINDOW_WEBPACK_ENTRY);
        Main.mainWindow.on('closed', Main.onClose);
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow, MAIN_WINDOW_WEBPACK_ENTRY: any) {
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        Main.MAIN_WINDOW_WEBPACK_ENTRY = MAIN_WINDOW_WEBPACK_ENTRY;
        if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
            app.quit();
        }
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
import * as fs from 'fs';
import io from './utils/iosys';
import $ from './js/jquery';
import './js/bootstrap.min';
// import './js/jquery-ui';
import { DashboardController } from './Controller/DashBoardController';
import { DashboardView } from './View/DashboardView';
import { DashboardModel } from './Model/DashboardModel';
import { ipcRenderer } from 'electron';

import { remote } from 'electron';

const win = remote.getCurrentWindow();

$(document).ready(() => {
    io.init();
    console.log(io.getData("list_data"));
    // let a = new DashboardView();
    console.log("ready");
    // $("html").append(html);
    // $("#tabs").tabs();
    let a: DashboardController = new DashboardController(new DashboardModel(), new DashboardView());
    ipcRenderer.on("Receive root path", (event, message) => {
        console.log(message);
    })
    if (document.readyState == "complete") {
        handleWindowControls();
    }
})

window.onbeforeunload = (event:any) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
}
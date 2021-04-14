import * as fs from 'fs';
import io from './utils/iosys';
import $ from './js/jquery';
// import './js/jquery-ui';
import { DashboardController } from './Controller/DashBoardController';
import { DashboardView } from './View/DashboardView';
import { DashboardModel } from './Model/DashboardModel';
import { ipcRenderer } from 'electron';

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
})
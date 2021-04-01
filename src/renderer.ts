import * as fs from 'fs';
import io from './utils/iosys';
import * as $ from './jquery';
import './jquery-ui';
import html from './index.html';
import { DashboardView } from './View/DashboardView';


$(document).ready(() => {
    console.log(fs.readFileSync(__dirname + "/main.js", "utf8"));
    io.init();
    console.log(io.getData("list_data"));
    // let a = new DashboardView();
    console.log("ready");
    console.log(html);
    // $("html").append(html);
    // $("#tabs").tabs();

})
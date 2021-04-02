import * as fs from 'fs';
import io from './utils/iosys';
import $ from './js/jquery';
import './js/jquery-ui';
import { DashboardView } from './View/DashboardView';


$(document).ready(() => {
    console.log(fs.readFileSync(__dirname + "/main.js", "utf8"));
    io.init();
    console.log(io.getData("list_data"));
    // let a = new DashboardView();
    console.log("ready");
    // $("html").append(html);
    // $("#tabs").tabs();

})
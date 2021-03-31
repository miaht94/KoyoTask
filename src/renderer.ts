import * as fs from 'fs';
import io from './utils/iosys';
import * as $ from 'jquery';
import { DashboardView } from './View/DashboardView';
console.log(fs.readFileSync(__dirname + "/main.js", "utf8"));
io.init();

console.log(io.getData("list_data"));
let a = new DashboardView();
$(document).ready(() => {
    console.log("ready");
})
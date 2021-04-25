import { app, BrowserWindow } from 'electron';
import Main from './app';
import IO from './utils/iosys';
import firebase from "firebase/app";
import fetch from "node-fetch";
import "firebase/auth";

// import data from './data/data.json';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
Main.main(app, BrowserWindow, MAIN_WINDOW_WEBPACK_ENTRY, firebase);
console.log("anything");
console.log(process.argv.find(arg => arg.startsWith('--role=')) == 'prod');
IO.init();
console.log(IO.getData("list_data"));
console.log(MAIN_WINDOW_WEBPACK_ENTRY);

import { app, BrowserWindow } from 'electron';
import Main from './app';
import IO from '../Utils/iosys';
import firebase from "firebase/app";
import "firebase/auth";
import portscanner from 'portscanner';
import express from 'express'
import path from 'path'
// import data from './data/data.json';
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['atob'] = require('atob');
Main.main(app, BrowserWindow, firebase);
IO.init();
console.log(IO.getData("list_data"));

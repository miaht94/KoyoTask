import * as fs from 'fs';
import path = require('path');
export default class IOSystem {
    // true when IOSystem is initialized
    static isActive: boolean = false;

    //root directory
    static workspaceRoot: string;

    static paths: JSON;
    static init(): void {
        IOSystem.workspaceRoot = path.resolve(".");
        IOSystem.paths = JSON.parse(fs.readFileSync(IOSystem.workspaceRoot + "/src/config.json", "utf8"));
        IOSystem.isActive = true;
    }
    static getData(file_name: string): JSON {
        if (IOSystem.isActive) {
            return JSON.parse(fs.readFileSync(IOSystem.workspaceRoot + IOSystem.paths[file_name], "utf8"));
        } else throw "Chua init IOSystem";
    }
}
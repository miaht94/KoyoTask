import * as fs from 'fs';
import path = require('path');
export default class IOSystem {
    // true when IOSystem is initialized
    static isActive: boolean = false;

    //root directory
    static workspaceRoot: string;

    static paths: JSON;
    static init(): void {
        if (!this.isActive) {
            IOSystem.workspaceRoot = path.resolve(".");
            let str: string = !(process.env.NODE_ENV === 'production') ? "/src/data/config.json" : "/resources/app/.webpack/renderer/data/config.json";
            IOSystem.workspaceRoot += str;
            try {
                IOSystem.paths = JSON.parse(fs.readFileSync(IOSystem.workspaceRoot, "utf8"));
            } catch {
                console.log("ko load dc paths");
            }
            IOSystem.isActive = true;
            IOSystem.workspaceRoot = path.resolve(IOSystem.workspaceRoot, '..');
            // console.log(IOSystem.workspaceRoot);
        }
    }

    /**
   * Get json parsed from file name
   */
    static getData(file_name: string): Object {
        let paths: any = IOSystem.paths;
        if (IOSystem.isActive) {
            return JSON.parse(fs.readFileSync(IOSystem.workspaceRoot + paths[file_name], "utf8"));
        } else throw "Chua init IOSystem";
    }


    /**
   * Get raw data from file name (Without json parsed)
   */
    static getDataRaw(file_name: string): string {
        let paths: any = IOSystem.paths;
        if (IOSystem.isActive) {
            return fs.readFileSync(IOSystem.workspaceRoot + paths[file_name], "utf8");
        } else throw "Chua init IOSystem";
    }


    /**
   * Get property of config.json
   */
    static getJsonData(property: string): string {
        let paths: any = IOSystem.paths;
        if (IOSystem.isActive) {
            return paths[property];
        } else throw "Chua init IOSystem hoac ko thay du lieu can tim";
    }

    //WORKING
    static writeData(file_name: string, content: string,): void {
        let paths: any = IOSystem.paths;
        if (IOSystem.isActive) {
            fs.writeFileSync(IOSystem.workspaceRoot + paths[file_name], content, "utf8");
        } else throw "Chua init IOSystem";
    }
}
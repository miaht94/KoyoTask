export class Logger {
    public className: String;
    constructor(instance: Object) {
        this.className = instance.constructor.name;
    }
    public Log(...str: any[]) {
        let maxLength: number = Math.max(str.length, this.className.length + 5);
        let header: String = "";
        for (let i: number = 0; i < maxLength + 20; i++) {
            header += "=";
        }
        console.log(header);
        console.log("\n");
        console.log("From " + this.className + ": ");
        console.log(str);
        console.log("\n");
    }
}
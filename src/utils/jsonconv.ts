import { List, Task } from '../Model/List';
import IOSystem from './iosys';
export default class JSONConv {
    private listKey : string[];
    private taskKey : string[];
    constructor() {
      this.JSONConvInit();
    }
  
    private JSONConvInit(): void {
      // let rawinput = IOSystem.getDataRaw('dbconfig');
      // let rawlist = rawinput.slice(0, rawinput.indexOf('\n'));
      // let rawtask = rawinput.slice(rawinput.indexOf('\n'), rawinput.length);
      // this.listKey = rawlist.split(',');
      // this.taskKey = rawtask.split(',');
    }
    // true when IOSystem is initialized
    public taskToJSONString(inputTask: Task): string {
      // let currentTask = inputTask;
      // let outputString : string = '{\n';
      // this.taskKey.forEach( function (value) {
      //   outputString += 
      // })
      // outputString += '}'
      let outputString = JSON.stringify(inputTask);
      return outputString;
    }

}
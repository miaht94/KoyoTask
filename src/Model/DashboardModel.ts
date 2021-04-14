import IOSystem from '../utils/iosys';
import { List, Task } from './List';
import { Model } from './Model';
import { DashboardView } from '../View/DashboardView';
export class DashboardModel extends Model {
    protected lists: List[] = []; //same
    protected currentList: List;

    public onChange: Function;
    protected commit() {
        IOSystem.writeData("list_data",JSON.stringify(this.lists, null, "\t"));
        this.onChange(this.currentList);
    };

    constructor() {
        super();
        let lists_json: any = IOSystem.getData("list_data");
        lists_json.forEach((element: any) => {
            let temp_list: List = new List(element);
            this.lists.push(temp_list);
        })
        if (this.lists.length === 0) this.currentList = List.createEmptyList();
        else this.currentList = this.lists[0];
        //console.log(JSON.stringify(this.lists));
    }

    public bindOnChange(viewTriggerFunction: Function) {
        this.onChange = viewTriggerFunction;
    }

    protected assignCurrentList(listID: string): void {
        let element: any;
        for (element in this.lists) {
            if (element.getListID() === listID) {
                this.setCurrentList(element);
            }
        }
    }

    public setCurrentList(list: List) {
        this.currentList = list;
        this.onChange(this.currentList);
    }

    public getCurrentList(): List {
        return this.currentList;
    }

    public addTaskCompactToCurrentList(taskName: string){
        this.currentList.addTaskCompact(taskName);
        this.commit();
    }

    public deleteTaskFromCurrentList(taskID: string){
        // console.log("deleteTaskFromCurrentList executing");
        this.currentList.deleteTask(taskID);
        this.commit();
    }

    public setTaskInCurrentList(taskID: string, that: Task){
        this.currentList.setTask(taskID, that);
        this.commit();
    }

}
import IOSystem from '../utils/iosys';
import { List } from './List';
import { Model } from './Model';
import { DashboardView } from '../View/DashboardView';
export class DashboardModel extends Model {
    protected lists: List[] = [];
    protected currentList: List;

    public onChange: Function;
    protected commit() {
        this.onChange(this.currentList)
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
}
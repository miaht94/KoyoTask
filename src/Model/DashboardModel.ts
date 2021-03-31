import IOSystem from '../utils/iosys';
export class DashboardModel extends Model {
    protected lists: JSON;
    protected currentList: List;
    public onChange: Function;
    protected commit() {
        this.onChange(this.currentList)
    };
    constructor() {
        super();
        this.lists = IOSystem.getData("list_data");

    }
    protected bindListChange(onChange: Function) {
        this.onChange = onChange;
    }
    protected assignCurrentList(listIndex: number): void {
        this.currentList = new List(this.lists[listIndex]);
    }
    public getCurrentList(): List {
        return this.currentList;
    }
}
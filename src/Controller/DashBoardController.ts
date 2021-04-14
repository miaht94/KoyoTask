import { Task } from '../Model/List';
import { DashboardModel } from '../Model/DashboardModel';
import { DashboardView } from '../View/DashboardView';
import { Controller } from './Controller';
export class DashboardController extends Controller {
    private model: DashboardModel;
    private view: DashboardView;
    constructor(model: DashboardModel, view: DashboardView) {
        super();
        this.model = model;
        this.view = view;
        this.model.bindOnChange(this.view.render.bind(this.view));
        this.model.onChange(model.getCurrentList());
        this.view.bindOnAddCompact(this.onAddCompact.bind(this));
        this.view.bindOnDelete(this.onDelete.bind(this));
        this.view.bindOnSetTask(this.onSetTask.bind(this));
    }

    public onAddCompact(taskName : string){
        this.model.addTaskCompactToCurrentList(taskName);
    }

    public onDelete(taskID : string){
        this.model.deleteTaskFromCurrentList(taskID);
    }

    public onSetTask(taskID: string, task: Task){
        this.model.setTaskInCurrentList(taskID, task);
    }
}
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
        this.view.bindOnAdd(this.onAddCompact.bind(this));
    }

    public onAddCompact(taskName : string){
        this.model.addTaskToCurrentList(taskName);
    }
}
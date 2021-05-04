
import { Logger } from '../../utils/Logger'
import { DashboardModel } from '../Model/DashboardModel';
import { DashboardView } from '../View/DashboardView';

import { TaskModel } from '../Model/TaskModel';
import $ from '../../js/jquery';
export class DashboardController {
    private model: DashboardModel;
    private view: DashboardView;
    protected Logger: Logger;
    constructor(model: DashboardModel, view: DashboardView) {
        this.Logger = new Logger(this);
        this.model = model;
        this.view = view;
        // this.model.bindOnChange(this.view.render.bind(this.view));

        this.view.bindOnAddCompact(this.onAddCompact.bind(this));
        // this.view.bindOnDelete(this.onDelete.bind(this));
        this.view.bindOnSetTask(this.onSetTask.bind(this));
        this.view.getTableListView().bindHandleListNameChange(this.handleListNameChange.bind(this));
        this.view.getTableListView().bindHandleListDescriptionChange(this.handleListDescriptionChange.bind(this));


        // this.model.onChange(model.getCurrentList());
        this.model.bindOnUserChange(this.view.renderUserInfo.bind(this.view));
        this.model.onUserChange(this.model.getCurrentUser());
        this.model.getTableListModel().bindOnAdded(this.view.getTableListView().renderAddedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnModified(this.view.getTableListView().renderModifiedListById.bind(this.view.getTableListView()))

        //Test
        $(".test-hide").click(this.TestingFunction.bind(this));
    }

    public onAddCompact(taskName: string, completed: boolean) {
        this.model.addTaskCompactToCurrentList(taskName, completed);
    }

    public onDelete(taskID: string) {
        this.model.deleteTaskFromCurrentList(taskID);
    }

    public onSetTask(taskID: string, task: TaskModel) {
        this.model.setTaskInCurrentList(taskID, task);
    }

    public handleListNameChange(id: string, newName: string) {
        this.model.getTableListModel().setNameModelListById(id, newName);
    }

    public handleListDescriptionChange(id: string, newDescription: string) {
        this.model.getTableListModel().setDescriptionModelListById(id, newDescription);
    }

    //Testing 
    public TestingFunction() {
        console.log(this.model.getTableListModel().getListModelsObservable())
        this.model.getTableListModel().getListModelsObservable().getByIndex(0).setListName("nsacahua")
    }
}
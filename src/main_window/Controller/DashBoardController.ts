
import { Logger } from '../../utils/Logger'
import { DashboardModel } from '../Model/DashboardModel';
import { DashboardView } from '../View/DashboardView';

import { TaskModel } from '../Model/TaskModel';
import $ from '../../js/jquery';
import { ListModel } from '../Model/ListModel';
export class DashboardController {
    private model: DashboardModel;
    private view: DashboardView;
    protected Logger: Logger;
    constructor(model: DashboardModel, view: DashboardView) {
        this.Logger = new Logger(this);
        this.model = model;
        this.view = view;
        // this.model.bindOnChange(this.view.render.bind(this.view));

        // this.view.bindOnAddCompact(this.onAddCompact.bind(this));
        // this.view.bindOnDelete(this.onDelete.bind(this));
        // this.view.bindOnSetTask(this.onSetTask.bind(this));
        this.view.getTableListView().bindHandleListNameChange(this.handleListNameChange.bind(this));
        this.view.getTableListView().bindHandleListDescriptionChange(this.handleListDescriptionChange.bind(this));
        this.view.getTableListView().bindHandleChangeCurrentTaskModel(this.handleChangeCurrentTaskModel.bind(this));
        this.view.getTableListView().bindHandleAddList(this.handleAddList.bind(this));
        this.view.getTableTaskView().bindHandleTaskNameChange(this.handleTaskNameChange.bind(this))
        this.view.getTableTaskView().bindHandleTaskDescriptionChange(this.handleTaskDescriptionChange.bind(this))
        this.view.getTableTaskView().bindHandleAddTask(this.handleAddTask.bind(this));
        // this.model.onChange(model.getCurrentList());
        this.model.bindOnUserChange(this.view.renderUserInfo.bind(this.view));
        this.model.onUserChange(this.model.getCurrentUser());
        this.model.getTableListModel().bindOnAdded(this.view.getTableListView().renderAddedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnModified(this.view.getTableListView().renderModifiedList.bind(this.view.getTableListView()))
        this.model.getTableTaskModel().bindOnModified(this.view.getTableTaskView().renderModifiedTaskById.bind(this.view.getTableTaskView()))
        this.model.getTableTaskModel().bindOnAdded(this.view.getTableTaskView().renderAddedTask.bind(this.view.getTableTaskView()))
        this.model.bindOnCurrentTaskModelChange(this.view.getTableTaskView().renderTaskModel.bind(this.view.getTableTaskView()))
        //Test
        $(".test-hide").click(this.TestingFunction.bind(this));
    }

    // public onAddCompact(taskName: string, completed: boolean) {
    //     this.model.addTaskCompactToCurrentList(taskName, completed);
    // }

    // public onDelete(taskID: string) {
    //     this.model.deleteTaskFromCurrentList(taskID);
    // }

    // public onSetTask(taskID: string, task: TaskModel) {
    //     this.model.setTaskInCurrentList(taskID, task);
    // }

    public handleListNameChange(id: string, newName: string) {
        this.model.getTableListModel().setNameModelListById(id, newName);
    }

    public handleListDescriptionChange(id: string, newDescription: string) {
        this.model.getTableListModel().setDescriptionModelListById(id, newDescription);
    }

    public handleChangeCurrentTaskModel(id: string) {
        let temp = this.model.getTableListModel().findOListModelById(id).get().getListRef().collection("tasks")

        this.model.setCurrentTaskModel(this.model.getTableListModel().findOListModelById(id).get().getTasksModel(), temp);
    }

    public handleTaskNameChange(id: string, newName: string) {
        this.model.getTableTaskModel().findOTaskModelById(id).get().setTaskName(newName);
    }

    public handleTaskDescriptionChange(id: string, newDescription: string) {
        this.model.getTableTaskModel().findOTaskModelById(id).get().setTaskDescription(newDescription);
    }

    public handleAddList() {
        this.model.getTableListModel().getListModelsObservable().addElement(ListModel.createEmptyList())
    }

    public handleAddTask() {
        let currentTaskCol = this.model.getCurrentTaskColRef()
        let newTask = TaskModel.createEmptyTask(currentTaskCol);
        this.model.getTableTaskModel().getTaskModelsObservable().addElement(newTask);
    }

    //Testing 
    public TestingFunction() {
        setInterval(() => console.log(this.model.getTableListModel().getListModelsObservable().getAllElements()), 3000)
        // console.log(this.model.getTableListModel().getListModelsObservable())
        // this.model.getTableListModel().getListModelsObservable().getByIndex(0).setListName("nsacahua")
        // this.model.setCurrentTaskModel(this.model.getTableListModel().getListModelsObservable().getByIndex(0).getTasksModel())
    }
}
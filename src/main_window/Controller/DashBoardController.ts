
import { Logger } from '../../Utils/Logger'
import { DashboardModel } from '../Model/DashboardModel';
import { DashboardView } from '../View/DashboardView';

// import { TaskModel } from '../Model/TaskModel';
import $ from '../../js/jquery';
import { List } from '../Model/List';
// import { ListModel } from '../Model/ListModel';
export class DashboardController {
    private model: DashboardModel;
    private view: DashboardView;
    protected Logger: Logger;
    constructor(model: DashboardModel, view: DashboardView) {
        this.Logger = new Logger(this);
        this.model = model;
        this.view = view;
        this.view.getTableListView().bindHandleListNameChange(this.handleListNameChange.bind(this));
        this.view.getTableListView().bindHandleListDescriptionChange(this.handleListDescriptionChange.bind(this));
        // this.view.getTableListView().bindHandleChangeCurrentTaskModel(this.handleChangeCurrentTaskModel.bind(this));
        this.view.getTableListView().bindHandleAddList(this.handleAddList.bind(this));
        this.view.getTableListView().bindHandleDeleteList(this.handleRemoveList.bind(this))
        // this.view.getTableTaskView().bindHandleTaskNameChange(this.handleTaskNameChange.bind(this))
        // this.view.getTableTaskView().bindHandleTaskDescriptionChange(this.handleTaskDescriptionChange.bind(this))
        // this.view.getTableTaskView().bindHandleAddTask(this.handleAddTask.bind(this));
        // this.view.getTableTaskView().bindHandleShare(this.handleSharing.bind(this));
        // this.model.bindOnUserChange(this.view.renderUserInfo.bind(this.view));
        // this.model.onUserChange(this.model.getCurrentUser());
        // this.model.getTableListModel().bindOnAdded(this.view.getTableListView().renderAddedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnInserted(this.view.getTableListView().renderInsertedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnModified(this.view.getTableListView().renderModifiedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnRemoved(this.view.getTableListView().removeListById.bind(this.view.getTableListView()))
        // this.model.getTableTaskModel().bindOnModified(this.view.getTableTaskView().renderModifiedTaskById.bind(this.view.getTableTaskView()))
        // this.model.getTableTaskModel().bindOnAdded(this.view.getTableTaskView().renderAddedTask.bind(this.view.getTableTaskView()))
        // this.model.getTableTaskModel().bindOnInserted(this.view.getTableTaskView().renderInsertedTask.bind(this.view.getTableTaskView()))
        // this.model.bindOnCurrentTaskModelChange(this.view.getTableTaskView().renderTaskModel.bind(this.view.getTableTaskView()))
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
        this.model.getTableListModel().getListsRenderModel().getElementByIdCode(id).setListName(newName);
        this.model.getTableListModel().getListsRenderModel().getElementByIdCode(id).publishOnFirebase();
    }

    public handleListDescriptionChange(id: string, newDescription: string) {
        this.model.getTableListModel().getListsRenderModel().getElementByIdCode(id).setListDescription(newDescription);
        this.model.getTableListModel().getListsRenderModel().getElementByIdCode(id).publishOnFirebase();
    }

    // public handleChangeCurrentTaskModel(id: string) {
    //     let temp = this.model.getTableListModel().findOListModelById(id).get().getListRef().collection("tasks")
    //     let temp2 = this.model.getTableListModel().findOListModelById(id).get()
    //     this.model.setCurrentTaskModel(this.model.getTableListModel().findOListModelById(id).get().getTasksModel(), temp, temp2);
    // }

    // public handleTaskNameChange(id: string, newName: string) {
    //     this.model.getTableTaskModel().findOTaskModelById(id).get().setTaskName(newName);
    // }

    // public handleTaskDescriptionChange(id: string, newDescription: string) {
    //     this.model.getTableTaskModel().findOTaskModelById(id).get().setTaskDescription(newDescription);
    // }



    public handleAddList(list: List) {
        this.model.getTableListModel().getListsRenderModel().binaryInsert(list)

    }

    public handleRemoveList(id: string) {
        let removedList = this.model.getTableListModel().getListsRenderModel().removeElementByElement(this.model.getTableListModel().getListsRenderModel().getElementByIdCode(id));
        removedList.removeOnFirebase(() => { }, () => {
            this.model.getTableListModel().getListsRenderModel().binaryInsert(removedList)
        });
    }

    // public handleAddTask() {
    //     let currentTaskCol = this.model.getCurrentTaskColRef()
    //     let newTask = TaskModel.createEmptyTask(currentTaskCol);
    //     this.model.getTableTaskModel().getTaskModelsObservable().addElement(newTask);
    // }

    // public handleSharing(uid: string) {
    //     if (this.model.getCurrentList())
    //         this.model.getCurrentList().addCollab(uid);
    // }

    //Testing 
    public TestingFunction() {
        console.log(this.model.getTableListModel())
    }
}
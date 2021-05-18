
import { Logger } from '../../Utils/Logger'
import { DashboardModel } from '../Model/DashboardModel';
import { DashboardView } from '../View/DashboardView';

// import { TaskModel } from '../Model/TaskModel';
import $ from 'jquery';
import '@popperjs/core';
import { List } from '../Model/List';
import { Task } from '../Model/Task';
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
        this.view.getTableListView().bindHandleChangeCurrentList(this.handleChangeCurrentList.bind(this));
        this.view.getTableListView().bindHandleAddList(this.handleAddList.bind(this));
        this.view.getTableListView().bindHandleDeleteList(this.handleRemoveList.bind(this))
        this.view.getTableTaskView().bindHandleTaskNameChange(this.handleTaskNameOfCurListChange.bind(this))
        this.view.getTableTaskView().bindHandleTaskDescriptionChange(this.handleTaskDescriptionOfCurListChange.bind(this))
        this.view.getTableTaskView().bindHandleAddTask(this.handleAddTask.bind(this));
        this.view.getTableTaskView().bindHandleDeleteTask(this.handleDeleteTask.bind(this));
        this.view.getTableTaskView().bindHandleTickTask(this.handleTickTask.bind(this));
        this.view.getTableTaskView().bindHandleSharing(this.handleSharing.bind(this));

        this.model.bindOnUserChange(this.view.renderUserInfo.bind(this.view));
        this.model.onUserChange(this.model.getCurrentUser());
        // this.model.getTableListModel().bindOnAdded(this.view.getTableListView().renderAddedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnInserted(this.view.getTableListView().renderInsertedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnModified(this.view.getTableListView().renderModifiedList.bind(this.view.getTableListView()))
        this.model.getTableListModel().bindOnRemoved(this.view.getTableListView().removeListById.bind(this.view.getTableListView()))
        this.model.getTableTaskModel().bindOnModified(this.view.getTableTaskView().renderModifiedTaskById.bind(this.view.getTableTaskView()))
        // this.model.getTableTaskModel().bindOnAdded(this.view.getTableTaskView().renderAddedTask.bind(this.view.getTableTaskView()))
        this.model.getTableTaskModel().bindOnInserted(this.view.getTableTaskView().renderInsertedTask.bind(this.view.getTableTaskView()))
        this.model.getTableTaskModel().bindOnCleared(this.view.getTableTaskView().clearAllTasks.bind(this.view.getTableTaskView()))
        this.model.getTableTaskModel().bindOnRemoved(this.view.getTableTaskView().removedTask.bind(this.view.getTableTaskView()))
        this.model.getTableTaskModel().bindOnCurListChangeSth(this.view.getTableTaskView().renderCurList.bind(this.view.getTableTaskView()))

        // this.model.bindOnCurrentTaskModelChange(this.view.getTableTaskView().renderTaskModel.bind(this.view.getTableTaskView()))
        //Test

        // $(".test-hide").click(this.TestingFunction.bind(this));
        // $(".submit-share").click(this.TestingFunction.bind(this));
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
        let list = this.model.getRenderLists().getElementByIdCode(id);
        if (!list) return;
        list.setListName(newName);
        list.publishOnFirebase();
    }

    public handleListDescriptionChange(id: string, newDescription: string) {
        let list = this.model.getRenderLists().getElementByIdCode(id);
        if (!list) return;
        list.setListDescription(newDescription);
        list.publishOnFirebase();
    }

    public handleChangeCurrentList(id: string) {

        // let temp = this.model.getTableListModel().findOListModelById(id).get().getListRef().collection("tasks")
        // let temp2 = this.model.getTableListModel().findOListModelById(id).get()
        // this.model.setCurrentTaskModel(this.model.getTableListModel().findOListModelById(id).get().getTasksModel(), temp, temp2);
        if (this.model.getTableTaskModel().getCurrRenderListModel().getListID() !== id)
            this.model.getTableTaskModel().setListRenderModel(this.model.getRenderLists().getObservableElementByIdCode(id))
    }

    public handleTaskNameOfCurListChange(taskId: string, newName: string) {
        let listId = this.model.getTableTaskModel().getCurrRenderListModel().getListID();
        if (!listId) return;
        let task = this.model.getRenderLists().getElementByIdCode(listId).getTasksObservable().getElementByIdCode(taskId);
        if (!task) return;
        let oldName = task.getTaskName();

        task.setTaskName(newName);
        task.publishOnFirebase(() => { }, () => {
            task.setTaskName(oldName);
        })
    }

    public handleTaskDescriptionOfCurListChange(taskId: string, newDescription: string) {
        debugger
        let listId = this.model.getTableTaskModel().getCurrRenderListModel().getListID();
        if (!listId) return;
        let task = this.model.getRenderLists().getElementByIdCode(listId).getTasksObservable().getElementByIdCode(taskId);
        if (!task) return;
        let oldDesc = task.getTaskName();
        task.setTaskDescription(newDescription);
        task.publishOnFirebase(() => { }, () => {
            task.setTaskDescription(oldDesc);
        })
    }



    public handleAddList(): string {
        let newList: List = List.createEmptyList();
        let list_id = newList.getListID();
        this.model.getRenderLists().binaryInsert(newList)
        return list_id;
    }

    public handleRemoveList(id: string) {
        let removedList = this.model.getRenderLists().removeElementByElement(this.model.getRenderLists().getElementByIdCode(id));
        if (!removedList) return
        try {
            this.handleChangeCurrentList(this.model.getRenderLists().getElementByIndex(0).getListID());
        } catch (e) {
            console.log(e);
            console.log("Maybe first list doesn't exists")
            this.handleChangeCurrentList(null);
        }
        removedList.removeOnFirebase(() => { }, () => {
            this.model.getRenderLists().binaryInsert(removedList)
        });
    }

    public handleAddTask(): string {

        let listId = this.model.getTableTaskModel().getCurrRenderListModel().getListID();
        let curList = this.model.getRenderLists().getElementByIdCode(listId);
        let newTask = Task.createEmptyTask(curList.getListRef().collection("tasks"));
        curList.getTasksObservable().binaryInsert(newTask)
        return newTask.getTaskID();
    }

    public handleDeleteTask(task_id: string) {
        let listId = this.model.getTableTaskModel().getCurrRenderListModel().getListID();
        let curList = this.model.getRenderLists().getElementByIdCode(listId);
        let removeTask = curList.getTasksObservable().getElementByIdCode(task_id);
        if (!removeTask) return;
        curList.getTasksObservable().removeElementByElement(removeTask);
        removeTask.removeOnFirebase(() => { }, (e) => {
            console.log(e);
            curList.getTasksObservable().binaryInsert(removeTask);
        })
    }

    public handleTickTask(task_id: string) {
        let listId = this.model.getTableTaskModel().getCurrRenderListModel().getListID();
        let curList = this.model.getRenderLists().getElementByIdCode(listId);
        let taskTicked = curList.getTasksObservable().getElementByIdCode(task_id);
        taskTicked.setCompleted(!taskTicked.getCompleted());
        taskTicked.publishOnFirebase(() => { }, () => {
            taskTicked.setCompleted(!taskTicked.getCompleted());
        })
    }

    public handleSharing(uid: string) {
        if (this.model.getTableTaskModel().getCurrRenderListModel().getListID()) {
            debugger
            let list = this.model.getRenderLists().getElementByIdCode(this.model.getTableTaskModel().getCurrRenderListModel().getListID());
            list.addCollab(uid);
            list.publishOnFirebase();
        }

    }

    //Testing 
    // public TestingFunction() {
    //     $("#exampleModal").modal('hide');
    // }
}
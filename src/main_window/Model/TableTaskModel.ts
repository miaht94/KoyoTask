import { ChangeType } from './ChangeType'
import firebase from 'firebase'
import { ObservableArrayObservable, ArrayChangeDetail } from './ObservableArrayObservable';
import { ChangeDetail, Observable } from './Observable';
import { Task } from './Task';
import { v4 as uniqid } from 'uuid';
import { List } from './List';
import { DashboardModel } from './DashboardModel';
export class TableTaskModel {
    protected tasksRenderModel: ObservableArrayObservable<Task>;
    protected currentRenderListModelObservable: Observable<List>;
    protected dashboardModel: DashboardModel;
    protected onModified: (task: Task, atIndex: number) => void;
    protected onRemoved: (task: Task, atIndex: number) => void;
    protected onInserted: (task: Task, atIndex: number) => void;
    protected onCleared: () => void;
    protected onListChangeSomething: (list: List) => void;
    protected detachCallbackOfRenderData: () => void;
    // protected emptyList = List.createEmptyList();
    // protected detachListenerOnTasksOrigin: (callbackId: string) => void;
    protected readonly callbackIdForOrigin: string = uniqid();
    constructor(dashboardModelRef: DashboardModel, currentRenderList?: Observable<List>) {
        // this.tasksRenderModel = renderTasks;
        // this.detachListenerOnTasksOrigin = (callbackId: string) => { };
        // this.tasksRenderModel.addListener(this.commitChange.bind(this), this.callbackIdForTasksOrigin);
        // this.setTasksRenderModel(tasksOrigin);
        this.dashboardModel = dashboardModelRef;
        this.tasksRenderModel = new ObservableArrayObservable<Task>();
        this.detachCallbackOfRenderData = () => { };
        this.tasksRenderModel.addListener(this.commitChangeOnTasks.bind(this), this.callbackIdForOrigin)
        this.currentRenderListModelObservable = new Observable<List>();
        this.currentRenderListModelObservable.addListener(this.commitChangeOnCurrentList.bind(this), this.callbackIdForOrigin)
        if (currentRenderList)
            this.setListRenderModel(currentRenderList);
    }

    public getCurrRenderListModel() {
        return this.currentRenderListModelObservable.get();
    }

    public setListRenderModel(renderList: Observable<List>) {

        this.dispose();
        if (!renderList) {
            this.currentRenderListModelObservable.set(null, true);
            return
        }
        this.currentRenderListModelObservable.set(renderList.get(), true);

        let renderTasks = renderList.get().getTasksObservable();
        renderTasks.addListener(this.syncRenderDataToModel.bind(this), this.callbackIdForOrigin, true);
        this.detachCallbackOfRenderData = () => {
            renderTasks.detachListener(this.callbackIdForOrigin);
        }
    }

    public dispose() {
        this.tasksRenderModel.clear();
        this.detachCallbackOfRenderData();
    }

    public getOnModified(): (task: Task, atIndex: number) => void {
        return this.onModified;
    }

    public getOnRemoved(): (task: Task, atIndex: number) => void {
        return this.onRemoved;
    }

    public getOnInserted(): (task: Task, atIndex: number) => void {
        return this.onInserted;
    }

    public getTaskModelsObservable(): ObservableArrayObservable<Task> {
        return this.tasksRenderModel;
    }

    public bindOnModified(func: (task: Task, atIndex: number) => void): void {
        this.onModified = func;
    }

    public bindOnRemoved(func: (task: Task, atIndex: number) => void): void {
        this.onRemoved = func;
    }

    public bindOnInserted(func: (task: Task, atIndex: number) => void): void {
        this.onInserted = func;
    }

    public bindOnCleared(func: () => void) {
        this.onCleared = func
    }

    public bindOnCurListChangeSth(func: (list: List) => void) {
        this.onListChangeSomething = func;
    }

    // public findOTaskModelById(id: string): Observable<Task> {
    //     for (let i = 0; i < this.tasksRenderModel.length(); i++) {
    //         let target: Observable<Task> = this.tasksRenderModel.getObservableElementByIndex(i);
    //         if (target.get().getTaskID() === id)
    //             return target;
    //     }
    //     return null;
    // }

    // public setNameModelTaskById(id: string, newName: string) {
    //     let target: Observable<Task> = this.findOTaskModelById(id);
    //     target.get().setTaskName(newName);
    // }

    // public setDescriptionModelListById(id: string, newDescription: string) {
    //     let target: Observable<Task> = this.findOTaskModelById(id);
    //     target.get().setTaskDescription(newDescription);
    // }

    public syncRenderDataToModel(changeType: ChangeType, args: ArrayChangeDetail<Task>) {

        switch (changeType) {
            case ChangeType.added:
                console.log("Task Model Added :", args.newElement);
                this.tasksRenderModel.binaryInsert(Task.clone(args.newElement));
                break;
            case ChangeType.removed:
                console.log("Task Model Removed :", args.removedElement);
                this.tasksRenderModel.removeElementByElement(Task.clone(args.removedElement));
                break;
            case ChangeType.modified:

                console.log("Task Model Modified :", args.newElement);
                this.tasksRenderModel.modifyElementByIdCode(Task.clone(args.newElement));
                break;
        }
        console.log("this.arr : ", this.tasksRenderModel);
    }

    protected commitChangeOnTasks(changeType: ChangeType, args: ArrayChangeDetail<Task>, argsCallWithoutChangeRenderModel?: any) {
        switch (changeType) {
            case ChangeType.added:
                this.onInserted(args.newElement, args.atIndex);
                break;
            case ChangeType.modified:
                // Resolve View
                this.onModified(args.newElement, args.atIndex);
                //Resolve Backend (Firebase)
                // args.newElement.publishOnFirebase();
                break;
            case ChangeType.removed:
                this.onRemoved(args.removedElement, args.atIndex);
                break;
            case ChangeType.cleared:
                this.onCleared();
                break;
        }
        if (argsCallWithoutChangeRenderModel) {

        }
    }

    protected commitChangeOnCurrentList(change: ChangeDetail<List>) {
        this.onListChangeSomething(change.newValue);
    }



    // public resolveListRefChange(documentChange: firebase.firestore.DocumentChange<ListModel>) {
    //     switch (documentChange.type) {
    //         case "added":
    //             let newListDocRef: firebase.firestore.DocumentReference = documentChange.doc.get("ref")
    //             // this.commitChange(ChangeType.added, { addedList: ListModel.createEmptyList() })
    //             console.log("Old Index: " + documentChange.oldIndex)
    //             console.log("New Index: " + documentChange.newIndex)
    //             this.commitChange(ChangeType.added, { addedList: documentChange.doc.data() })
    //             break;
    //         case "modified":
    //             console.log("Modified List : ", documentChange.doc.data())
    //             console.log("Old Index: " + documentChange.oldIndex)
    //             console.log("New Index: " + documentChange.newIndex)
    //             this.commitChange(ChangeType.modified, { newList: documentChange.doc.data(), atIndex: documentChange.newIndex })
    //             break;
    //     }
    // }

}
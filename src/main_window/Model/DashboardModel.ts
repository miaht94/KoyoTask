import IO from '../../utils/iosys';
import { Logger } from '../../utils/Logger'
import { ListModel } from './ListModel';
import { TaskModel } from './TaskModel';
import { User } from './User';
import { DashboardView } from '../View/DashboardView';
import firebase from "firebase/app"
import "firebase/firestore";
import { TableListModel } from './TableListModel';
import { ArrayModelObservable } from './ArrayModelObservable';
import { Observable } from './Observable';
import { TableTaskModel } from './TableTaskModel';
export class DashboardModel {

    protected lists: ListModel[] = []; //same
    protected tableListModel: TableListModel;
    protected currentTaskModel: TableTaskModel;
    protected currentTaskColRef: firebase.firestore.CollectionReference;
    protected currentList: ListModel;
    protected currentUser: User;
    protected database: firebase.firestore.Firestore;
    protected Logger: Logger;
    public onChange: Function;
    public onUserChange: Function;
    public onCurrentTaskModelChange: (taskModel: TableTaskModel) => void;

    protected commit() {
        IO.writeData("list_data", JSON.stringify(this.lists, null, "\t"));
        this.onChange(this.currentList);
    };

    constructor(user: firebase.User) {
        IO.init();
        this.currentUser = User.createUserFromFirebaseUser(user)
        this.tableListModel = new TableListModel();
        console.log(firebase.apps.length !== 0)
        this.Logger = new Logger(this);
        this.database = firebase.firestore();
        this.fetchTableList();
        this.currentTaskModel = new TableTaskModel();

        //Init User data
        // this.fetchAllList().then(result => {
        //     this.Logger.Log(result)
        //     this.lists = result;
        //     if (this.lists.length === 0) this.currentList = ListModel.createEmptyList();
        //     else this.currentList = this.lists[0];
        //     this.onChange(this.currentList)
        // })
    }

    public getTableTaskModel() {
        return this.currentTaskModel;
    }

    public getCurrentTaskColRef() {
        return this.currentTaskColRef;
    }

    public getTableListModel(): TableListModel {
        return this.tableListModel;
    }

    public getCurrentUser(): User {
        return this.currentUser;
    }

    public setCurrentUser(user: User): void {
        this.currentUser = user;
    }

    public setCurrentTaskModel(taskModel: TableTaskModel, currentColRef: firebase.firestore.CollectionReference) {

        taskModel.bindOnAdded(this.currentTaskModel.getOnAdded());
        taskModel.bindOnRemoved(this.currentTaskModel.getOnRemoved());
        taskModel.bindOnModified(this.currentTaskModel.getOnModified());
        this.currentTaskColRef = currentColRef;
        this.currentTaskModel.bindOnModified(() => { })
        this.currentTaskModel.bindOnRemoved(() => { })
        this.currentTaskModel.bindOnAdded(() => { })
        console.log(taskModel);
        this.currentTaskModel = taskModel;
        this.onCurrentTaskModelChange(this.currentTaskModel);
    }

    public bindOnCurrentTaskModelChange(callback: (taskModel: TableTaskModel) => void) {
        this.onCurrentTaskModelChange = callback;
    }

    public bindOnChange(viewTriggerFunction: Function) {
        this.onChange = viewTriggerFunction;
    }

    public bindOnUserChange(viewTriggerFunction: Function) {
        this.onUserChange = viewTriggerFunction;
    }

    protected assignCurrentList(listID: string): void {
        let element: any;
        for (element in this.lists) {
            if (element.getListID() === listID) {
                this.setCurrentList(element);
            }
        }
    }

    public setCurrentList(list: ListModel) {
        this.currentList = list;
        this.onChange(this.currentList);
    }

    public getCurrentList(): ListModel {
        return this.currentList;
    }

    // public addTaskCompactToCurrentList(taskName: string, completed: boolean) {
    //     this.currentList.addTaskCompact(taskName, completed);
    //     this.commit();
    // }

    // public deleteTaskFromCurrentList(taskID: string) {
    //     // this.Logger.Log("deleteTaskFromCurrentList executing");
    //     this.currentList.deleteTask(taskID);
    //     this.commit();
    // }

    // public setTaskInCurrentList(taskID: string, that: TaskModel) {
    //     this.currentList.setTask(taskID, that);
    //     this.commit();
    // }

    //Support for fetch Data from Firebase function
    // private async fetchAllList(): Promise<ListModel[]> {
    //     let userSnapshot: firebase.firestore.DocumentSnapshot = await this.database.collection("users").doc(this.currentUser.getUID()).get();
    //     let listsRefArray: firebase.firestore.DocumentReference[] = userSnapshot.get("lists");
    //     console.log(listsRefArray);
    //     let listsArray: ListModel[] = [];
    //     // fetch Lists data then push into listsArray 
    //     for (let listRef of listsRefArray) {

    //         let listSnapshot: firebase.firestore.DocumentSnapshot<ListModel> = await listRef.withConverter(ListModel.ListConverter).get()
    //         let list: ListModel = listSnapshot.data();

    //         // Take task QuerySnapshot with converter in tasks subcollection locate at each List Document
    //         let tasksQuerySnapshot: firebase.firestore.QuerySnapshot<TaskModel> = await listRef.collection("tasks").withConverter(TaskModel.TaskConverter).get();
    //         let tasksSnapshot: firebase.firestore.QueryDocumentSnapshot<TaskModel>[] = tasksQuerySnapshot.docs;

    //         //push each task into tasks[] of List structure
    //         for (let taskSnapshot of tasksSnapshot) {
    //             console.log(taskSnapshot.data().getTaskName())
    //             list.addTask(taskSnapshot.data());
    //         }

    //         //push list into array after push tasks into list
    //         listsArray.push(list)
    //     }
    //     return new Promise<ListModel[]>((resolve, reject) => {
    //         console.log(listsArray)
    //         resolve(listsArray);
    //     });
    // }

    private fetchTableList(): void {
        let userDocRef: firebase.firestore.DocumentReference = this.database.collection("users").doc(this.currentUser.getUID());
        let listColRef: firebase.firestore.CollectionReference = userDocRef.collection("listsRef");
        let listModelsObservable: ArrayModelObservable<ListModel> = this.getTableListModel().getListModelsObservable();
        this.database.collection("lists").where("collaborators", "array-contains", userDocRef).withConverter(ListModel.ListConverter).onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {

                if (change.type === "added") {
                    console.log("New List Ref: ", change.doc.data());
                    let bool: boolean = true
                    for (let i = 0; i < listModelsObservable.length(); i++) {
                        if (change.doc.data().getListID() == listModelsObservable.getByIndex(i).getListID()) {
                            bool = false;
                            break;
                        }
                    }
                    if (bool)
                        listModelsObservable.addElement(change.doc.data());

                }
                if (change.type === "modified") {

                    console.log("Modified List Ref: ", change.doc.data());
                    listModelsObservable.modifyElement(change.doc.data(), change.newIndex);
                }
                if (change.type === "removed") {
                    console.log("Removed List Ref: ", change.doc.data());
                    listModelsObservable.removeElement(change.oldIndex);
                }

            })
        })
    }
}
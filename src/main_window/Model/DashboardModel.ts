import IO from '../../Utils/iosys';
import { Logger } from '../../Utils/Logger'
import { User } from './User';
import { DashboardView } from '../View/DashboardView';
import firebase from "firebase/app"
import "firebase/firestore";
import { TableListModel } from './TableListModel';
import { ObservableArrayObservable } from './ObservableArrayObservable';
import { Observable } from './Observable';
import { TableTaskModel } from './TableTaskModel';
import { List } from './List';
export class DashboardModel {

    protected lists: ObservableArrayObservable<List>; //same
    protected tableListModel: TableListModel;
    protected currentTaskModel: TableTaskModel;
    protected currentTaskColRef: firebase.firestore.CollectionReference;
    protected currentUser: User;
    protected database: firebase.firestore.Firestore;
    protected Logger: Logger;
    public onChange: Function;
    public onUserChange: Function;
    public onCurrentTaskModelChange: (taskModel: TableTaskModel) => void;

    // protected commit() {
    //     IO.writeData("list_data", JSON.stringify(this.lists, null, "\t"));
    //     this.onChange(this.currentList);
    // };

    constructor(user: firebase.User) {
        IO.init();
        this.currentUser = User.createUserFromFirebaseUser(user)
        this.lists = new ObservableArrayObservable<List>();
        this.tableListModel = new TableListModel(this.lists);

        console.log(firebase.apps.length !== 0)
        this.Logger = new Logger(this);
        this.database = firebase.firestore();
        this.fetchTableList();
        // this.currentTaskModel = new TableTaskModel();

        //Init User data
        // this.fetchAllList().then(result => {
        //     this.Logger.Log(result)
        //     this.lists = result;
        //     if (this.lists.length === 0) this.currentList = ListModel.createEmptyList();
        //     else this.currentList = this.lists[0];
        //     this.onChange(this.currentList)
        // })
    }

    public getLists() {
        return this.lists;
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

    // public setCurrentTaskModel(taskModel: TableTaskModel, currentColRef: firebase.firestore.CollectionReference, listModelOfTask: ListModel) {

    //     taskModel.bindOnAdded(this.currentTaskModel.getOnAdded());
    //     taskModel.bindOnRemoved(this.currentTaskModel.getOnRemoved());
    //     taskModel.bindOnModified(this.currentTaskModel.getOnModified());
    //     this.currentTaskColRef = currentColRef;
    //     this.currentTaskModel.bindOnModified(() => { })
    //     this.currentTaskModel.bindOnRemoved(() => { })
    //     this.currentTaskModel.bindOnAdded(() => { })
    //     console.log(taskModel);
    //     this.currentTaskModel = taskModel;
    //     this.onCurrentTaskModelChange(this.currentTaskModel);
    //     this.currentList = listModelOfTask;
    // }

    public bindOnCurrentTaskModelChange(callback: (taskModel: TableTaskModel) => void) {
        this.onCurrentTaskModelChange = callback;
    }

    public bindOnChange(viewTriggerFunction: Function) {
        this.onChange = viewTriggerFunction;
    }

    public bindOnUserChange(viewTriggerFunction: Function) {
        this.onUserChange = viewTriggerFunction;
    }

    // protected assignCurrentList(listID: string): void {
    //     let element: any;
    //     for (element in this.lists) {
    //         if (element.getListID() === listID) {
    //             this.setCurrentList(element);
    //         }
    //     }
    // }

    // public setCurrentList(list: ListModel) {
    //     this.currentList = list;
    //     this.onChange(this.currentList);
    // }

    // public getCurrentList(): ListModel {
    //     return this.currentList;
    // }

    private fetchTableList(): void {
        let userDocRef: firebase.firestore.DocumentReference = this.database.collection("users").doc(this.currentUser.getUID());
        let listColRef: firebase.firestore.CollectionReference = userDocRef.collection("listsRef");
        let lists: ObservableArrayObservable<List> = this.getLists();
        this.database.collection("lists").where("collaborators", "array-contains", userDocRef).withConverter(List.ListConverter).onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                let data = change.doc.data()
                if (change.type === "added") {
                    console.log("New List Ref: ", data);
                    lists.binaryInsert(data);

                }
                if (change.type === "modified") {
                    console.log("Modified List Ref: ", data);
                    lists.modifyElementByIdCode(data);
                }
                if (change.type === "removed") {
                    console.log("Removed List Ref: ", data);
                    lists.removeElementByElement(data);
                }

            })
        })
    }
}
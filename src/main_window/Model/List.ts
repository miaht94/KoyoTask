import firebase from 'firebase/app'
import { ObservableArrayObservable } from './ObservableArrayObservable';
import { Observable } from './Observable';
import { ArrayObservable } from './ObservableArray';
import { TableTaskModel } from './TableTaskModel';
import { Task } from './Task';
import { Comparator } from '../../Utils/Comparator';
import { IdentifyCode } from '../../Utils/IdentifyCode';
export class List implements Comparator<List>, IdentifyCode {

    private tasks: ObservableArrayObservable<Task>;
    private listID: Observable<string> = new Observable<string>();
    private listName: Observable<string> = new Observable<string>();
    private listDescription: Observable<string> = new Observable<string>();
    private listIcon: Observable<string> = new Observable<string>();
    private listRef: firebase.firestore.DocumentReference;
    private collaborators: ArrayObservable<firebase.firestore.DocumentReference>;
    private createdDate: Observable<firebase.firestore.Timestamp> = new Observable<firebase.firestore.Timestamp>();
    // If callback use this keyword in itself, callback must bind its class first
    private listenersCallback: ((newList: List) => void)[] = [];
    constructor(list: { tasks: ObservableArrayObservable<Task>; list_id: string; list_name: string; listDescription: string; list_icon: string; collaborators: firebase.firestore.DocumentReference[], createdDate: firebase.firestore.Timestamp, list_ref?: firebase.firestore.DocumentReference }) {
        if (list === undefined) throw new Error("Illegal JSON Argument")
        this.tasks = list.tasks;
        this.listID.set(list.list_id);
        this.listName.set(list.list_name);
        this.listDescription.set(list.listDescription);
        this.listIcon.set(list.list_icon);
        this.listRef = list.list_ref;
        this.createdDate.set(list.createdDate);
        this.collaborators = new ArrayObservable<firebase.firestore.DocumentReference>(list.collaborators)
    }
    public getIdCode(): string {
        return this.getListID();
    }
    public compare(o1: List, o2: List): number {
        if (o1.getCreatedDate().toDate().getTime() === o2.getCreatedDate().toDate().getTime()) {
            if (o1.toString() === o2.toString()) return 0
            else return o1.toString() > o2.toString() ? 1 : -1;
        }
        else {
            return o1.getCreatedDate().toDate().getTime() > o2.getCreatedDate().toDate().getTime() ? 1 : -1
        }
    }

    public getCollaboratorAsString(): string {
        let arr = this.getCollaborators();
        let returnArr = [];
        for (let i of arr) {
            returnArr.push(i.id);
        }
        return returnArr.toString();
    }

    public static cloneWithoutTask(list: List): List {
        return new List({
            "list_id": list.getListID(),
            "list_name": list.getListName(),
            "listDescription": list.getListDescription(),
            "list_icon": list.getListIcon(),
            "list_ref": list.getListRef(),
            "collaborators": list.getCollaborators(),
            "createdDate": list.getCreatedDate(),
            "tasks": new ObservableArrayObservable<Task>()
        })
    }

    public getListRef(): firebase.firestore.DocumentReference {
        return this.listRef;
    }

    public getCreatedDate() {
        return this.createdDate.get();
    }

    public setCreatedDate(timestamp: firebase.firestore.Timestamp) {
        return this.createdDate.set(timestamp);
    }

    public static createEmptyList(): List {
        let ref: firebase.firestore.DocumentReference;
        ref = firebase.firestore().collection("lists").doc();
        return new List({
            "list_id": ref.id,
            "list_name": "",
            "listDescription": "",
            "list_icon": "",
            "list_ref": ref,
            "createdDate": firebase.firestore.Timestamp.fromDate(new Date()),
            "collaborators": [firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)],
            "tasks": new ObservableArrayObservable<Task>(),
        })
    }



    public addListener(callback: (newList: List) => void): void {
        this.listenersCallback.push(callback);
    }

    public getTasksObservable(): ObservableArrayObservable<Task> { return this.tasks; }

    public getTasks(): Array<Task> {
        return this.tasks.getAllElements();
    }

    // public getTasksModel(): TableTaskModel {
    //     return this.tasksModel;
    // }

    public getCollaborators(): firebase.firestore.DocumentReference[] {
        return this.collaborators.getAllElements();
    }

    public getListID(): string { return this.listID.get(); }

    public getListName(): string { return this.listName.get(); }

    public getListDescription(): string { return this.listDescription.get(); }

    public getListIcon(): string { return this.listIcon.get(); }

    public setListID(listID: string): void {
        this.listID.set(listID);

    }

    public addCollab(uid: string) {
        this.collaborators.addElement(firebase.firestore().collection("users").doc(uid))
    }

    public setListName(listName: string): void {
        this.listName.set(listName);

    }

    public setListDescription(listDescription: string): void {
        this.listDescription.set(listDescription);

    }

    public setListIcon(listIcon: string): void {
        this.listIcon.set(listIcon);

    }

    public toString(): string {
        return JSON.stringify({
            "list_id": this.getListID(),
            "list_name": this.getListName(),
            "listDescription": this.getListDescription(),
            "list_icon": this.getListIcon(),
            "createdDate": this.getCreatedDate().toDate().getTime(),
            "collaborators": this.getCollaboratorAsString(),
        });
    }

    // public addTaskCompact(taskName: string, completed: boolean): void {
    //     this.tasks.addElement(TaskModel.createNewTaskCompact(taskName, completed));

    // }

    // public addTask(task: TaskModel) {
    //     this.tasks.addElement(TaskModel.createNewTaskByJson(task));

    // }

    // public addDefinedTask(task: any) {
    //     this.tasks.addElement(task);

    // }

    // public deleteTask(taskID: string): void {
    //     for (var i = 0; i < this.tasks.length(); i++) {
    //         var obj = this.tasks.getByIndex(i);
    //         if (obj.getTaskID() == taskID) { this.tasks.removeElement(i); }
    //     }

    // }

    // public setTask(taskID: string, task: TaskModel) {
    //     for (var i = 0; i < this.tasks.length(); i++) {
    //         var obj = this.tasks.getByIndex(i);
    //         if (obj.getTaskID() == taskID) { obj.setTask(task); }
    //     }

    // }

    public publishOnFirebase(onDone: () => void = () => { }, onError: (error: any) => void = () => { }): void {
        if (this.listRef) {
            this.listRef.withConverter(List.ListConverter).set(this).then(() => {
                onDone();
            }).catch((error) => {
                onError(error);
            })
        }
    }

    public removeOnFirebase(onDone: () => void = () => { }, onError: (error: any) => void = () => { }): void {
        if (this.listRef) {
            this.listRef.delete().then(() => {
                onDone();
            }).catch((error) => {
                onError(error);
            })
        }
    }

    static ListConverter = {
        toFirestore(list: List): firebase.firestore.DocumentData {
            return {
                list_name: list.getListName() ? list.getListName() : "",
                list_icon: list.getListIcon() ? list.getListIcon() : "",
                list_description: list.getListDescription() ? list.getListDescription() : "",
                collaborators: list.getCollaborators(),
                createdDate: list.getCreatedDate()
            }
        },
        fromFirestore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
        ): List {
            const data = snapshot.data(options)!;
            let list = {
                list_id: snapshot.id,
                list_name: data.list_name,
                list_icon: data.list_icon,
                listDescription: data.list_description,
                list_ref: snapshot.ref,
                createdDate: data.createdDate,
                collaborators: data.collaborators,
                tasks: new ObservableArrayObservable<Task>()
            };

            let returnList: List = new List(list);
            snapshot.ref.collection("tasks").withConverter(Task.TaskConverter).orderBy("createdDate").onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    let data = change.doc.data();
                    if (change.type === "added") {
                        let taskModelsObservable = returnList.getTasks()
                        console.log("New Task ", "[", change.doc.id, "] :", data);
                        returnList.getTasksObservable().binaryInsert(data);
                    }
                    if (change.type === "modified") {

                        console.log("Modified Task: ", "[", change.doc.id, "] :", change.doc.data());
                        returnList.getTasksObservable().modifyElementByIdCode(data);
                    }
                    if (change.type === "removed") {
                        console.log("Removed Task: ", "[", change.doc.id, "] :", data);
                        returnList.getTasksObservable().removeElementByElement(data);
                    }
                })
            })
            // setInterval(() => {
            //     console.log(returnList.getListName(), " : ", returnList.getTasksModel().getOnModified() != undefined);
            // }, 3000)
            // console.log("Final List ", "[", snapshot.id, "] : ")

            return returnList;
        }
    };
}

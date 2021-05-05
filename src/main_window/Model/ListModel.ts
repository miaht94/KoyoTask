import { TaskModel } from './TaskModel'
import firebase from 'firebase/app'
import { ArrayModelObservable } from './ArrayModelObservable';
import { Observable } from './Observable';
import { ArrayObservable } from './ArrayObservable';
import { TableTaskModel } from './TableTaskModel';
export class ListModel {

    private tasksModel: TableTaskModel;
    private listID: Observable<string> = new Observable<string>();
    private listName: Observable<string> = new Observable<string>();
    private listDescription: Observable<string> = new Observable<string>();
    private listIcon: Observable<string> = new Observable<string>();
    private listRef: firebase.firestore.DocumentReference;
    private collaborators: ArrayObservable<firebase.firestore.DocumentReference>;
    // If callback use this keyword in itself, callback must bind its class first
    private listenersCallback: ((newList: ListModel) => void)[] = [];
    constructor(list: { tasksModel: TableTaskModel; list_id: string; list_name: string; listDescription: string; list_icon: string; collaborators: firebase.firestore.DocumentReference[], list_ref?: firebase.firestore.DocumentReference }) {
        if (list === undefined) throw new Error("Illegal JSON Argument")
        this.tasksModel = list.tasksModel;
        this.listID.set(list.list_id);
        this.listName.set(list.list_name);
        this.listDescription.set(list.listDescription);
        this.listIcon.set(list.list_icon);
        this.listRef = list.list_ref;
        this.collaborators = new ArrayObservable<firebase.firestore.DocumentReference>(list.collaborators)
        console.log("Test : ");
        // for (let task of list.tasks) {
        //     //console.log(task);
        //     if (task === undefined) throw new Error("Illegal JSON Argument");
        //     this.tasks.addElement(TaskModel.createNewTaskByJson(task))
        // }
    }

    public getListRef(): firebase.firestore.DocumentReference {
        return this.listRef;
    }

    public static createEmptyList(): ListModel {
        let ref: firebase.firestore.DocumentReference;
        ref = firebase.firestore().collection("lists").doc();
        return new ListModel({
            "list_id": ref.id,
            "list_name": "",
            "listDescription": "",
            "list_icon": "",
            "list_ref": ref,
            "collaborators": [firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)],
            "tasksModel": new TableTaskModel(),
        })
    }



    public addListener(callback: (newList: ListModel) => void): void {
        this.listenersCallback.push(callback);
    }

    public getTasksObservable(): ArrayModelObservable<TaskModel> { return this.tasksModel.getTaskModelsObservable(); }

    public getTasks(): Array<TaskModel> {
        return this.tasksModel.getTaskModelsObservable().getAllElements();
    }

    public getTasksModel(): TableTaskModel {
        return this.tasksModel;
    }

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

    public setListName(listName: string): void {
        this.listName.set(listName);

    }

    public setListDescription(listDescription: string): void {
        this.listDescription.set(listDescription);

    }

    public setListIcon(listIcon: string): void {
        this.listIcon.set(listIcon);

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

    public publishOnFirebase(): void {
        if (this.listRef) {
            this.listRef.withConverter(ListModel.ListConverter).set(this)
        }
    }

    static ListConverter = {
        toFirestore(list: ListModel): firebase.firestore.DocumentData {
            return {
                list_name: list.getListName() ? list.getListName() : "",
                list_icon: list.getListIcon() ? list.getListIcon() : "",
                list_description: list.getListDescription() ? list.getListDescription() : "",
                collaborators: list.getCollaborators()
            }
        },
        fromFirestore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
        ): ListModel {
            const data = snapshot.data(options)!;
            let list = {
                list_id: snapshot.id,
                list_name: data.list_name,
                list_icon: data.list_icon,
                listDescription: data.list_description,
                list_ref: snapshot.ref,
                collaborators: data.collaborators,
                tasksModel: new TableTaskModel()
            };

            let returnList: ListModel = new ListModel(list);
            snapshot.ref.collection("tasks").withConverter(TaskModel.TaskConverter).onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        let taskModelsObservable = returnList.getTasks()
                        console.log("New Task ", "[", change.doc.id, "] :", change.doc.data());
                        let bool: boolean = true
                        for (let i = 0; i < taskModelsObservable.length; i++) {
                            if (change.doc.data().getTaskID() == taskModelsObservable[i].getTaskID()) {
                                bool = false;
                                break;
                            }
                        }
                        if (bool)
                            returnList.getTasksModel().getTaskModelsObservable().addElement(change.doc.data());
                    }
                    if (change.type === "modified") {

                        console.log("Modified Task: ", "[", change.doc.id, "] :", change.doc.data());
                        returnList.getTasksModel().getTaskModelsObservable().modifyElement(change.doc.data(), change.newIndex);
                    }
                    if (change.type === "removed") {
                        console.log("Removed Task: ", "[", change.doc.id, "] :", change.doc.data());
                        returnList.getTasksModel().getTaskModelsObservable().removeElement(change.oldIndex);
                    }
                })
            })
            // setInterval(() => {
            //     console.log(returnList.getListName(), " : ", returnList.getTasksModel().getOnModified() != undefined);
            // }, 3000)
            // console.log("Final List ", "[", snapshot.id, "] : ")

            console.log(returnList)
            return returnList;
        }
    };
}

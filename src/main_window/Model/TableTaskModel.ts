import { ListModel } from './ListModel'
import { ChangeType } from './ChangeType'
import firebase from 'firebase'
import { ArrayModelObservable, ArrayModelChangeDetail } from './ArrayModelObservable';
import { Observable } from './Observable';
import { TaskModel } from './TaskModel';
export class TableTaskModel {
    protected taskModelsObservable: ArrayModelObservable<TaskModel>;
    protected onModified: (task: TaskModel) => void;
    protected onRemoved: (task: TaskModel) => void;
    protected onAdded: (task: TaskModel) => void;
    protected onInsert: (task: TaskModel) => void;
    constructor() {
        this.taskModelsObservable = new ArrayModelObservable<TaskModel>();
        this.taskModelsObservable.addListener(this.commitChange.bind(this));

    }

    public getOnModified(): (task: TaskModel) => void {
        return this.onModified;
    }

    public getOnRemoved(): (task: TaskModel) => void {
        return this.onRemoved;
    }

    public getOnAdded(): (task: TaskModel) => void {
        return this.onAdded;
    }

    public getOnInsert(): (task: TaskModel) => void {
        return this.onInsert;
    }

    public getTaskModelsObservable(): ArrayModelObservable<TaskModel> {
        return this.taskModelsObservable;
    }

    public bindOnModified(func: (task: TaskModel) => void): void {
        this.onModified = func;
    }

    public bindOnRemoved(func: (task: TaskModel) => void): void {
        this.onRemoved = func;
    }

    public bindOnAdded(func: (task: TaskModel) => void): void {
        this.onAdded = func;
    }

    public bindOnInserted(func: (task: TaskModel) => void): void {
        this.onInsert = func;
    }

    public findOTaskModelById(id: string): Observable<TaskModel> {
        for (let i = 0; i < this.taskModelsObservable.length(); i++) {
            let target: Observable<TaskModel> = this.taskModelsObservable.getObservableByIndex(i);
            if (target.get().getTaskID() === id)
                return target;
        }
        return null;
    }

    public setNameModelTaskById(id: string, newName: string) {
        let target: Observable<TaskModel> = this.findOTaskModelById(id);
        target.get().setTaskName(newName);
    }

    public setDescriptionModelListById(id: string, newDescription: string) {
        let target: Observable<TaskModel> = this.findOTaskModelById(id);
        target.get().setTaskDescription(newDescription);
    }


    protected commitChange(changeType: ChangeType, args: ArrayModelChangeDetail<TaskModel>) {
        switch (changeType) {
            case ChangeType.added:
                // Resolve View
                if (this.onAdded)
                    this.onAdded(args.addedElement);

                //Resolve Backend (Firebase)

                break;
            case ChangeType.modified:
                // Resolve View
                if (this.onModified)
                    this.onModified(args.newElement);
                //Resolve Backend (Firebase)
                args.newElement.publishOnFirebase();
                break;
            case ChangeType.removed:
                break;
        }
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
import { ChangeType } from './ChangeType'
import firebase from 'firebase'
import { ObservableArrayObservable, ArrayChangeDetail } from './ObservableArrayObservable';
import { Observable } from './Observable';
import { Task } from './Task';
export class TableTaskModel {
    protected taskModelsObservable: ObservableArrayObservable<Task>;
    protected onModified: (task: Task) => void;
    protected onRemoved: (task: Task) => void;
    protected onInserted: (task: Task) => void;
    constructor(tasks: ObservableArrayObservable<Task>) {
        this.taskModelsObservable = new ObservableArrayObservable<Task>();
        this.taskModelsObservable.addListener(this.commitChange.bind(this));

    }

    public dispose() {

    }

    public getOnModified(): (task: Task) => void {
        return this.onModified;
    }

    public getOnRemoved(): (task: Task) => void {
        return this.onRemoved;
    }

    public getOnInserted(): (task: Task) => void {
        return this.onInserted;
    }

    public getTaskModelsObservable(): ObservableArrayObservable<Task> {
        return this.taskModelsObservable;
    }

    public bindOnModified(func: (task: Task) => void): void {
        this.onModified = func;
    }

    public bindOnRemoved(func: (task: Task) => void): void {
        this.onRemoved = func;
    }

    public bindOnInserted(func: (task: Task) => void): void {
        this.onInserted = func;
    }

    public findOTaskModelById(id: string): Observable<Task> {
        for (let i = 0; i < this.taskModelsObservable.length(); i++) {
            let target: Observable<Task> = this.taskModelsObservable.getObservableElementByIndex(i);
            if (target.get().getTaskID() === id)
                return target;
        }
        return null;
    }

    public setNameModelTaskById(id: string, newName: string) {
        let target: Observable<Task> = this.findOTaskModelById(id);
        target.get().setTaskName(newName);
    }

    public setDescriptionModelListById(id: string, newDescription: string) {
        let target: Observable<Task> = this.findOTaskModelById(id);
        target.get().setTaskDescription(newDescription);
    }


    protected commitChange(changeType: ChangeType, args: ArrayChangeDetail<Task>) {
        switch (changeType) {
            case ChangeType.added:
                if (this.onInserted)
                    this.onInserted(args.newElement);
                break;
            case ChangeType.modified:
                // Resolve View
                if (this.onModified)
                    this.onModified(args.newElement);
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
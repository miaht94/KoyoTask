import { ListModel } from './ListModel'
import { ChangeType } from './ChangeType'
import firebase from 'firebase'
import { ArrayModelObservable, ArrayModelChangeDetail } from './ArrayModelObservable';
import { Observable } from './Observable';
export class TableListModel {
    protected listModelsObservable: ArrayModelObservable<ListModel>;
    protected onModified: Function;
    protected onRemoved: Function;
    protected onAdded: Function;
    protected onInsert: Function;
    constructor() {
        this.listModelsObservable = new ArrayModelObservable<ListModel>();
        this.listModelsObservable.addListener(this.commitChange.bind(this));

    }

    public getListModelsObservable(): ArrayModelObservable<ListModel> {
        return this.listModelsObservable;
    }

    public bindOnModified(func: Function): void {
        this.onModified = func;
    }

    public bindOnRemoved(func: Function): void {
        this.onRemoved = func;
    }

    public bindOnAdded(func: Function): void {
        this.onAdded = func;
    }

    public bindOnInserted(func: Function): void {
        this.onInsert = func;
    }

    public findOListModelById(id: string): Observable<ListModel> {
        for (let i = 0; i < this.listModelsObservable.length(); i++) {
            let target: Observable<ListModel> = this.listModelsObservable.getObservableByIndex(i);
            if (target.get().getListID() === id)
                return target;
        }
        return null;
    }

    public setNameModelListById(id: string, newName: string) {
        let target: Observable<ListModel> = this.findOListModelById(id);
        target.get().setListName(newName);
    }

    public setDescriptionModelListById(id: string, newDescription: string) {
        let target: Observable<ListModel> = this.findOListModelById(id);
        target.get().setListDescription(newDescription);
    }


    protected commitChange(changeType: ChangeType, args: ArrayModelChangeDetail<ListModel>) {
        switch (changeType) {
            case ChangeType.added:
                // Resolve View
                this.onAdded(args.addedElement);

                //Resolve Backend (Firebase)


                break;
            case ChangeType.modified:
                // Resolve View
                this.onModified(args.newElement, args.atIndex);
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
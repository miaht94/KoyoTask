import { List } from './List'
import { ChangeType } from './ChangeType'
import firebase from 'firebase'
import { ObservableArrayObservable, ArrayChangeDetail } from './ObservableArrayObservable';
import { Observable } from './Observable';
export class TableListModel {
    protected listsRenderModel: ObservableArrayObservable<List>;
    protected onModified: (list: List, atIndex: number) => void;
    protected onRemoved: (list: List, atIndex: number) => void;
    protected onInserted: (list: List, atIndex: number) => void;
    constructor(renderLists: ObservableArrayObservable<List>) {
        this.listsRenderModel = renderLists;
        this.listsRenderModel.addListener(this.commitChange.bind(this));
        // originLists.addListener(this.syncLocalDataToRenderData.bind(this));
    }

    // public addSourceList(newSouceList: ObservableArrayObservable<List>) {
    //     if (newSouceList) {
    //         newSouceList.addListener(this.syncLocalDataToRenderData.bind(this));
    //     }
    // }

    public getListsRenderModel(): ObservableArrayObservable<List> {
        return this.listsRenderModel;
    }

    public bindOnModified(func: (list: List, atIndex: number) => void): void {
        this.onModified = func;
    }

    public bindOnRemoved(func: (list: List, atIndex: number) => void): void {
        this.onRemoved = func;
    }

    public bindOnInserted(func: (list: List, atIndex: number) => void): void {
        this.onInserted = func;
    }



    public findOListModelById(id: string): Observable<List> {
        for (let i = 0; i < this.listsRenderModel.length(); i++) {
            let target: Observable<List> = this.listsRenderModel.getObservableElementByIndex(i);
            if (target.get().getListID() === id)
                return target;
        }
        return null;
    }

    public setNameModelListById(id: string, newName: string) {
        let target: Observable<List> = this.findOListModelById(id);
        target.get().setListName(newName);
    }

    public setDescriptionModelListById(id: string, newDescription: string) {
        let target: Observable<List> = this.findOListModelById(id);
        target.get().setListDescription(newDescription);
    }

    // public syncRenderDataToModel(changeType: ChangeType, args: ArrayChangeDetail<List>) {
    //     switch (changeType) {
    //         case ChangeType.added:

    //             this.listsRenderModel.binaryInsert(List.cloneWithoutTask(args.newElement));
    //             break;
    //         case ChangeType.removed:
    //             this.listsRenderModel.removeElementByElement(List.cloneWithoutTask(args.removedElement));
    //             break;
    //         case ChangeType.modified:
    //             this.listsRenderModel.modifyElementByIdCode(List.cloneWithoutTask(args.newElement));
    //             break;
    //     }
    // }


    protected commitChange(changeType: ChangeType, args: ArrayChangeDetail<List>) {
        switch (changeType) {
            case ChangeType.added:
                // Resolve View

                this.onInserted(args.newElement, args.atIndex);

                //Resolve Backend (Firebase)
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
        }
    }

}
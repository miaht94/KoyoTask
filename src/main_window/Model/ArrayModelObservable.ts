import { Debugger } from "electron";
import { ChangeType } from "./ChangeType";
import { ListModel } from "./ListModel";
import { ChangeDetail, Observable } from "./Observable";

export interface ArrayModelChangeDetail<T extends Object> {
    addedElement?: T;
    newElement?: T;
    atIndex?: number
}

export class ArrayModelObservable<T extends Object> {
    protected arr: Array<Observable<T>>;
    protected listenersCallback: Array<(changeType: ChangeType, args: ArrayModelChangeDetail<T>) => void>;
    public isObservableObject: boolean = true;
    constructor() {
        this.arr = new Array<Observable<T>>();
        this.listenersCallback = new Array<(changeType: ChangeType, args: ArrayModelChangeDetail<T>) => void>();
    }

    protected notifyAllListeners(changeType: ChangeType, args: ArrayModelChangeDetail<T>) {
        for (let callback of this.listenersCallback) {
            callback(changeType, args);
        }
    }

    public addListener(callback: (changeType: ChangeType, args: ArrayModelChangeDetail<T>) => void): void {
        this.listenersCallback.push(callback);
    }

    public removeAllListener(): void {
        this.listenersCallback = [];
    }

    public getByIndex(index: number) {
        return this.arr[index].get();
    }

    public getObservableByIndex(index: number) {
        return this.arr[index];
    }



    public getAllElements(): Array<T> {
        let returnArr: Array<T> = new Array<T>();
        for (let i = 0; i < this.length(); i++) {
            returnArr.push(this.getByIndex(i));
        }
        return returnArr;
    }

    public length(): number {
        return this.arr.length;
    }

    public addElement(newElement: T) {
        let listModelObservable: Observable<T> = new Observable<T>();

        this.notifyAllListeners(ChangeType.added, { addedElement: newElement });
        listModelObservable.addListener(((change: ChangeDetail<T>) => {
            this.notifyAllListeners(ChangeType.modified, { newElement: change.newValue })
        }).bind(this))
        this.arr.push(listModelObservable);

        listModelObservable.set(newElement)

    }

    public modifyElement(newElement: T, pos: number) {
        this.arr[pos].set(newElement);
        // this.notifyAllListeners(ChangeType.modified, { newElement: newElement, atIndex: pos });
    }

    public insertElement(newElement: T, pos: number) {
        if (pos > this.arr.length) throw new Error("Insert element into arr[] error, pos > length of arr[]");
        let listModelObservable: Observable<T> = new Observable<T>();
        listModelObservable.set(newElement)
        this.arr.splice(pos, 0, listModelObservable);
        this.notifyAllListeners(ChangeType.added, { addedElement: newElement, atIndex: pos });
    }

    public removeElement(index: number) {
        if (index >= this.arr.length) throw new Error("Delete element from arr[] error, index >= length of arr[]");
        this.arr.splice(index, 1);
        this.notifyAllListeners(ChangeType.removed, { atIndex: index });
    }
}
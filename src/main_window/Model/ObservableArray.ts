import { ChangeType } from "./ChangeType";

export interface ArrayChangeDetail<T extends Object> {
    addedElement?: T;
    newElement?: T;
    atIndex?: number
}

export class ArrayObservable<T extends Object> {
    protected arr: Array<T>;
    protected listenersCallback: Array<(changeType: ChangeType, args: ArrayChangeDetail<T>) => void>;
    public isObservableObject: boolean = true;
    constructor(arr?: T[]) {
        this.arr = new Array<T>();
        if (arr) {
            for (let element of arr) {
                this.arr.push(element);
            }
        }
        this.listenersCallback = new Array<(changeType: ChangeType, args: ArrayChangeDetail<T>) => void>();
    }

    protected notifyAllListeners(changeType: ChangeType, args: ArrayChangeDetail<T>) {
        for (let callback of this.listenersCallback) {
            callback(changeType, args);
        }
    }

    public addListener(callback: (changeType: ChangeType, args: ArrayChangeDetail<T>) => void): void {
        this.listenersCallback.push(callback);
    }

    public removeAllListener(): void {
        this.listenersCallback = [];
    }

    public getByIndex(index: number) {
        return this.arr[index];
    }

    public indexOf(object: T): number {
        return this.arr.indexOf(object);
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
        this.arr.push(newElement);
        this.notifyAllListeners(ChangeType.added, { addedElement: newElement });
    }

    public modifyElement(newElement: T, pos: number) {
        this.arr[pos] = newElement;
        this.notifyAllListeners(ChangeType.modified, { newElement: newElement, atIndex: pos });
    }

    public insertElement(newElement: T, pos: number) {
        if (pos > this.arr.length) throw new Error("Insert element into arr[] error, pos > length of arr[]");
        this.arr.splice(pos, 0, newElement);
        this.notifyAllListeners(ChangeType.added, { addedElement: newElement, atIndex: pos });
    }

    public removeElement(index: number) {
        if (index >= this.arr.length) throw new Error("Delete element from arr[] error, index >= length of arr[]");
        this.arr.splice(index, 1);
        this.notifyAllListeners(ChangeType.removed, { atIndex: index });
    }
}
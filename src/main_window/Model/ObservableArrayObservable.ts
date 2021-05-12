import { Debugger } from "electron";
import { v4 as uniqid } from 'uuid';
import { ChangeType } from "./ChangeType";
import { Comparator } from "../../Utils/Comparator";
import { ChangeDetail, Observable } from "./Observable";
import { IdentifyCode } from "../../Utils/IdentifyCode";

export interface ArrayChangeDetail<T extends IdentifyCode & Comparator<T>> {
    newElement?: T;
    atIndex?: number;
    removedElement?: T;
    identifyCode?: string;
}

export class ObservableArrayObservable<T extends Comparator<T> & IdentifyCode> {
    protected arr: Array<Observable<T>>;
    protected listenersCallback: Array<(changeType: ChangeType, args: ArrayChangeDetail<T>) => void>;
    protected idListenerForElement = uniqid();
    constructor() {
        this.arr = new Array<Observable<T>>();
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

    public getElementByIndex(index: number) {
        return this.arr[index].get();
    }

    public getElementByIdCode(idCode: string): T {
        let id = this.indexOfByIdCode(idCode);
        if (id !== -1) return this.arr[id].get();
        return null;
    }

    public getObservableElementByIndex(index: number) {
        return this.arr[index];
    }

    public getObservableElementByIdCode(idCode: string) {
        let id = this.indexOfByIdCode(idCode);
        if (id !== -1) return this.arr[id];
        return null;
    }

    public indexOfByIdCode(idCode: string): number {
        let index = -1;
        for (let e of this.arr) {
            index++;
            if (idCode === e.get().getIdCode()) {
                return index;
            }
        }
        return -1;
    }

    public indexOf(element: T) {
        let index = -1;
        for (let e of this.arr) {
            index++;
            if (element.toString() === e.get().toString()) {
                return index;
            }
        }
        return -1;
    }


    public getAllElements(): Array<T> {
        let returnArr: Array<T> = new Array<T>();
        for (let i = 0; i < this.length(); i++) {
            returnArr.push(this.getElementByIndex(i));
        }
        return returnArr;
    }

    public length(): number {
        return this.arr.length;
    }

    // public addElement(newElement: T) {
    //     if (this.indexOf(newElement) == -1) return;
    //     let observableElement: Observable<T> = new Observable<T>(newElement);
    //     observableElement.addListener(((change: ChangeDetail<T>) => {
    //         this.notifyAllListeners(ChangeType.modified, { newElement: change.newValue })
    //     }).bind(this), this.idListenerForElement)
    //     this.arr.push(observableElement);
    //     this.notifyAllListeners(ChangeType.added, { addedElement: newElement });
    // }

    public modifyElement(newElement: T, pos: number) {
        if (this.arr[pos].get().getIdCode() !== newElement.getIdCode()) throw new Error("Modify An Element By New Element not equal ID code")
        this.arr[pos].set(newElement);
        this.notifyAllListeners(ChangeType.modified, { newElement: newElement, atIndex: pos });
    }

    public modifyElementByIdCode(newElement: T) {
        let index = this.indexOfByIdCode(newElement.getIdCode());
        if (index !== -1 && index < this.length())
            this.modifyElement(newElement, index);
    }

    public insertElement(newElement: T, pos: number) {
        // if (this.indexOf(newElement) !== -1) return;
        if (pos > this.arr.length) throw new Error("Insert element into arr[] error, pos > length of arr[]");
        let observableElement: Observable<T> = new Observable<T>(newElement);
        observableElement.addListener(((change: ChangeDetail<T>) => {
            this.notifyAllListeners(ChangeType.modified, { newElement: change.newValue })
        }).bind(this), this.idListenerForElement)
        this.arr.splice(pos, 0, observableElement);
        this.notifyAllListeners(ChangeType.added, { newElement: newElement, atIndex: pos });
    }

    public removeElement(element: number) {
        if (element >= this.arr.length) throw new Error("Delete element from arr[] error, index >= length of arr[]");
        let removed = this.arr.splice(element, 1)[0];
        removed.detachListener(this.idListenerForElement);
        this.notifyAllListeners(ChangeType.removed, { removedElement: removed.get(), atIndex: element });
        return removed.get();
    }

    public removeElementByElement(element: T) {
        if (!element) return
        let index = this.indexOf(element);
        if (index !== -1) {
            return this.removeElement(index);
        }
    }

    public binaryInsert(target: T, duplicate: boolean = false, comparatorObject = (target as Comparator<T>)) {
        let comparator = comparatorObject.compare.bind(target);
        var i = this.binarySearch(target, comparator);
        if (i >= 0) { /* if the binarySearch return value was zero or positive, a matching object was found */
            if (!duplicate) {
                return i;
            }
        } else { /* if the return value was negative, the bitwise complement of the return value is the correct index for this object */
            i = ~i;
        }
        this.insertElement(target, i);
        return i;
    };

    /* 
    target: the object to search for in the array
    comparator: (optional) a method for comparing the target object type
    return value: index of a matching item in the array if one exists, otherwise the bitwise complement of the index where the item belongs
*/
    private binarySearch(target: T, comparator?: (o1: T, o2: T) => number) {
        var l = 0,
            h = this.arr.length - 1,
            m, comparison;

        comparator = comparator || function (a: any, b: any) {
            return (a < b ? -1 : (a > b ? 1 : 0)); /* default comparison method if one was not provided */
        };
        while (l <= h) {
            m = (l + h) >>> 1; /* equivalent to Math.floor((l + h) / 2) but faster */
            comparison = comparator(this.arr[m].get(), target);
            if (comparison < 0) {
                l = m + 1;
            } else if (comparison > 0) {
                h = m - 1;
            } else {
                return m;
            }
        }
        return ~l;
    };
}
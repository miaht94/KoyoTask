import { v4 as uniqid } from 'uuid';
export interface ChangeDetail<T> {
    newValue: T
}

export class Observable<T> {
    private listenersCallback: Map<string, (change: ChangeDetail<T>) => void>;
    private array: Record<string, (change: ChangeDetail<T>) => void>
    private value: T;
    public isObservableObject: boolean = true;

    constructor(value?: T) {
        this.listenersCallback = new Map<string, (change: ChangeDetail<T>) => void>()
        if (value) {
            this.set(value);
        }
    }

    public notifyAllListener(): void {
        for (let [key, value] of this.listenersCallback.entries()) {
            value({ newValue: this.value });
        }
    }

    public addListener(callback: (change: ChangeDetail<T>) => void, id?: string): string {
        if (id)
            this.listenersCallback.set(id, callback);
        else {
            id = uniqid()
            this.listenersCallback.set(id, callback);
            return id
        }
    }

    public detachAllListener(): void {
        this.listenersCallback.clear();
    }

    public detachListener(id: string): void {
        this.listenersCallback.delete(id);
    }

    public set(value: T, duplicate: boolean = false) {
        if (!this.value && !value && !duplicate) return;
        if (!duplicate && this.value && value && this.value.toString() === value.toString()) return;
        this.value = value;
        if (value) {
            let temp: any = value;
            for (let justForCheck in temp) {
                if (temp[justForCheck] && temp[justForCheck].isObservableObject) {
                    temp[justForCheck].addListener(((change: any) => {
                        this.notifyAllListener()
                    }).bind(this))
                }
            }
        }
        this.notifyAllListener();
    }

    public get(): T {
        return this.value;
    }

    public toString(): string {
        if (this.value)
            return this.value.toString();
        else return "";
    }
}
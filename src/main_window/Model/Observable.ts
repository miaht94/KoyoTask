export interface ChangeDetail<T> {
    newValue: T
}

export class Observable<T> {
    private listenersCallback: ((change: ChangeDetail<T>) => void)[] = [];
    private value: T;
    public isObservableObject: boolean = true;

    constructor() {

    }

    public notifyAllListener(): void {
        for (let callback of this.listenersCallback) {
            callback({ newValue: this.value });
        }
    }

    public addListener(callback: (change: ChangeDetail<T>) => void): void {
        this.listenersCallback.push(callback);
    }

    public set(value: T) {
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
import firebase from 'firebase/app';
import 'firebase/firestore';
import { IdentifyCode } from '../../Utils/IdentifyCode';
import { Comparator } from '../../Utils/Comparator';
import { Observable } from './Observable';


export class Task implements Comparator<Task>, IdentifyCode {
    private task_name: Observable<string> = new Observable<string>();
    private task_id: Observable<string> = new Observable<string>();
    private task_description: Observable<string> = new Observable<string>();
    private completed: Observable<boolean> = new Observable<boolean>();
    private createdDate: Observable<firebase.firestore.Timestamp> = new Observable<firebase.firestore.Timestamp>();
    private task_ref: firebase.firestore.DocumentReference;
    private listenersCallback: ((newTask: Task) => void)[] = [];
    constructor() {

    }
    public getIdCode(): string {
        return this.getTaskID();
    }

    public setTaskByJson(task: { task_name: string; task_id?: string; task_description: string; completed: boolean, task_ref?: firebase.firestore.DocumentReference; createdDate?: firebase.firestore.Timestamp }) {
        this.setTaskName(task.task_name);
        this.setTaskDescription(task.task_description);
        this.setCompleted(task.completed);
        if (!(task.createdDate === undefined)) {
            this.setCreatedDate(task.createdDate);
        }
        if (!(task.task_id === undefined)) {
            this.setTaskID(task.task_id);
        }
        if (!(task.task_ref === undefined)) {
            this.task_ref = task.task_ref;
        }
    }
    public compare(o1: Task, o2: Task): number {
        if (o1.getCreatedDate().toDate().getTime() === o2.getCreatedDate().toDate().getTime()) {
            if (o1.toString() === o2.toString()) return 0
            else return o1.toString() > o2.toString() ? 1 : -1;
        }
        else {
            return o1.getCreatedDate().toDate().getTime() > o2.getCreatedDate().toDate().getTime() ? 1 : -1
        }
    }
    static createNewTaskByJson(task: { task_name: string; task_id: string; task_description: string; completed: boolean; task_ref: firebase.firestore.DocumentReference; createdDate: firebase.firestore.Timestamp }): Task {
        // console.log(task);
        // task = JSON.parse(task);
        let newTask: Task = new Task();
        newTask.task_name.set(task.task_name);
        newTask.task_id.set(task.task_id);
        newTask.task_description.set(task.task_description);
        newTask.completed.set(task.completed);
        newTask.createdDate.set(task.createdDate)
        newTask.task_ref = task.task_ref;
        return newTask;
    }

    public static clone(task: Task) {
        return Task.createNewTaskByJson({
            task_name: task.getTaskName(),
            task_id: task.getTaskID(),
            task_description: task.getTaskDescription(),
            completed: task.getCompleted(),
            createdDate: task.getCreatedDate(),
            task_ref: task.getTaskRef()
        })
    }

    static createEmptyTask(taskCollectionRef: firebase.firestore.CollectionReference): Task {
        let newTaskRef: firebase.firestore.DocumentReference = taskCollectionRef.doc();
        let newTask: Task = Task.createNewTaskByJson({
            task_name: "",
            task_id: newTaskRef.id,
            task_description: "",
            completed: false,
            task_ref: newTaskRef,
            createdDate: firebase.firestore.Timestamp.fromDate(new Date())
        });
        return newTask;
    }

    static createNewTaskCompact(taskName: string, completed: boolean): Task {
        let newTask: Task = new Task();
        newTask.task_name.set(taskName);
        newTask.task_id.set(''); //generate task ID later
        newTask.task_description.set('');
        newTask.completed.set(completed);
        return newTask;
    }

    public notifyAllListener() {
        for (let listenerCallback of this.listenersCallback) {
            listenerCallback(this);
        }
    }

    public addListener(callback: (newTask: Task) => void): void {
        this.listenersCallback.push(callback);
    }

    public getCreatedDate(): firebase.firestore.Timestamp {
        return this.createdDate.get();
    }

    public setCreatedDate(timestamp: firebase.firestore.Timestamp): void {
        this.createdDate.set(timestamp);
    }

    public getTaskID(): string {
        return this.task_id.get();
    }

    public getTaskDescription(): string {
        return this.task_description.get();
    }

    public getTaskName(): string {
        return this.task_name.get();
    }

    public getCompleted(): boolean {
        return this.completed.get();
    }

    public getTaskRef(): firebase.firestore.DocumentReference {
        return this.task_ref;
    }

    public setTaskName(task_name: string): void {
        this.task_name.set(task_name);
    }

    public setTaskID(task_id: string): void {
        this.task_id.set(task_id);
    }

    public setTaskDescription(task_description: string): void {
        this.task_description.set(task_description);
    }

    public setCompleted(b: boolean): void {
        this.completed.set(b);
    }

    public setTask(that: Task): void {
        this.task_name = that.task_name;
        this.task_description = that.task_description;
        this.completed = that.completed;
        this.notifyAllListener();
    }

    public toString(): string {
        return JSON.stringify({
            task_name: this.getTaskName(),
            task_id: this.getTaskID(),
            task_description: this.getTaskDescription(),
            completed: this.getCompleted(),
            createdDate: this.getCreatedDate().toDate().getTime()
        })
    }



    public publishOnFirebase(onDone: () => void = () => { }, onError: (error: any) => void = () => { }): void {
        if (this.task_ref) {
            this.task_ref.withConverter(Task.TaskConverter).set(this).then(() => {
                onDone();
            }).catch((error) => {
                onError(error);
            })
        }
    }

    public removeOnFirebase(onDone: () => void = () => { }, onError: (error: any) => void = () => { }): void {
        if (this.task_ref) {
            this.task_ref.delete().then(() => {
                onDone();
            }).catch((error) => {
                onError(error);
            })
        }
    }

    static TaskConverter = {
        toFirestore(task: Task): firebase.firestore.DocumentData {
            return {
                task_name: task.getTaskName() ? task.getTaskName() : "",
                task_description: task.getTaskDescription() ? task.getTaskDescription() : "",
                completed: task.getCompleted() !== undefined ? task.getCompleted() : false,
                createdDate: task.getCreatedDate()
            }
        },
        fromFirestore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
        ): Task {
            const data = snapshot.data(options);
            let task = {
                task_name: data.task_name,
                task_description: data.task_description,
                task_id: snapshot.id,
                task_ref: snapshot.ref,
                completed: data.completed,
                createdDate: data.createdDate
            };
            return Task.createNewTaskByJson(task);
        }
    };
}
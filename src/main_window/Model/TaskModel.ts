import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from './Observable';


export class TaskModel {
    private task_name: Observable<string> = new Observable<string>();
    private task_id: Observable<string> = new Observable<string>();
    private task_description: Observable<string> = new Observable<string>();
    private completed: Observable<boolean> = new Observable<boolean>();
    private task_ref: firebase.firestore.DocumentReference;
    private listenersCallback: ((newTask: TaskModel) => void)[] = [];
    constructor() {

    }

    static createNewTaskByJson(task: { task_name: string; task_id: string; task_description: string; completed: boolean; task_ref: firebase.firestore.DocumentReference }): TaskModel {
        // console.log(task);
        // task = JSON.parse(task);
        let newTask: TaskModel = new TaskModel();
        newTask.task_name.set(task.task_name);
        newTask.task_id.set(task.task_id);
        newTask.task_description.set(task.task_description);
        newTask.completed.set(task.completed);
        newTask.task_ref = task.task_ref;
        return newTask;
    }

    static createEmptyTask(taskCollectionRef: firebase.firestore.CollectionReference): TaskModel {
        let newTaskRef: firebase.firestore.DocumentReference = taskCollectionRef.doc();
        let newTask: TaskModel = TaskModel.createNewTaskByJson({
            task_name: "",
            task_id: newTaskRef.id,
            task_description: "",
            completed: false,
            task_ref: newTaskRef
        });
        return newTask;
    }

    static createNewTaskCompact(taskName: string, completed: boolean): TaskModel {
        let newTask: TaskModel = new TaskModel();
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

    public addListener(callback: (newTask: TaskModel) => void): void {
        this.listenersCallback.push(callback);
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

    public setTask(that: TaskModel): void {
        this.task_name = that.task_name;
        this.task_description = that.task_description;
        this.completed = that.completed;
        this.notifyAllListener();
    }

    public publishOnFirebase() {
        this.task_ref.withConverter(TaskModel.TaskConverter).set(this);
    }

    static TaskConverter = {
        toFirestore(task: TaskModel): firebase.firestore.DocumentData {
            return {
                task_name: task.getTaskName() ? task.getTaskName() : "",
                task_description: task.getTaskDescription() ? task.getTaskDescription() : "",
                completed: task.getCompleted() !== undefined ? task.getCompleted() : false
            }
        },
        fromFirestore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
        ): TaskModel {
            const data = snapshot.data(options);
            let task = {
                task_name: data.task_name,
                task_description: data.task_description,
                task_id: snapshot.id,
                task_ref: snapshot.ref,
                completed: data.completed
            };
            return TaskModel.createNewTaskByJson(task);
        }
    };
}
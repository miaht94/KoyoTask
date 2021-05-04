import firebase from 'firebase/app';
import 'firebase/firestore';


export class TaskModel {
    private task_name: string;
    private task_id: string;
    private task_description: string;
    private completed: boolean;
    private listenersCallback: ((newTask: TaskModel) => void)[] = [];
    constructor() {

    }

    static createNewTaskByJson(task: any): TaskModel {
        // console.log(task);
        // task = JSON.parse(task);
        let newTask: TaskModel = new TaskModel();
        newTask.task_name = task.task_name;
        newTask.task_id = task.task_id;
        newTask.task_description = task.task_description;
        newTask.completed = task.completed;
        return newTask;
    }

    static createNewTaskCompact(taskName: string, completed: boolean): TaskModel {
        let newTask: TaskModel = new TaskModel();
        newTask.task_name = taskName;
        newTask.task_id = ''; //generate task ID later
        newTask.task_description = '';
        newTask.completed = completed;
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
        return this.task_id;
    }

    public getTaskDescription(): string {
        return this.task_description;
    }

    public getTaskName(): string {
        return this.task_name;
    }

    public getCompleted(): boolean {
        return this.completed;
    }

    public setTaskName(task_name: string): void {
        this.task_name = task_name;
        this.notifyAllListener();
    }

    public setTaskID(task_id: string): void {
        this.task_id = task_id;
        this.notifyAllListener();
    }

    public setTaskDescription(task_description: string): void {
        this.task_description = task_description;
        this.notifyAllListener();
    }

    public setCompleted(b: boolean): void {
        this.completed = b;
        this.notifyAllListener();
    }

    public setTask(that: TaskModel): void {
        this.task_name = that.task_name;
        this.task_description = that.task_description;
        this.completed = that.completed;
        this.notifyAllListener();
    }

    static TaskConverter = {
        toFirestore(task: TaskModel): firebase.firestore.DocumentData {
            return {
                task_name: task.getTaskName(),
                task_description: task.getTaskDescription(),
                completed: task.getCompleted()
            }
        },
        fromFirestore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
        ): TaskModel {
            const data = snapshot.data(options)!;
            let task = {
                task_name: data.task_name,
                task_description: data.task_description,
                // completed: data.completed
            };
            return TaskModel.createNewTaskByJson(task);
        }
    };
}
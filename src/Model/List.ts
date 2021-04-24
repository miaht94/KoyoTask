
export class List {
    private tasks: Task[] = [];
    private listID: string;
    private listName: string;
    private listDescription: string;
    constructor(list: any) {
        if (list === undefined) throw new Error("Illegal JSON Argument")
        this.listID = list.list_id;
        this.listName = list.list_name;

        for (let task of list.tasks) {
            //console.log(task);
            if (task === undefined) throw new Error("Illegal JSON Argument");
            this.tasks.push(Task.createNewTaskByJson(task))
        }
    }

    public static createEmptyList(): List {
        return new List({
            "list_id": null,
            "list_name": null,
            "tasks": []
        })
    }

    public getTasks(): Task[] { return this.tasks; }

    public getListID(): string { return this.listID; }

    public getListName(): string { return this.listName; }

    public getListDescription(): string { return this.listDescription; }

    public setListID(listID: string): void { this.listID = listID; }

    public setListName(listName: string): void { this.listName = listName; }

    public setListDescription(listDescription: string): void { this.listDescription = listDescription; }

    public addTaskCompact(taskName: string): void { this.tasks.push(Task.createNewTaskCompact(taskName)); }

    public addTask(task: any) {
        this.tasks.push(Task.createNewTaskByJson(task));
    }

    public deleteTask(taskID: string): void {
        for (var i = 0; i < this.tasks.length; i++) {
            var obj = this.tasks[i];
            if (obj.getTaskID() == taskID) { this.tasks.splice(i, 1); }
        }
    }

    public setTask(taskID: string, task: Task) {
        for (var i = 0; i < this.tasks.length; i++) {
            var obj = this.tasks[i];
            if (obj.getTaskID() == taskID) { obj.setTask(task); }
        }
    }
}

export class Task {
    private task_name: string;
    private task_id: string;
    private task_description: string;
    private completed: boolean;
    constructor() {

    }

    static createNewTaskByJson(task: any): Task {
        // console.log(task);
        // task = JSON.parse(task);
        let newTask: Task = new Task();
        newTask.task_name = task.task_name;
        newTask.task_id = task.task_id;
        newTask.task_description = task.task_description;
        newTask.completed = task.completed;
        return newTask;
    }

    static createNewTaskCompact(taskName: string): Task {
        let newTask: Task = new Task();
        newTask.task_name = taskName;
        newTask.task_id = ''; //generate task ID later
        newTask.task_description = '';
        newTask.completed = false;
        return newTask;
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
    }

    public setTaskID(task_id: string): void {
        this.task_id = task_id;
    }

    public setTaskDescription(task_description: string): void {
        this.task_description = task_description;
    }

    public setCompleted(b: boolean): void {
        this.completed = b;
    }

    public setTask(that: Task): void {
        this.task_name = that.task_name;
        this.task_description = that.task_description;
        this.completed = that.completed;
    }
}
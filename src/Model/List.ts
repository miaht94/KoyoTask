
export class List {
    private tasks: Task[] = [];
    private listID: string;
    private listName: string;
    constructor(list: any) {
        if (list === undefined) throw new Error("Illegal JSON Argument")
        this.listID = list.list_id;
        this.listName = list.list_name;

        for (let task of list.tasks) {
            console.log(task);
            if (task === undefined) throw new Error("Illegal JSON Argument");
            this.tasks.push(new Task(task))
        }
    }

    public static createEmptyList(): List {
        return new List({
            "list_id": null,
            "list_name": null,
            "tasks": []
        })
    }

    public getTasks(): Task[] {
        return this.tasks;
    }

    public getListID(): string {
        return this.listID;
    }

    public getListName(): string {
        return this.listName;
    }
}

export class Task {
    private task_name: string;
    private task_id: string;
    private task_description: string;
    constructor(task: any) {
        // console.log(task);
        // task = JSON.parse(task);
        this.task_name = task.task_name;
        this.task_id = task.task_id;
        this.task_description = task.task_description;
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

    public setTaskName(task_name: string): void {
        this.task_name = task_name;
    }

    public setTaskID(task_id: string): void {
        this.task_id = task_id;
    }

    public setDescription(task_description: string): void {
        this.task_description = task_description;
    }
}
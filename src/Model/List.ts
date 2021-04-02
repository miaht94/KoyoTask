
export class List {
    public tasks: Task[];
    constructor(json: any) {
        for (let task in json.tasks) {
            if (task === undefined) throw new Error("JSON truyen vao ko hop le");
            this.tasks.push(new Task(task))
        }
    }
}

export class Task {
    task_name: string;
    task_id: string;
    constructor(task: any) {
        this.task_name = task.task_name;
        this.task_id = task.task_id;
    }
}
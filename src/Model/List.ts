
export class List {
    public tasks: Task[];
    constructor(json) {
        for (let task in json.tasks) {
            if (task === undefined) throw new Error("JSON truyen vao ko hop le");
            this.tasks.push(new Task(task))
        }
    }
}

export class Task {
    task_name: string;
    task_id: string;
    constructor(task) {
        this.task_name = task.task_name;
        this.task_id = task.task_id;
    }
}
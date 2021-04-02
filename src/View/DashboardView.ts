import { List, Task } from '../Model/List';
import { View } from './View';
export class DashboardView extends View {
    public dashboard: HTMLElement;
    constructor() {
        super();
        this.dashboard = document.getElementById('Dashboard');
        this.dashboard.innerHTML = "Bach";
    }

    public render(listData: List) {
        let task: any;
        for (task in listData.tasks) {
            this.dashboard.appendChild(this.generateTaskNode(task))
        }
    }

    private generateTaskNode(task: Task): HTMLElement {
        let border: HTMLElement = document.createElement('div');
        border.className = "dashboard_item";
        let line: HTMLElement = document.createElement("img");
        line.className = "line";
        line.setAttribute("src", "ui_resources/line1.png");
        let flex_row: HTMLElement = document.createElement("div");
        flex_row.className = "flex_row";
        let task_name: HTMLElement = document.createElement('div');
        border.className = "task-1 helvetica-normal-black-16px";
        let oval: HTMLElement = document.createElement("img");
        oval.className = "oval";
        line.setAttribute("src", "ui_resources/oval1.png");

        // Insert content of task to node
        task_name.innerHTML = task.task_name;

        // Set up html tree
        flex_row.appendChild(oval).appendChild(task_name);
        border.appendChild(line).appendChild(flex_row);
        return border;
    }
}
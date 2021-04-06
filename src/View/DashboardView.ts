import { List, Task } from '../Model/List';
import { View } from './View';
import $ from '../js/jquery';
export class DashboardView {
    private dashboard: HTMLElement;
    constructor() {
        // super();
        this.dashboard = $('#DashboardList');
        console.log("constructor :" + this.dashboard);
        // this.dashboard.innerHTML = "Bach";
    }

    public render(listData: List) {
        console.log("render :" + this.dashboard);
        let task: any;
        for (task of listData.getTasks()) {
            // this.dashboard.append(`<div class=\"dashboard_item\"\><img class=\"line\" src=\"img/line1.png\" /\><div class=\"flex-row\"\><img class=\"oval\" src=\"img/oval1.png\" /\><div class=\"task-1 helvetica-normal-black-16px\"\>${task.getTaskName()}</div\></div\></div\>`);
            this.dashboard.append(`
            <div class="dashboarditem">
                <div class="flex-row"><img class="oval checkbox" src="img/oval1.png">
                    <div class="dashboarditem itemname">${task.getTaskName()}</div>
                </div>
            </div>
            `);
        }
    }

    public getDashboard(): HTMLElement {
        return this.dashboard;
    }
    public setDashboard(dashboard: HTMLElement): void {
        this.dashboard = dashboard;
    }

    // private generateTaskNode(task: Task): HTMLElement {
    // let border: HTMLElement = document.createElement('div');
    // border.className = "dashboard_item";
    // let line: HTMLElement = document.createElement("img");
    // line.className = "line";
    // line.setAttribute("src", "ui_resources/line1.png");
    // let flex_row: HTMLElement = document.createElement("div");
    // flex_row.className = "flex_row";
    // let task_name: HTMLElement = document.createElement('div');
    // border.className = "task-1 helvetica-normal-black-16px";
    // let oval: HTMLElement = document.createElement("img");
    // oval.className = "oval";
    // line.setAttribute("src", "ui_resources/oval1.png");

    // // Insert content of task to node
    // task_name.innerHTML = task.task_name;

    // // Set up html tree
    // flex_row.appendChild(oval).appendChild(task_name);
    // border.appendChild(line).appendChild(flex_row);
    // return border;

    //         this.dashboard.append(`<div class=\"dashboard_item\"\><img class=\"line\" src=\"img/line1.png\" /\><div class=\"flex-row\"\><img class=\"oval\" src=\"img/oval1.png\" /\><div class=\"task-1 helvetica-normal-black-16px\"\>${task.get}</div\></div\></div\>`);
    //     }
}
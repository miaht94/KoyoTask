import { List, Task } from '../Model/List';
import { View } from './View';
import $ from '../js/jquery';
export class DashboardView {
    private dashboard: HTMLElement;
    private addButton: HTMLElement;

    private expandButton: HTMLElement;
    private submitButton: HTMLElement;
    private newTaskTitleCompact: HTMLInputElement;
    private addTriggered: boolean;
    private dashboardItem: HTMLElement;

    private handleAddCompact: Function;
    private handleDelete: Function;
    private handleSetTask: Function;

    constructor() {
        // super();
        this.dashboard = $('#DashboardList');
        console.log("constructor :" + this.dashboard);
        // this.dashboard.innerHTML = "Bach";
        this.addButton = $('#taskListAddButton');
        this.addTriggered = false;
        let addButtonAny: any = this.addButton;
        addButtonAny.on("click", () => {
            if (this.addTriggered == false) {
                this.dashboard.append(`
                <div class="newTaskGroup"\>
                    <div class="dashboarditem itemname">+</div>
                    <input class="form-control form-control-sm newTaskColumn" type="text" id="newTaskTitleCompact" placeholder="Write something">
                    <button type="button" class="btn btn-primary btn-sm newTaskColumn" id="newTaskSubmitButton" disabled>Add</button>
                    <button type="button" class="btn btn-primary btn-sm newTaskColumn" id="newTaskExpandButton">Expand</button>
                </div>
                `);
                this.initNewTaskCompact();
                this.addTriggered = true;
            }
        })
    }

    public render(listData: List) {
        console.log("render :" + this.dashboard);
        let dashboard: any = this.dashboard;
        dashboard.html("");
        let task: any;
        for (task of listData.getTasks()) {
            // this.dashboard.append(`<div class=\"dashboard_item\"\><img class=\"line\" src=\"img/line1.png\" /\><div class=\"flex-row\"\><img class=\"oval\" src=\"img/oval1.png\" /\><div class=\"task-1 helvetica-normal-black-16px\"\>${task.getTaskName()}</div\></div\></div\>`);
            dashboard.append(`
            <div class="dashboarditem" id="dashboarditem">
                <div class="flex-row" id="itemrow"><img class="oval checkbox" src="img/oval1.png">
                    <div class="dashboarditem itemname">${task.getTaskName()}</div>
                    <div class="itembuttongroup" id = "itembuttongroup">
                        <button type="button" class="btn btn-danger btn-sm taskColumn" id="taskDeleteButton">Delete</button>
                        <button type="button" class="btn btn-primary btn-sm taskColumn" id="taskEditButton">Edit</button>
                    </div>
                </div>
            </div>
            `);

            let currentTask = task;
            let dashboardItemForAppender: any = document.querySelector('#dashboarditem:last-child');
            //let toolbarButtonGroupForAppender : any = dashboardItemForAppender.querySelector('#flex-row');
            let deleteButtonForAppender: any = dashboardItemForAppender.querySelector('#taskDeleteButton');
            dashboardItemForAppender.addEventListener('mouseenter', () => {
                deleteButtonForAppender.style.opacity = "1";
            });

            dashboardItemForAppender.addEventListener('mouseleave', () => {
                deleteButtonForAppender.style.opacity = "0";
            });

            deleteButtonForAppender.addEventListener('click', () => {
                console.log("deleted task " + currentTask.getTaskName());
                this.handleDelete(currentTask.getTaskID());
            });
        }
    }


    public getDashboard(): HTMLElement {
        return this.dashboard;
    }
    public setDashboard(dashboard: HTMLElement): void {
        this.dashboard = dashboard;
    }

    private initNewTaskCompact(): void {
        this.newTaskTitleCompact = $('#newTaskTitleCompact')[0];
        this.submitButton = $('#newTaskSubmitButton')[0];
        let newTaskTitleCompactAny: any = this.newTaskTitleCompact;
        let submitButtonAny: any = this.submitButton;
        newTaskTitleCompactAny.addEventListener("input", () => {
            console.log("changed to " + this.newTaskTitleCompact.value);
            if (this.newTaskTitleCompact.value == "")
                submitButtonAny.setAttribute("disabled", true);
            else submitButtonAny.removeAttribute("disabled");
        })
        submitButtonAny.addEventListener("click", () => {
            this.handleAddCompact(this.newTaskTitleCompact.value.trimLeft().trimRight());
            this.addTriggered = false;
        })
    }

    private initNewTaskView(): void {

    }

    public bindOnAddCompact(handler: Function) {
        this.handleAddCompact = handler;
    }

    public bindOnDelete(handler: Function) {
        this.handleDelete = handler;
    }

    public bindOnSetTask(handler: Function) {
        this.handleSetTask = handler;
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
import { List, Task } from '../Model/List';
import { View } from './View';
import $ from '../js/jquery';
export class DashboardView {
    private dashboard: HTMLElement;
    private addButton: HTMLElement;

    private expandButton: HTMLElement;
    private submitButton: HTMLElement;
    private newTaskTitleCompact: HTMLInputElement;

    private handleAdd: Function;

    constructor() {
        // super();
        this.dashboard = $('#DashboardList');
        console.log("constructor :" + this.dashboard);
        // this.dashboard.innerHTML = "Bach";
        this.addButton = $('#taskListAddButton');
        let addButtonAny : any = this.addButton;
        addButtonAny.on("click", ()=>{
            this.dashboard.append(`
            <div class="newTaskGroup"\>
                <div class="dashboarditem itemname">+</div>
                <input class="form-control form-control-sm newTaskColumn" type="text" id="newTaskTitleCompact" placeholder="Write something">
                <button type="button" class="btn btn-primary btn-sm newTaskColumn" id="newTaskSubmitButton">S</button>
                <button type="button" class="btn btn-primary btn-sm newTaskColumn" id="newTaskSubmitButton">S</button>
                <button type="button" class="btn btn-primary btn-sm newTaskColumn" id="newTaskExpandButton">E</button>
            </div>
            `);
            this.initNewTaskCompact();
        })
    }

    public render(listData: List) {
        console.log("render :" + this.dashboard);
        let dashboard:any = this.dashboard;
        dashboard.html("");
        let task: any;
        for (task of listData.getTasks()) {
            // this.dashboard.append(`<div class=\"dashboard_item\"\><img class=\"line\" src=\"img/line1.png\" /\><div class=\"flex-row\"\><img class=\"oval\" src=\"img/oval1.png\" /\><div class=\"task-1 helvetica-normal-black-16px\"\>${task.getTaskName()}</div\></div\></div\>`);
            
            dashboard.append(`
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

    private initNewTaskCompact(): void {
        this.newTaskTitleCompact = $('#newTaskTitleCompact')[0];
        this.submitButton = $('#newTaskSubmitButton');
        let submitButtonAny : any = this.submitButton;
        // let newTaskTitleCompactAny : any = this.newTaskTitleCompact;
        submitButtonAny.on("click", ()=>{
            this.handleAdd(this.newTaskTitleCompact.value);
        })

    }

    private initNewTaskView(): void {

    }
    
    public bindOnAdd(handler : Function){
        this.handleAdd = handler;
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
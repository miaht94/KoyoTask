import { List, Task } from '../Model/List';
import IOSystem from '../utils/iosys';
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

    private renderConfig: any;
    private taskHTML: String;
    private taskAddButtonGroupHTML: String;
    private taskButtonGroupHTML: String;
    private taskExpandFormHTML: String;


    constructor() {
        this.dashboard = $('#DashboardList');
        // console.log('this.dashboard');
        // console.log(this.dashboard);
        //Load from render_config using IOSystem
        this.renderConfig = IOSystem.getData("render_config");
        this.taskHTML = this.renderConfig.appendNewTask.html;
        this.taskButtonGroupHTML = this.renderConfig.TaskButtonGroup.html;
        this.taskAddButtonGroupHTML = this.renderConfig.TaskAddButtonGroup.html;
        

        console.log("this.taskHTML");
        console.log(this.taskHTML);
        //init each button on dashboard
        this.initAddTaskButton();
    }

    public render(listData: List) {
        //console.log("render :" + this.dashboard);
        let dashboardForAppender: any = this.dashboard;
        let task: any;
        dashboardForAppender.html("");
        for (task of listData.getTasks()) {

            //render all tasks to dashboard
            let certainTaskHTML : String = this.taskHTML;
            certainTaskHTML = certainTaskHTML.replace("{{task_name}}", task.getTaskName());
            certainTaskHTML = certainTaskHTML.replace("{{task_date}}", "Should be task.getTaskDate()");
            certainTaskHTML = certainTaskHTML.replace("{{task_description}}", task.getTaskDescription());

            dashboardForAppender.append(certainTaskHTML); 

            //behavior for each task
            this.initTaskBehavior(task);
        }

    }

    private initTaskBehavior(task: Task) :void {
        let currentTask = task;
        let dashboardItemForAppender: any = document.querySelector('#dashboarditem:last-child');
        let dashboardItem2ForAppender: any = $('#dashboarditem:last-child');
        dashboardItem2ForAppender.append(this.taskButtonGroupHTML);

        let taskButtonGroupForAppender: any = dashboardItemForAppender.querySelector('#taskButtonGroup');
        let deleteButtonForAppender: any = dashboardItemForAppender.querySelector('#taskDeleteButton');

        dashboardItemForAppender.addEventListener('mouseenter', () => {
            taskButtonGroupForAppender.style.opacity = "1";
        });

        dashboardItemForAppender.addEventListener('mouseleave', () => {
            taskButtonGroupForAppender.style.opacity = "0";
        });

        deleteButtonForAppender.addEventListener('click', () => {
            console.log("deleted task " + currentTask.getTaskName());
            this.handleDelete(currentTask.getTaskID());
        });
    }

    private initAddTaskButton():void {
        let dashboardForAppender: any = this.dashboard;
        this.addButton = $('#AddButton');
        console.log(this.addButton);
        this.addTriggered = false;
        let addButtonAny: any = this.addButton;

        addButtonAny.on("click", () => {
            if (this.addTriggered == false) {

                //WORK IN PROGRESS
                
                // let certainTaskHTML : String = this.taskHTML;
                // certainTaskHTML = certainTaskHTML.replace("{{task_name}}", "Enter task name here");
                // dashboardForAppender.append(certainTaskHTML); 

                // let dashboardItemForAppender: any = document.querySelector('#dashboarditem:last-child');
                // let dashboardItem2ForAppender: any = $('#dashboarditem:last-child');

                // this.newTaskTitleCompact = $('.task-title:last-child');
                // this.submitButton = $('#newTaskSubmitButton')[0];
                // let newTaskTitleCompactAny: any = this.newTaskTitleCompact;
                // let submitButtonAny: any = this.submitButton;

                // newTaskTitleCompactAny.addEventListener("input", () => {
                //     console.log("changed to " + this.newTaskTitleCompact.value);
                //     if (this.newTaskTitleCompact.value == "")
                //         submitButtonAny.setAttribute("disabled", true);
                //     else submitButtonAny.removeAttribute("disabled");
                // })

                // submitButtonAny.addEventListener("click", () => {
                //     this.handleAddCompact(this.newTaskTitleCompact.value.trimLeft().trimRight());
                //     this.addTriggered = false;
                // })

                // this.addTriggered = true;
                // console.log('addTriggered' + this.addTriggered);
            }
        });
    }

    public getDashboard(): HTMLElement {
        return this.dashboard;
    }
    public setDashboard(dashboard: HTMLElement): void {
        this.dashboard = dashboard;
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
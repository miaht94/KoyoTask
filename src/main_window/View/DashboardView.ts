import { ListModel } from '../Model/ListModel';
import { TaskModel } from '../Model/TaskModel';
import IO from '../../utils/iosys';
import $ from 'jquery';
import { Logger } from '../../utils/Logger'
import Handlebars from 'handlebars'
import { User } from '../Model/User';
import { TableListView } from './TableListView';
export class DashboardView {
    protected Logger: Logger;
    private dashboard: JQuery<HTMLElement>;
    private addButton: JQuery<HTMLElement>;
    private addListButton: JQuery<HTMLElement>;

    private expandButton: JQuery<HTMLElement>;
    private submitButton: JQuery<HTMLElement>;
    private newTaskTitleCompact: JQuery<HTMLElement>;
    private addTriggered: boolean;
    private dashboardItem: JQuery<HTMLElement>;

    private handleAddCompact: Function;
    private handleDelete: Function;
    private handleSetTask: Function;

    private renderConfig: any;
    private taskHTML: String;
    private taskAddHTML: String;
    private taskButtonGroupHTML: String;

    private currentTask: TaskModel;


    private sidebar: JQuery<HTMLElement>;

    private userInfoConfig: any;
    private listHTML: String;
    private tableListView: TableListView;
    constructor() {
        IO.init();
        this.Logger = new Logger(this);
        this.tableListView = new TableListView();
        this.dashboard = $('#DashboardList');
        this.renderConfig = IO.getData("render_config");
        this.taskHTML = this.renderConfig.appendNewTask.html;
        this.taskButtonGroupHTML = this.renderConfig.TaskButtonGroup.html;
        this.taskAddHTML = this.renderConfig.TaskAdd.html;
        //init each button on dashboard
        this.initAddTaskButton();

        this.sidebar = $('#SidebarView');

        //USER INFO
        this.userInfoConfig = IO.getData("user");

        //LISTS
        this.renderConfig = IO.getData("render_config");
        this.listHTML = this.renderConfig.list_group.html;

        // this.initAddListButton();
    }

    public getTableListView(): TableListView {
        return this.tableListView;
    }

    public render(listData: ListModel) {
        //RENDER DASHBOARD
        let dashboardForAppender: any = this.dashboard;

        let task: any;
        dashboardForAppender.html("");
        for (task of listData.getTasks()) {

            //render all tasks to dashboard
            //HandleBar
            let certainTaskHTML: String = this.taskHTML;
            certainTaskHTML = certainTaskHTML.replace("{{task_name}}", task.getTaskName());
            certainTaskHTML = certainTaskHTML.replace("{{task_date}}", "Should be task.getTaskDate()");
            certainTaskHTML = certainTaskHTML.replace("{{task_description}}", task.getTaskDescription());

            dashboardForAppender.append(certainTaskHTML);

            //behavior for each task
            this.initTaskBehavior(task);
        }

        //RENDER USER INFO

        this.Logger.Log(this.userInfoConfig);
        this.renderUserInfo(this.userInfoConfig);

        //RENDER LISTS
        //this.renderLists(lists);

    }

    private initTaskBehavior(task: TaskModel): void {
        let currentTask = task;
        let dashboardItemForAppender: any = document.querySelector('#dashboarditem:last-child');

        let dashboardItem2ForAppender: any = $('#dashboarditem:last-child');
        dashboardItem2ForAppender.append(this.taskButtonGroupHTML);

        let checkboxForAppender: any = dashboardItemForAppender.querySelector('#taskCheckbox');
        if (task.getCompleted() == true) checkboxForAppender.checked = true;
        let taskButtonGroupForAppender: any = dashboardItemForAppender.querySelector('#taskButtonGroup');
        let deleteButtonForAppender: any = dashboardItemForAppender.querySelector('#taskDeleteButton');
        let taskTitleForEdit: any = dashboardItemForAppender.querySelector('#taskTitleForEdit');

        dashboardItemForAppender.addEventListener('mouseenter', () => {
            taskButtonGroupForAppender.style.opacity = "1";
        });

        dashboardItemForAppender.addEventListener('mouseleave', () => {
            taskButtonGroupForAppender.style.opacity = "0";
        });

        checkboxForAppender.addEventListener('click', () => {
            currentTask.setCompleted(checkboxForAppender.checked);
            this.handleSetTask(currentTask.getTaskID(), currentTask);
        });

        taskTitleForEdit.addEventListener("keypress", (event: any) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                let newTask = currentTask;
                newTask.setTaskName(taskTitleForEdit.innerHTML.trimLeft().trimRight());
                if (taskTitleForEdit.innerHTML != "") {
                    this.handleSetTask(currentTask.getTaskID(), newTask);
                } else {
                    this.handleDelete(currentTask.getTaskID());
                }
            }
        });

        taskTitleForEdit.addEventListener("focusout", () => {
            let newTask = currentTask;
            newTask.setTaskName(taskTitleForEdit.innerHTML.trimLeft().trimRight());
            if (taskTitleForEdit.innerHTML != "") {
                this.handleSetTask(currentTask.getTaskID(), newTask);
            } else {
                this.handleDelete(currentTask.getTaskID());
            }
        });

        deleteButtonForAppender.addEventListener('click', () => {
            this.Logger.Log("deleted task " + currentTask.getTaskName());
            this.handleDelete(currentTask.getTaskID());
        });
    }

    private initAddTaskButton(): void {
        let dashboardForAppender: any = this.dashboard;
        this.addButton = $('#AddButton');
        this.addTriggered = false;
        let addButtonAny: any = this.addButton;

        addButtonAny.on("click", () => {
            if (this.addTriggered == false) {
                this.addTriggered = true;
                let certainTaskAddHTML: String = this.taskAddHTML;
                certainTaskAddHTML = certainTaskAddHTML.replace("{{task_name}}", "Enter task name here");
                dashboardForAppender.append(certainTaskAddHTML);
                let newTaskTitleCompact: any = $('#taskTitleForAdd');
                let checkboxCompact: any = $('#checkboxForAdd');
                this.Logger.Log(checkboxCompact.prop("checked"));
                newTaskTitleCompact.on("keypress", (event: any) => {
                    if (event.keyCode === 13) {
                        if (newTaskTitleCompact.textContent != "") {
                            this.handleAddCompact($('#taskTitleForAdd').text().trimLeft().trimRight(), checkboxCompact.prop("checked"));
                            this.addTriggered = false;
                        }
                    }
                });
            }
        });

        //TEST ONLY
        this.addListButton = $('#AddListButton');
        let addListButtonAny: any = this.addListButton;
        let addListModal = $('#AddListModal');
        this.Logger.Log(addListModal);
        addListButtonAny.on("click", () => {
            $('#AddListModal').show();
        });
    }

    public renderUserInfo(user: User): void {
        let userfieldForAppender: any = $('#' + this.renderConfig.userInfo.targetId);
        this.Logger.Log("userfieldForAppender");
        this.Logger.Log(userfieldForAppender);
        let userfieldHTML = this.renderConfig.userInfo.html;
        let template: HandlebarsTemplateDelegate = Handlebars.compile(userfieldHTML);
        userfieldHTML = template(user)
        //Render
        userfieldForAppender.html(userfieldHTML);
    }

    private renderLists(lists: ListModel[]) {
        let listviewForAppender: any = $('#ListView');

        //id: ListView -> listitem -> list_icon + list_name + list_description
        let list;
        for (list of lists) {
            //Load each list
            let certainListHTML: String = this.renderConfig.appendNewList;
            certainListHTML = certainListHTML.replace("{{list_name}}", list.getListName());
            certainListHTML = certainListHTML.replace("{{list_icon}}", list.getListIcon());
            certainListHTML = certainListHTML.replace("{{list_description}}", list.getListDescription());

            //Render each list
            listviewForAppender.append(certainListHTML);

            //Attach behavior for each list
            this.initListBehavior(list);
        }
    }

    //WORKING
    private initListBehavior(list: ListModel) {
        let currentList = list;
        let listForAppender = document.querySelector('#listitem');
        listForAppender.addEventListener('click', () => {
            //press on List -> change current list -> change dashboard
        });

        //delete list
        //add list

        //edit list name (on dashboard)
    }

    // private initAddListButton(): void {
    //     this.addListButton = $('#AddListButton');
    //     let addListButtonAny: any = this.addListButton
    //     addListButtonAny.on("click", () => {
    //         $('#AddListModal').modal('toggle');
    //     });
    // }

    public getSidebar(): JQuery<HTMLElement> {
        return this.sidebar;
    }

    public setSidebar(sidebar: JQuery<HTMLElement>): void {
        this.sidebar = sidebar;
    }

    private initNewSidebar(): void {
    }

    public getDashboard(): JQuery<HTMLElement> {
        return this.dashboard;
    }

    public setDashboard(dashboard: JQuery<HTMLElement>): void {
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
}
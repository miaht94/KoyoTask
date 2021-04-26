import { List, Task } from '../Model/List';
import IOSystem from '../utils/iosys';
import { View } from './View';
import $ from '../js/jquery';
export class DashboardView {
    private dashboard: HTMLElement;
    private addButton: HTMLElement;
    private addListButton: HTMLElement;

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
    private taskAddHTML: String;
    private taskButtonGroupHTML: String;

    private currentTask: Task;


    private sidebar: HTMLElement;

    private userInfoConfig: any;
    private listHTML: String;

    constructor() {
        this.dashboard = $('#DashboardList');

        this.renderConfig = IOSystem.getData("render_config");
        this.taskHTML = this.renderConfig.appendNewTask.html;
        this.taskButtonGroupHTML = this.renderConfig.TaskButtonGroup.html;
        this.taskAddHTML = this.renderConfig.TaskAdd.html;
        
        // console.log("this.taskHTML");
        // console.log(this.taskHTML);
        //init each button on dashboard
        this.initAddTaskButton();

        this.sidebar = $('#SidebarView');

        //USER INFO
        this.userInfoConfig = IOSystem.getData("user");

        //LISTS
        this.renderConfig = IOSystem.getData("render_config");
        this.listHTML = this.renderConfig.appendNewList.html;

        this.initAddListButton();
    }

    public render(listData: List) { 
        //RENDER DASHBOARD
        let dashboardForAppender: any = this.dashboard;
        
        let task: any;
        dashboardForAppender.html("");
        for (task of listData.getTasks()) {

            //render all tasks to dashboard
            //HandleBar
            let certainTaskHTML : String = this.taskHTML;
            certainTaskHTML = certainTaskHTML.replace("{{task_name}}", task.getTaskName());
            certainTaskHTML = certainTaskHTML.replace("{{task_date}}", "Should be task.getTaskDate()");
            certainTaskHTML = certainTaskHTML.replace("{{task_description}}", task.getTaskDescription());

            dashboardForAppender.append(certainTaskHTML); 

            //behavior for each task
            this.initTaskBehavior(task);
        }

        //RENDER USER INFO

        console.log(this.userInfoConfig);
        this.renderUserInfo(this.userInfoConfig);
        
        //RENDER LISTS
        //this.renderLists(lists);

    }

    private initTaskBehavior(task: Task) :void {
        let currentTask = task;
        let dashboardItemForAppender: any = document.querySelector('#dashboarditem:last-child');
        
        let dashboardItem2ForAppender: any = $('#dashboarditem:last-child');
        dashboardItem2ForAppender.append(this.taskButtonGroupHTML);

        let checkboxForAppender: any = dashboardItemForAppender.querySelector('#taskCheckbox');
        if(task.getCompleted() == true) checkboxForAppender.checked = true;
        let taskButtonGroupForAppender: any = dashboardItemForAppender.querySelector('#taskButtonGroup');
        let deleteButtonForAppender: any = dashboardItemForAppender.querySelector('#taskDeleteButton');
        let taskTitleForEdit: any = dashboardItemForAppender.querySelector('#taskTitleForEdit');
        
        dashboardItemForAppender.addEventListener('mouseenter', () => {
            taskButtonGroupForAppender.style.opacity = "1"; });

        dashboardItemForAppender.addEventListener('mouseleave', () => {
            taskButtonGroupForAppender.style.opacity = "0"; });

        checkboxForAppender.addEventListener('click',  () => {
            currentTask.setCompleted(checkboxForAppender.checked); 
            this.handleSetTask(currentTask.getTaskID(), currentTask);
        });

        taskTitleForEdit.addEventListener("keypress", (event:any) => {
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
            console.log("deleted task " + currentTask.getTaskName());
            this.handleDelete(currentTask.getTaskID());
        });
    }

    private initAddTaskButton():void {
        let dashboardForAppender: any = this.dashboard;
        this.addButton = $('#AddButton');
        this.addTriggered = false;
        let addButtonAny: any = this.addButton;

        addButtonAny.on("click", () => {
            if (this.addTriggered == false) {
                this.addTriggered = true;
                let certainTaskAddHTML : String = this.taskAddHTML;
                certainTaskAddHTML = certainTaskAddHTML.replace("{{task_name}}", "Enter task name here");
                dashboardForAppender.append(certainTaskAddHTML); 
                let newTaskTitleCompact: any = $('#taskTitleForAdd');
                let checkboxCompact: any = $('#checkboxForAdd');
                console.log(checkboxCompact.prop("checked"));
                newTaskTitleCompact.on("keypress", (event:any) => {
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
        console.log(addListModal);
        addListButtonAny.on("click", () => {
            $('#AddListModal').show();
        });
    }

    private renderUserInfo(userInfo: any) {
        let userfieldForAppender : any = $('#UserInfo');
        console.log("userfieldForAppender");
        console.log(userfieldForAppender);
  
        //id: UserInfo -> UserAvt + Username + UserEmail
        //Load
        let currentUsername: String = userInfo.fullname;
        let currentAvt: String = userInfo.avtURL;
        let currentEmail: String = userInfo.email;   
  
        let userfieldHTML = this.renderConfig.userInfo.html;
        userfieldHTML = userfieldHTML.replace("{{username}}", currentUsername);
        userfieldHTML = userfieldHTML.replace("{{useremail}}", currentEmail);
        userfieldHTML = userfieldHTML.replace("{{avtURL}}", currentAvt);
        
        //Render
        userfieldForAppender.append(userfieldHTML);
      }
  
      private renderLists(lists: List[]){
        let listviewForAppender : any = $('#ListView');
        
        //id: ListView -> listitem -> list_icon + list_name + list_description
        let list;
        for (list of lists) {
          //Load each list
          let certainListHTML : String = this.renderConfig.appendNewList;
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
      private initListBehavior(list: List){
        let currentList = list;
        let listForAppender = document.querySelector('#listitem');
        listForAppender.addEventListener('click',  () => {
            //press on List -> change current list -> change dashboard
        });
        
        //delete list
        //add list
  
        //edit list name (on dashboard)
      }
  
      private initAddListButton():void {    
        this.addListButton = $('#AddListButton');
        let addListButtonAny: any = this.addListButton
        addListButtonAny.on("click", () => {
          $('#AddListModal').modal('toggle');
        });
      }
  
      public getSidebar(): HTMLElement {
          return this.sidebar;
      }
  
      public setSidebar(sidebar: HTMLElement): void {
          this.sidebar = sidebar;
      }
  
      private initNewSidebar(): void {
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
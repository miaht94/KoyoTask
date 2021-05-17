import $ from 'jquery';
import IO from '../../Utils/iosys'
import HandleBars from 'handlebars'
import { Task } from '../Model/Task';
import { TableTaskModel } from '../Model/TableTaskModel';
import { remote } from 'electron';
import { List } from '../Model/List';
const { Menu, MenuItem } = remote;
export class TableTaskView {
    private taskTableRef: JQuery<HTMLElement>;
    private taskRowTemplate: HandleBars.TemplateDelegate;
    private addTaskBtn: JQuery<HTMLElement>;
    private render_config: any;
    private inputShare: JQuery<HTMLElement>;
    private curListOnListTable: JQuery<HTMLElement>;
    private handleTaskNameChange: (task_id: string, new_name: string) => void;
    private handleTaskDescriptionChange: (task_id: string, new_description: string) => void;
    private handleTaskChange: (task_id: string, task: { task_name: string; task_id: string; task_description: string; completed: boolean }) => void;
    private handleDeleteTask: (task_id: string) => void;
    private handleAddTask: () => string;
    private handleTickTask: (task_id: string) => void;
    private handleSharing: (uid: string) => void;

    constructor() {
        IO.init();
        this.render_config = IO.getData("render_config");
        this.taskTableRef = $("#" + this.render_config.appendNewTask.targetId);
        this.taskRowTemplate = HandleBars.compile(this.render_config.appendNewTask.html);
        this.addTaskBtn = $("#AddButton");
        this.inputShare = $("#sharing-list-input");
        this.initBehaviour();
    }

    public getTableTaskRef(suffixes?: string): JQuery<HTMLElement> {
        if (suffixes)
            return $("#" + this.render_config.appendNewTask.targetId + suffixes);
        else
            return $("#" + this.render_config.appendNewTask.targetId);
    }

    public bindHandleTaskNameChange(func: (list_id: string, new_name: string) => void) {
        this.handleTaskNameChange = func
    }

    public bindHandleTaskDescriptionChange(func: (list_id: string, new_description: string) => void) {
        this.handleTaskDescriptionChange = func
    }

    public bindHandleAddTask(func: () => string) {
        this.handleAddTask = func;
    }

    public bindHandleShare(func: (uid: string) => void) {
        this.handleSharing = func;
    }

    public bindTaskChange(func: (task_id: string, task: { task_name: string; task_id: string; task_description: string; completed: boolean }) => void) {
        this.handleTaskChange = func;
    }

    public bindHandleDeleteTask(func: (task_id: string) => void) {
        this.handleDeleteTask = func;
    }

    public bindHandleTickTask(func: (task_id: string) => void) {
        this.handleTickTask = func;
    }


    public renderAllTasks(tasks: Task[]) {
        this.taskTableRef.html("");
        for (let task of tasks) {
            this.renderAddedTask(task);
        }
    }

    public renderInsertedTask(task: Task, pos: number) {
        if (pos === 0) {
            this.getTableTaskRef().prepend(this.taskRowTemplate(task));
            return;
        }
        this.getTableTaskRef("> div:nth-child(" + (pos) + ")").after(this.taskRowTemplate(task));
    }

    public renderTaskModel(taskModel: TableTaskModel) {
        this.renderAllTasks(taskModel.getTaskModelsObservable().getAllElements())
    }

    public renderAddedTask(task: Task): void {
        this.taskTableRef.append(this.taskRowTemplate(task));
    }

    public renderModifiedList(list: Task, index: number): void {

        $("#" + this.render_config.appendNewTask.targetId).children().eq(index).replaceWith(this.taskRowTemplate(list));
    }
    public renderModifiedTaskById(task: Task, index?: number): void {
        if ($("#" + this.render_config.appendNewTask.targetId).children("#" + task.getTaskID()))
            $("#" + this.render_config.appendNewTask.targetId).children("#" + task.getTaskID()).replaceWith(this.taskRowTemplate(task));
    }

    public removedTask(task: Task, index: number) {
        console.log("Removing task [ ", task.getTaskID(), " ]")
        $("#" + task.getTaskID()).hide(300, () => {
            $("#" + task.getTaskID()).remove();
        });
    }

    public renderCurList(list: List) {
        if (!list) {
            this.addTaskBtn.css("visibility", "hidden");
            return;
        }
        if (this.curListOnListTable)
            this.curListOnListTable.toggleClass("active");
        this.addTaskBtn.css("visibility", "visible");
        this.curListOnListTable = $("#" + list.getListID());
        this.curListOnListTable.toggleClass("active");

        $("#list-name-big").text(list.getListName());
    }

    public clearAllTasks() {
        this.taskTableRef.empty();
    }

    public initBehaviour(): void {
        this.taskTableRef.on("keypress", "#taskTitleForEdit", (event) => {
            if (event.keyCode === 13) {
                $(event.target).trigger("blur");
                if (/^ *$/.test($(event.target).text()))
                    this.handleDeleteTask($(event.target).parent().parent().attr("id"));
                else
                    this.handleTaskNameChange($(event.target).parent().parent().attr("id"), $(event.target).text());
            }
        })
        // this.taskTableRef.on("keypress", "#task-description", (event) => {
        //     if (event.keyCode === 13) {
        //         event.preventDefault();
        //         $(event.target).append("<br></br>");
        //     }
        // })


        this.taskTableRef.on("focus", ("#taskTitleForEdit"), (event) => {
            let temp = event;
            let temp_text = $(event.target).text();

            let clickOutSizeTaskName = (event: any) => {
                console.log("focusout")
                $(temp.target).trigger("blur");
                console.log("Change Task Name[" + $(temp.target).parent().parent().attr("id") + ", '" + $(temp.target).text() + "' ] ");
                temp.target.removeEventListener("focusout", clickOutSizeTaskName)
                if (/^ *$/.test($(temp.target).html()))
                // It has only spaces, or is empty
                {
                    this.handleDeleteTask($(temp.target).parent().parent().attr("id"));
                }
                else
                    this.handleTaskNameChange($(temp.target).parent().parent().attr("id"), $(temp.target).html());
            }
            temp.target.addEventListener("focusout", clickOutSizeTaskName)
        })

        this.taskTableRef.on("focus", ("#task-description"), (event) => {
            let temp = event;
            let temp_text = $(event.target).text();
            let clickOutSizeTaskDesc = (event: any) => {
                console.log("focusout")
                $(temp.target).trigger("blur");
                console.log("Change Task Desc[" + $(temp.target).parent().parent().attr("id") + ", '" + $(temp.target).html() + "' ] ");
                temp.target.removeEventListener("focusout", clickOutSizeTaskDesc)
                this.handleTaskDescriptionChange($(temp.target).parent().parent().attr("id"), $(temp.target).html());
                console.log($(temp.target).html());

            }
            temp.target.addEventListener("focusout", clickOutSizeTaskDesc)
        })

        this.taskTableRef.on("change", "#taskCheckbox", event => {
            let task_id = $(event.target).parent().parent().parent().attr("id");
            console.log("Clicked On checkbox of Task[ ", task_id, " ]")
            this.handleTickTask(task_id);
        })



        this.addTaskBtn.on("click", () => {
            debugger
            let task_id = this.handleAddTask();
            // $("#" + task_id).find("#taskTitleForEdit").click();

            $("#" + task_id).find("#taskTitleForEdit").focus();
        })
        this.inputShare.on("keypress", event => {
            if (event.keyCode === 13)
                this.handleSharing(this.inputShare.val().toString());
        })

        //context-menu
        $(".DashboardList").on("contextmenu", (event) => {
            // event.preventDefault();
            const menu = new Menu();
            let temp = $(event.target);
            temp = temp.parents().filter(".dashboarditem")
            if (temp && temp.hasClass("dashboarditem")) {
                menu.append(new MenuItem({
                    label: "Delete this task ????",
                    click: (() => {
                        this.handleDeleteTask(temp.attr("id"));
                    }).bind(this)
                }));
            }
            menu.popup({ window: remote.getCurrentWindow() })
        })
    }


}
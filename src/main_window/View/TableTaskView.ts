import $ from 'jquery';
import IO from '../../Utils/iosys'
import HandleBars from 'handlebars'
import { Task } from '../Model/Task';
import { TableTaskModel } from '../Model/TableTaskModel';

export class TableTaskView {
    private taskTableRef: JQuery<HTMLElement>;
    private taskRowTemplate: HandleBars.TemplateDelegate;
    private addTaskBtn: JQuery<HTMLElement>;
    private render_config: any;
    private inputShare: JQuery<HTMLElement>;
    private handleTaskNameChange: (task_id: string, new_name: string) => void;
    private handleTaskDescriptionChange: (task_id: string, new_description: string) => void;
    private handleAddTask: () => void;
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

    public bindHandleTaskNameChange(func: (list_id: string, new_name: string) => void) {
        this.handleTaskNameChange = func
    }

    public bindHandleTaskDescriptionChange(func: (list_id: string, new_description: string) => void) {
        this.handleTaskDescriptionChange = func
    }

    public bindHandleAddTask(func: () => void) {
        this.handleAddTask = func;
    }

    public bindHandleShare(func: (uid: string) => void) {
        this.handleSharing = func;
    }

    public renderAllTasks(tasks: Task[]) {
        this.taskTableRef.html("");
        for (let task of tasks) {
            this.renderAddedTask(task);
        }
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

        console.log("Dem: ", task.getTaskID())
        if ($("#" + this.render_config.appendNewTask.targetId).children("#" + task.getTaskID()))
            $("#" + this.render_config.appendNewTask.targetId).children("#" + task.getTaskID()).replaceWith(this.taskRowTemplate(task));
    }

    public initBehaviour(): void {
        this.taskTableRef.on("keypress", (event) => {
            if (event.target.id.includes("taskTitleForEdit") && event.keyCode === 13) {
                $(event.target).trigger("blur");
                this.handleTaskNameChange($(event.target).parent().parent().attr("id"), $(event.target).text());
            }
            if (event.target.id.includes("task-description") && event.keyCode === 13) {
                $(event.target).trigger("blur");
                this.handleTaskDescriptionChange($(event.target).parent().parent().attr("id"), $(event.target).text());
            }
        })
        this.addTaskBtn.on("click", () => {
            this.handleAddTask();
        })
        this.inputShare.on("keypress", event => {
            if (event.keyCode === 13)
                this.handleSharing(this.inputShare.val().toString());
        })
    }


}
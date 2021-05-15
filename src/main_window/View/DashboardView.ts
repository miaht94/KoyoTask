// import { ListModel } from '../Model/ListModel';
// import { TaskModel } from '../Model/TaskModel';
import IO from '../../Utils/iosys';
import $ from 'jquery';
import { Logger } from '../../Utils/Logger'
import Handlebars from 'handlebars'
import { User } from '../Model/User';
import { TableListView } from './TableListView';
import { TableTaskView } from './TableTaskView';
import { List } from '../Model/List';
import { Task } from '../Model/Task';
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

    // private currentTask: TaskModel;


    private sidebar: JQuery<HTMLElement>;

    private userInfoConfig: any;
    private tableListView: TableListView;
    private tableTaskView: TableTaskView;
    constructor() {
        IO.init();
        this.Logger = new Logger(this);
        this.tableListView = new TableListView();
        this.tableTaskView = new TableTaskView();
        this.dashboard = $('#DashboardList');
        this.renderConfig = IO.getData("render_config");

        //USER INFO
        this.userInfoConfig = IO.getData("user");

        // this.initAddListButton();
    }

    public getTableListView(): TableListView {
        return this.tableListView;
    }

    public getTableTaskView(): TableTaskView {
        return this.tableTaskView;
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

    private renderLists(lists: List[]) {
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
    private initListBehavior(list: List) {
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
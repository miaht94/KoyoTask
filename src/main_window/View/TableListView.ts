import $ from 'jquery';
import IO from '../../utils/iosys'
import HandleBars from 'handlebars'
import { ListModel } from '../Model/ListModel';
export class TableListView {
    private listTableRef: JQuery<HTMLElement>;
    private listRowTemplate: HandleBars.TemplateDelegate;
    private listBigTitle: JQuery<HTMLElement>;
    private render_config: any;
    private handleListNameChange: (list_id: string, new_name: string) => void;
    private handleListDescriptionChange: (list_id: string, new_description: string) => void;
    private handleChangeCurrentTaskModel: (list_id: string) => void;
    private handleAddList: () => void;
    private addListBtn: JQuery<HTMLElement>;
    constructor() {
        IO.init();
        this.render_config = IO.getData("render_config");
        this.listTableRef = $("#" + this.render_config.list_group.targetId);
        this.listRowTemplate = HandleBars.compile(this.render_config.list_group.html);
        this.addListBtn = $("#AddListButton");
        this.listBigTitle = $(".list-name-big");
        this.initBehaviour();
    }

    public bindHandleListNameChange(func: (list_id: string, new_name: string) => void) {
        this.handleListNameChange = func;
    }

    public bindHandleListDescriptionChange(func: (list_id: string, new_description: string) => void) {
        this.handleListDescriptionChange = func;
    }

    public bindHandleChangeCurrentTaskModel(func: (list_id: string) => void) {
        this.handleChangeCurrentTaskModel = func;
    }

    public bindHandleAddList(handler: () => void) {
        this.handleAddList = handler;
    }

    public renderAddedList(list: ListModel): void {
        this.listTableRef.append(this.listRowTemplate(list));
        if ($("#list-name-big-" + list.getListID()))
            $("#list-name-big-" + list.getListID()).text(list.getListName());
    }

    public renderModifiedList(list: ListModel, index: number): void {

        $("#" + this.render_config.list_group.targetId).children().eq(index).replaceWith(this.listRowTemplate(list));
        if ($("#list-name-big-" + list.getListID()))
            $("#list-name-big-" + list.getListID()).text(list.getListName());
    }
    public renderModifiedListById(list: ListModel, index?: number): void {
        console.log("Dem: ", list.getListID())
        if ($("#list-name-big-" + list.getListID()))
            $("#list-name-big-" + list.getListID()).text(list.getListName());
        if ($("#" + this.render_config.list_group.targetId).children("#" + list.getListID()))
            $("#" + this.render_config.list_group.targetId).children("#" + list.getListID()).replaceWith(this.listRowTemplate(list));
    }

    public renderListNameBig(title: string) {
        this.listBigTitle.text(title);
    }



    public initBehaviour(): void {
        this.listTableRef.on("keypress", (event) => {
            if (event.target.id.includes("list_name") && event.keyCode === 13) {
                $(event.target).trigger("blur");
                this.handleListNameChange($(event.target).parent().parent().attr("id"), $(event.target).text());
            }
            if (event.target.id.includes("list_description") && event.keyCode === 13) {
                $(event.target).trigger("blur");
                this.handleListDescriptionChange($(event.target).parent().parent().attr("id"), $(event.target).text());
            }
        })

        this.listTableRef.on("click", (event) => {
            console.log("click")
            let temp = $(event.target);
            while (!temp.hasClass("list-group-item") && temp.parent() != temp) {
                temp = temp.parent()
            }
            if (temp.attr("id")) {
                this.handleChangeCurrentTaskModel(temp.attr("id"));
                let a: string = temp.attr("id");
                console.log($("#" + a).children("#list-title").children("#list-name").text());
                this.listBigTitle.text(temp.children("#list-name").text());
                $(".list-name-big").attr("id", "#list-name-big-" + temp.attr("id"))
            }

        })
        this.addListBtn.on("click", () => {
            // let newList: ListModel = ListModel.createEmptyList();

            // this.listTableRef.append(this.listRowTemplate(newList));
            this.handleAddList();
        })
    }
}
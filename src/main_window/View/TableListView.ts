import $ from 'jquery';
import IO from '../../Utils/iosys'
import HandleBars from 'handlebars'
import { List } from '../Model/List';
export class TableListView {
    private listTableRef: JQuery<HTMLElement>;
    private listRowTemplate: HandleBars.TemplateDelegate;
    private listBigTitle: JQuery<HTMLElement>;
    private render_config: any;
    private handleListNameChange: (list_id: string, new_name: string) => void;
    private handleListDescriptionChange: (list_id: string, new_description: string) => void;
    private handleChangeCurrentTaskModel: (list_id: string) => void;
    private handleDeleteList: (list_id: string) => void;
    private handleAddList: (list: List) => void;
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

    public getTableListRef(suffixes?: string): JQuery<HTMLElement> {
        if (suffixes)
            return $("#" + this.render_config.list_group.targetId + suffixes)
        else
            return $("#" + this.render_config.list_group.targetId)
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

    public bindHandleDeleteList(handler: (list_id: string) => void) {
        this.handleDeleteList = handler;
    }

    public renderInsertedList(list: List, i: number): void {
        if (i === 0) {
            this.getTableListRef().prepend(this.listRowTemplate(list));
            return;
        }
        this.getTableListRef("> div:nth-child(" + (i) + ")").after(this.listRowTemplate(list));
    }

    public renderAddedList(list: List): void {
        this.listTableRef.append(this.listRowTemplate(list));
        if ($("#list-name-big-" + list.getListID()))
            $("#list-name-big-" + list.getListID()).text(list.getListName());
    }

    public renderModifiedList(list: List, index: number): void {

        $("#" + this.render_config.list_group.targetId).children().eq(index).replaceWith(this.listRowTemplate(list));
        if ($("#list-name-big-" + list.getListID()))
            $("#list-name-big-" + list.getListID()).text(list.getListName());
    }
    public renderModifiedListById(list: List): void {
        if (this.listTableRef.find("#" + list.getListID()))
            this.listTableRef.find("#" + list.getListID()).replaceWith(this.listRowTemplate(list));
    }

    public renderListNameBig(title: string) {
        this.listBigTitle.text(title);
    }

    public removeListById(list: List, index: number): void {
        let element = this.getTableListRef().find("#" + list.getListID());
        element.hide(300, () => {
            element.remove();
        });
    }



    public initBehaviour(): void {
        this.listTableRef.on("keypress", (event) => {
            if (event.target.id.includes("list_name") && event.keyCode === 13) {
                let temp = event;
                let temp_text = $(event.target).text();
                $(temp.target).trigger("blur");
                if ($(temp.target).text() === "") {
                    this.handleDeleteList($(temp.target).parent().parent().attr("id"));
                }
                else
                    this.handleListNameChange($(temp.target).parent().parent().attr("id"), $(temp.target).text());
            }
            if (event.target.id.includes("list_description") && event.keyCode === 13) {
                let temp = event;
                let temp_text = $(event.target).text();
                $(event.target).trigger("blur");
                if ($(temp.target).text() === "") {
                    this.handleDeleteList($(temp.target).parent().parent().attr("id"));
                }
                else {

                    this.handleListDescriptionChange($(temp.target).parent().parent().attr("id"), $(temp.target).text());
                }
            }
        })

        this.listTableRef.on("mousedown", (event) => {
            console.log("click")


            let temp = $(event.target);
            while (!temp.hasClass("list-group-item") && temp.parent() != temp) {
                temp = temp.parent()
            }
            if (temp.attr("id")) {
                // this.handleChangeCurrentTaskModel(temp.attr("id"));
                let a: string = temp.attr("id");
                console.log($("#" + a).children("#list-title").children("#list-name").text());
                this.listBigTitle.text(temp.children("#list-name").text());
                $(".list-name-big").attr("id", "#list-name-big-" + temp.attr("id"))
            }

        })

        this.listTableRef.on("focus", "#list_name", (event) => {
            console.log("focus");
            if (event.target.id.includes("list_name")) {
                let temp = event;
                let temp_text = $(event.target).text();
                let clickOutSizeListName = (event: any) => {
                    console.log("focusout")
                    $(temp.target).trigger("blur");
                    console.log("Change Name[" + $(temp.target).parent().parent().attr("id") + ", '" + $(temp.target).text() + "' ] ");
                    temp.target.removeEventListener("focusout", clickOutSizeListName)
                    if ($(temp.target).text() === "") {
                        this.handleDeleteList($(temp.target).parent().parent().attr("id"));
                    }
                    else
                        this.handleListNameChange($(temp.target).parent().parent().attr("id"), $(temp.target).text());
                }
                temp.target.addEventListener("focusout", clickOutSizeListName)
            }
        })
        this.listTableRef.on("focus", "#list_description", (event) => {
            if (event.target.id.includes("list_description")) {
                let temp = event;
                let clickOutSizeListName = (event: any) => {
                    $(temp.target).trigger("blur");
                    console.log("Change Description[" + $(temp.target).parent().parent().attr("id") + ", '" + $(temp.target).text() + "' ] ");
                    temp.target.removeEventListener("focusout", clickOutSizeListName)
                    this.handleListDescriptionChange($(temp.target).parent().parent().attr("id"), $(temp.target).text());
                }
                temp.target.addEventListener("focusout", clickOutSizeListName)
            }
        })
        this.addListBtn.on("click", () => {
            let newList: List = List.createEmptyList();
            let list_id = newList.getListID();
            this.handleAddList(newList);
            $("#" + list_id).find("#list_name").click();
            $("#" + list_id).find("#list_name").focus();

        })
    }
}
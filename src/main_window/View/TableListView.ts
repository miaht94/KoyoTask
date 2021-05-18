import $ from 'jquery';
import IO from '../../Utils/iosys'
import HandleBars from 'handlebars'
import { List } from '../Model/List';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;
function collapseSection(element: any) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;

    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function () {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;

        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
        });
    });

    // mark the section as "currently collapsed"
    element.setAttribute('data-collapsed', 'true');
}

export class TableListView {
    private listTableRef: JQuery<HTMLElement>;
    private listRowTemplate: HandleBars.TemplateDelegate;
    private listBigTitle: JQuery<HTMLElement>;
    private render_config: any;
    private handleListNameChange: (list_id: string, new_name: string) => void;
    private handleListDescriptionChange: (list_id: string, new_description: string) => void;
    private handleChangeCurrentList: (list_id: string) => void;
    private handleDeleteList: (list_id: string) => void;
    private handleAddList: () => string;
    private addListBtn: JQuery<HTMLElement>;
    private curListActive: JQuery<HTMLElement>;
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

    public bindHandleChangeCurrentList(func: (list_id: string) => void) {
        this.handleChangeCurrentList = func;
    }

    public bindHandleAddList(handler: () => string) {
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
        // Modify list name 
        $("#" + this.render_config.list_group.targetId).children().eq(index).find("#list_name").text(list.getListName());
        if ($("#list-name-big-" + list.getListID()))
            $("#list-name-big-" + list.getListID()).text(list.getListName());

        // Modify list description 
        $("#" + this.render_config.list_group.targetId).children().eq(index).find("#list_description").text(list.getListDescription());

        // Modify list icon
        let iconElement = $("#" + this.render_config.list_group.targetId).children().eq(index).find("#list_icon").find("i");
        iconElement.removeClass(iconElement.attr("class"));
        iconElement.addClass(list.getListIcon() ? list.getListIcon() : "");
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

            if (event.button === 0) {
                let temp = $(event.target);
                temp = temp.parents().filter(".list-group-item")
                // while (!temp.hasClass("list-group-item") && temp.parent() != temp) {
                //     temp = temp.parent()
                // }
                if (temp && temp.attr("id")) {
                    // temp.toggleClass("active");
                    // if (this.curListActive) {
                    //     this.curListActive.toggleClass("active");
                    // }
                    // this.curListActive = temp;
                    this.handleChangeCurrentList(temp.attr("id"));
                }
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

            let list_id = this.handleAddList();
            $("#" + list_id).find("#list_name").click();
            $("#" + list_id).find("#list_name").focus();

        })
        this.listTableRef.on("click", ".list-group-item", (event) => {

        })

        $(".list-group").on("contextmenu", event => {

            const menu = new Menu();
            let temp1 = $(event.target);
            let temp = temp1.parents().filter(".list-group-item")
            if (temp && temp.hasClass("list-group-item")) {
                menu.append(new MenuItem({
                    label: "Delete this List ????",
                    click: (() => {
                        this.handleDeleteList(temp.attr("id"));
                    }).bind(this)
                }));
            }
            menu.popup({ window: remote.getCurrentWindow() })
        })
    }
}
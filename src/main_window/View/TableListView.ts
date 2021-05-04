import $ from 'jquery';
import IO from '../../utils/iosys'
import HandleBars from 'handlebars'
import { ListModel } from '../Model/ListModel';
export class TableListView {
    private listTableRef: JQuery<HTMLElement>;
    private listRowTemplate: HandleBars.TemplateDelegate;
    private render_config: any;
    private handleListNameChange: (list_id: string, new_name: string) => void;
    private handleListDescriptionChange: (list_id: string, new_description: string) => void;
    constructor() {
        IO.init();
        this.render_config = IO.getData("render_config");
        this.listTableRef = $("#" + this.render_config.list_group.targetId);
        this.listRowTemplate = HandleBars.compile(this.render_config.list_group.html);
        this.initBehaviour();
    }

    public bindHandleListNameChange(func: (list_id: string, new_name: string) => void) {
        this.handleListNameChange = func
    }

    public bindHandleListDescriptionChange(func: (list_id: string, new_description: string) => void) {
        this.handleListDescriptionChange = func
    }

    public renderAddedList(list: ListModel): void {
        this.listTableRef.append(this.listRowTemplate(list));
    }

    public renderModifiedList(list: ListModel, index: number): void {

        $("#" + this.render_config.list_group.targetId).children().eq(index).replaceWith(this.listRowTemplate(list));
    }
    public renderModifiedListById(list: ListModel, index?: number): void {
        console.log("Dem: ", list.getListID())
        if ($("#" + this.render_config.list_group.targetId).children("#" + list.getListID()))
            $("#" + this.render_config.list_group.targetId).children("#" + list.getListID()).replaceWith(this.listRowTemplate(list));
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
    }
}
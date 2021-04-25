import { List, Task } from '../Model/List';
import IOSystem from '../utils/iosys';
import { View } from './View';
import $ from '../js/jquery';
import { User } from '../Model/User';
export class SidebarView {
    private sidebar: HTMLElement;

    private renderConfig: any;
    private userInfoConfig: any;
    private listHTML: String;

    private addListButton: HTMLElement;

    constructor() {
        this.sidebar = $('#SidebarView');

        //USER INFO
        this.userInfoConfig = IOSystem.getData("user");

        //LISTS
        this.renderConfig = IOSystem.getData("render_config");
        this.listHTML = this.renderConfig.appendNewList.html;

        this.initAddListButton();
    }

    public render(lists: List[], userInfo: any ) { 
        // let sidebarForAppender: any = this.sidebar;
        
        //RENDER USER INFO
        this.renderUserInfo(userInfo);
        
        //RENDER LISTS
        this.renderLists(lists);
        
    }

    private renderUserInfo(userInfo: any) {
      let userfieldForAppender : any = $('#UserInfo');

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
      userfieldForAppender.append();
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
}
import IOSystem from '../utils/iosys';
import { List, Task } from './List';
import { Model } from './Model';
import { User } from './User';
import { DashboardView } from '../View/DashboardView';
import "firebase/firestore";
export class DashboardModel extends Model {
    protected lists: List[] = []; //same
    protected currentList: List;
    protected currentUser: User
    protected database : any;
    public onChange: Function;
    protected commit() {
        IOSystem.writeData("list_data", JSON.stringify(this.lists, null, "\t"));
        this.onChange(this.currentList);
    };

    constructor(firebase : any) {
        super();
        this.database = firebase.firestore();
        let lists_json: any = IOSystem.getData("list_data");
        lists_json.forEach((element: any) => {
            let temp_list: List = new List(element);
            this.lists.push(temp_list);
        })
        if (this.lists.length === 0) this.currentList = List.createEmptyList();
        else this.currentList = this.lists[0];

        //Init User data
        IOSystem.init();
        let userData : any = IOSystem.getData("user");
        this.currentUser = new User(userData.fullname, userData.uid, userData.email, userData.avtURL);
        //console.log(JSON.stringify(this.lists));
        console.log("from dashborad model" + this.database);
        // get lists data first time
        let validID = this.database.collection("users").doc(this.currentUser.getUID());
        console.log(validID);
        this.database.collection("lists").where("collaborators", "array-contains" ,validID)
        .get()
        .then((querySnapshot : any) => { 
            querySnapshot.forEach((doc : any) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error : any) => {
            console.log("Error getting documents: ", error);
        });
    }

    public getCurrentUser(): User {
        return this.currentUser;
    }

    public setCurrentUser(user: User): void {
        this.currentUser = user;
    }

    public bindOnChange(viewTriggerFunction: Function) {
        this.onChange = viewTriggerFunction;
    }

    protected assignCurrentList(listID: string): void {
        let element: any;
        for (element in this.lists) {
            if (element.getListID() === listID) {
                this.setCurrentList(element);
            }
        }
    }

    public setCurrentList(list: List) {
        this.currentList = list;
        this.onChange(this.currentList);
    }

    public getCurrentList(): List {
        return this.currentList;
    }

    public addTaskCompactToCurrentList(taskName: string, completed: boolean) {
        this.currentList.addTaskCompact(taskName,completed);
        this.commit();
    }

    public deleteTaskFromCurrentList(taskID: string) {
        // console.log("deleteTaskFromCurrentList executing");
        this.currentList.deleteTask(taskID);
        this.commit();
    }

    public setTaskInCurrentList(taskID: string, that: Task) {
        this.currentList.setTask(taskID, that);
        this.commit();
    }

}
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
    protected firebase : any;
    public onChange: Function;
    ListConverter = {
        toFirestore(list : List) : firebase.firestore.DocumentData {
            return {
                list_name : list.getListName(), list_icon : list.getListIcon() ,tasks : list.getTasks()
            }
        },
        fromFirestore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
        ): List {
            const data = snapshot.data(options)!;
            let list = {
                list_name : data.list_name,
                list_icon : data.list_icon,
                listDescription : data.list_description,
                tasks : [] as any[]
            };
            return new List(list);
        }
    };
    TaskConverter = {
        toFireStore(task : Task) : firebase.firestore.DocumentData {
            return {
                task_name : task.getTaskName(),
                task_description : task.getTaskDescription(),
                completed : task.getCompleted()
            }
        },
        fromFireStore(
            snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions
            ): Task {
                const data = snapshot.data(options)!;
                let task = {
                    task_name : data.task_name,
                    task_description : data.task_description,
                    completed : data.completed
                };
                return Task.createNewTaskByJson(task);
            }
        };
    protected commit() {
        IOSystem.writeData("list_data", JSON.stringify(this.lists, null, "\t"));
        this.onChange(this.currentList);
    };

    constructor(firebase : any) {
        super();
        this.lists = [];
        this.database = firebase.firestore();
        this.firebase = firebase;
        console.log(this.lists);
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

        // get lists data for the first time
        let validID = this.database.collection("users").doc(this.currentUser.getUID());
        console.log(validID);

        //validID = reference to user ID to fetch
        this.database.collection("lists").withConverter(this.ListConverter).where("collaborators", "array-contains" ,validID)
        .get()
        .then((list_Snapshot : any) => { 
            list_Snapshot.forEach((list_doc : any) => {
                console.log("print from Dashboard Model");
                this.currentList = list_doc.data();
                this.currentList.setListID(list_doc.id);

                // get tasks collection
                this.database.collection("lists").withConverter(this.TaskConverter).doc(list_doc.id).collection("tasks").get()
                .then((task_Snapshot : any) => {
                    task_Snapshot.forEach((task_doc : any) => {
                        console.log("111");
                        let task = Task.createNewTaskByJson(task_doc.data());
                        task.setTaskID(task_doc.id);
                        this.currentList.addDefinedTask(task);
                    });
                })
                .catch((error : any) => {
                    console.log("Error getting documents: ", error);
                });
                this.lists.push(this.currentList);
            });
        })
        .catch((error : any) => {
            console.log("Error getting documents: ", error);
        });
        console.log(this.lists);
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
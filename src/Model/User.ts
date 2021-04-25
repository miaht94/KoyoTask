export class User {
    private fullname: string;
    private uid: string;
    private email: string;
    private avtURL: string;

    constructor(fullname : string, uid : string, email : string, avtURL : string) {
        this.fullname = fullname;
        this.uid = uid;
        this.email = email;
        this.avtURL = avtURL;
    }

    public getFullname(): string {
        return this.fullname;
    }

    public setFullname(fullname: string) {
        this.fullname = fullname;
    }

    public getUID(): string {
        return this.uid;
    }

    public setUID(uid: string): void {
        this.uid = uid;
    }

    public getEmail(email: string): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getAvtURL(): string {
        return this.avtURL
    }

    public setAvtURL(avtURL: string): void {
        this.avtURL = avtURL;
    }

}
import firebase from "firebase";
export class User {
    private displayName: string;
    private uid: string;
    private email: string;
    private photoURL: string;
    private provider: string;

    constructor(displayName: string, uid: string, email: string, photoURL: string, provider: string) {
        this.displayName = displayName;
        this.uid = uid;
        this.email = email;
        this.photoURL = photoURL;
        this.provider = provider;
    }

    public getFullname(): string {
        return this.displayName;
    }

    public setFullname(displayName: string) {
        this.displayName = displayName;
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
        return this.photoURL
    }

    public setAvtURL(photoURL: string): void {
        this.photoURL = photoURL;
    }

    public setProvider(provider: string): void {
        this.provider = provider;
    }

    public getProvider(): string {
        return this.provider;
    }
    public static createUserFromFirebaseUser(user: firebase.User): User {
        return new User(user.displayName, user.uid, user.email, user.photoURL, user.providerData[0].providerId)
    }
}
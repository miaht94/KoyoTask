import { app, BrowserWindow } from 'electron';
import Main from './App';

Main.main(app, BrowserWindow);
function add(x: number, y: number): number {
    return x + y;
}

var myAdd = function (x: number, y: number): number { return x + y; };
console.log(myAdd(2, 3));
interface ILoan {
    interest: number
}

class AgriLoan implements ILoan {
    interest: number
    rebate: number

    constructor(interest: number, rebate: number) {
        this.interest = interest
        this.rebate = rebate
    }
}

var obj = new AgriLoan(10, 1);
var obj2 = new AgriLoan(19, 2);
console.log("Interest is : " + obj2.interest + " Rebate is : " + obj.rebate)
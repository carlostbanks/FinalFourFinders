import { action, observable } from "mobx";

interface ILogin {
    username: string;
    password: string;
}

export class LoginVM {
    constructor() {
        //something
    }
    @observable LoginValidation = {
        hasError: true,
        username: false, 
        password: false,
        errors: {
            username: "",
            password: "", //nevermind Moka did it
        }
    }
}
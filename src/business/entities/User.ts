export interface authenticationData {
    id: string
}

export class User {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private nickname: string,
        private password: string
    ) {}

    public getId = () => this.id
    public getName = () => this.name
    public getEmail = () => this.email
    public getNickname = () => this.nickname
    public getPassword = () => this.password
}

export interface signUpInput {
    name: string,
    email: string,
    nickname: string,
    password: string
}
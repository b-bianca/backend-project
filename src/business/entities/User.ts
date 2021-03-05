export interface authenticationData {
    id: string
}

export class User {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly nickname: string,
        readonly password: string
    ) {}
}

export interface signUpInput {
    name: string,
    email: string,
    nickname: string,
    password: string
}

export interface loginInput {
    input: string
    password: string
}
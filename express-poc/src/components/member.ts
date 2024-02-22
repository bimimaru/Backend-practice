import * as luxon from 'luxon'

export class Member {//  5
    name: string
    birthday: string
    joinedDate: luxon.DateTime
    point: number = 0
    homeAddress: string
    id: number | undefined
    enabled: boolean = true

    constructor(name: string, birthday: string, homeAddress: string) {
        this.name = name;
        this.birthday = birthday;
        this.joinedDate = luxon.DateTime.now();
        this.homeAddress = homeAddress;

    }
}

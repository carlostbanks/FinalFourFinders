export interface IFinalTeams {
    one: {name: string, value: any},
    two: {name: string, value: any},
    three: {name: string, value: any},
    four: {name: string, value: any}, 
}

export interface ITeamString {
    one: {name: string},
    two: {name: string},
    three: {name: string},
    four: {name: string},
}


export const firstTeam: {name: string, value: any} = {name: "Florida", value: ""};
export const secondTeam: {name: string, value: any} = {name: "Syracuse", value: ""};
export const thirdTeam: {name: string, value: any} = {name: "Dartmouth", value: ""};
export const fourthTeam: {name: string, value: any} = {name: "Wichita State", value: ""};

export var listTeam: IFinalTeams = {
    one: firstTeam,
    two: secondTeam,
    three: thirdTeam,
    four: fourthTeam,
}

export var teamFinalList: ITeamString = {
    one: {name: firstTeam.name},
    two: {name: secondTeam.name},
    three: {name: thirdTeam.name},
    four: {name: fourthTeam.name}
}

export class storeFE {
    constructor() {
        const uRL: string = "https://finalfourfinders-api.onrender.com/api/recommendations"
    }
}
import { IFinalTeams } from "../Recommendations/recListVM";
import { observable } from "mobx";

export const firstTeam: {name: string, value: any} = {name: "", value: ""};
export const secondTeam: {name: string, value: any} = {name: "", value: ""};
export const thirdTeam: {name: string, value: any} = {name: "", value: ""};
export const fourthTeam: {name: string, value: any} = {name: "", value: ""}; /*

@observable var listTeams: IFinalTeams = {
    one: firstTeam,
    two: secondTeam,
    three: thirdTeam,
    four: fourthTeam,
}*/

export var listTeam: IFinalTeams = {
    one: firstTeam,
    two: secondTeam,
    three: thirdTeam,
    four: fourthTeam,
}
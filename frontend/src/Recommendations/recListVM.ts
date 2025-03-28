import { action, observable } from "mobx";
import { listTeam } from "../components/teamStoreFE";

interface ITopFourTeams {
    team1: string;
    team2: string;
    team3: string;
    team4: string;
}

export interface IFinalTeams {
    one: {name: string, value: any},
    two: {name: string, value: any},
    three: {name: string, value: any},
    four: {name: string, value: any},
}

export class recListVM {
    @observable history: any;

    constructor(history: any) {
        this.history = history; /*
        
        onClickSave() {
            const teamsToSave: ITopFourTeams = {
                team1: "",
                team2: "",
                team3: "",
                team4: "",
            }
            //const 

            const package: IFinalTeams = {
                one: listTeam.one!,
                two: listTeam.two!,
                three: listTeam.three!,
                four: listTeam.four!,
            };

            const payload: any = {
                package: package ? package : undefined,
                iD: 456,
            }

            try {

            } catch(error) {
                console.error((error as Error).message);
            }
        };*/
    }
}
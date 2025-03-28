import { action, observable} from 'mobx';

export class recomendationVM {
    @observable history;

    constructor(history) {
        this.history = history;

        //tech debt
    }
}
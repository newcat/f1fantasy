import Driver from "./Driver";

export default class Team {

    private name: string;
    private budget: number;
    private driver1: Driver;
    private driver2: Driver;

    constructor(name: string, budget: number, driver1: Driver, driver2: Driver) {
        this.name = name;
        this.budget = budget;
        this.driver1 = driver1;
        this.driver2 = driver2;
    }

}
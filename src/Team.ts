import Driver from "./Driver";

export default class Team {

    public name: string;
    public budget: number;
    public driver1: Driver;
    public driver2: Driver;

    public get expectedPoints(): number {
        return this.driver1.expectedPoints - this.driver1.expectedDriverOnlyPoints +
            this.driver2.expectedPoints - this.driver2.expectedDriverOnlyPoints;
    }

    constructor(name: string, budget: number, driver1: Driver, driver2: Driver) {
        this.name = name;
        this.budget = budget;
        this.driver1 = driver1;
        this.driver2 = driver2;
    }

}

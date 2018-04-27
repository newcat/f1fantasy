import Team from "./Team";
import Driver from "./Driver";

export interface ICombination {
    budget: number;
    expectedPoints: number;
    team: Team;
    d1: Driver;
    d2: Driver;
    d3: Driver;
    d4: Driver;
    d5: Driver;
    turbo: Driver;
}

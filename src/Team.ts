import Driver, { IDriverStatistic } from "./Driver";

export default class Team {

    public name: string;
    public budget: number;
    public driver1: Driver;
    public driver2: Driver;

    public get expectedPoints(): number {
        const d1Points = this.driver1.expectedPoints - this.driver1.expectedDriverOnlyPoints;
        const d2Points = this.driver2.expectedPoints - this.driver2.expectedDriverOnlyPoints;

        // Streaks
        // TODO: Enable when streaks are implemented in F1 Fantasy
        const d1s = this.driver1.statistic as IDriverStatistic;
        const d2s = this.driver2.statistic as IDriverStatistic;
        // let streakPoints = 0;
        const streakPoints = 0;

        // Constructor Qualifying - both drivers qualify in Top 10 for 3 races in a row: +5 pts
        if (d1s.hasTeamQualifyingStreakChance && d2s.hasTeamQualifyingStreakChance) {
            // streakPoints += d1s.reachesQ3Perc * d2s.reachesQ3Perc * 5;
        }

        // Constructor Race - both drivers finish race in Top 10 for 3 races in a row: +10 pts
        if (d1s.hasTeamRaceStreakChance && d2s.hasTeamRaceStreakChance) {
            // streakPoints += d1s.finishesRaceTop10Perc * d2s.finishesRaceTop10Perc * 10;
        }

        return d1Points + d2Points + streakPoints;

    }

    constructor(name: string, budget: number, driver1: Driver, driver2: Driver) {
        this.name = name;
        this.budget = budget;
        this.driver1 = driver1;
        this.driver2 = driver2;
    }

}

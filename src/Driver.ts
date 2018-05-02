import { IQualifyingResult, IRaceResult } from "./ResultModels";

export interface IDriverStatistic {
    // Qualifying
    medianQualifyingResult: number;
    outqualifiesTeammatePerc: number;
    reachesQ2Perc: number;
    reachesQ3Perc: number;
    doesNotQualifyPerc: number;
    hasDriverQualifyingStreakChance: boolean;
    hasTeamQualifyingStreakChance: boolean;

    // Race
    medianRaceResult: number;
    medianRacePositionChange: number;
    finishesRaceAheadOfTeammatePerc: number;
    finishesRaceTop10Perc: number;
    fastestLapPerc: number;
    dnfChance: number;
    dsqChance: number;
    hasDriverRaceStreakChance: boolean;
    hasTeamRaceStreakChance: boolean;
}

const racePointsLookupTable = [
    25, 18, 15, 12, 10, 8, 6, 4, 2, 1
];

export default class Driver {

    public name: string;
    public num: number;
    public budget: number;
    public dominanceFactor: number;

    public qualifyingResults: IQualifyingResult[] = [];
    public raceResults: IRaceResult[] = [];
    public statistic?: IDriverStatistic;
    public expectedPoints: number = 0;
    public expectedDriverOnlyPoints: number = 0;

    constructor(name: string, num: number, budget: number, dominanceFactor: number) {
        this.name = name;
        this.num = num;
        this.budget = budget;
        this.dominanceFactor = dominanceFactor;
    }

    public calculateExpectedPoints() {
        if (!this.statistic) {
            console.log(`Statistic not calculated for driver ${this.name}`);
            return;
        }

        const s = this.statistic;
        let p = 0;
        let dp = 0;

        // Qualifying -> TODO: Check if this makes sense

        // Did not progress to Q2: 1 pt
        p += (1 - s.reachesQ2Perc) * 1;
        // Progressed to Q2 but did not progress to Q3: 2 pts
        p += (s.reachesQ2Perc - s.reachesQ3Perc) * 2;
        // Progressed to Q3: 3 pts
        p += s.reachesQ3Perc * 3;
        // Qualified ahead of team mate: 2 pts (driver only)
        dp += s.outqualifiesTeammatePerc * 2;
        // Did not qualify: -5 pts (driver only)
        dp += s.doesNotQualifyPerc * -5;
        // Qualifying Position Bonuses
        if (s.medianQualifyingResult <= 10) {
            p += 11 - s.medianQualifyingResult;
        }

        // Race

        // Finished Race: 1 pt
        p += (1 - s.dnfChance - s.dsqChance) * 1;
        // Finished ahead of team mate: 3 pts (driver only)
        dp += s.finishesRaceAheadOfTeammatePerc * 3;
        // Finished race, position gained: +2 pts per place gained (max +10 pts)
        if (s.medianRacePositionChange > 0) {
            const posGainPt = s.medianRacePositionChange * 2;
            p += posGainPt > 10 ? 10 : posGainPt;
        }
        // Fastest lap: 5 pts (driver only)
        dp += s.fastestLapPerc * 5;
        // Started race within Top 10, finished race but lost position: -2 pts per place lost (max -10 pts)
        if (s.medianQualifyingResult <= 10 && s.medianRacePositionChange < 0) {
            const pts = s.medianRacePositionChange * 2;
            p += pts < -10 ? -10 : pts;
        }
        // Started race outside Top 10, finished race but lost position: -1 pt per place lost (max -5 pts)
        if (s.medianQualifyingResult > 10 && s.medianRacePositionChange < 0) {
            const pts = s.medianRacePositionChange * 1;
            p += pts < -5 ? -5 : pts;
        }
        // Did not finish race: -15 pts (driver only)
        dp += s.dnfChance * -15;
        // Disqualification from race: -20 pts (driver only)
        dp += s.dsqChance * -20;
        // Finishing Position Bonuses
        if (s.medianRaceResult <= 10) {
            p += racePointsLookupTable[s.medianRaceResult - 1];
        }

        // Streaks
        // TODO: Enable streaks when they are implemented in F1 Fantasy

        // Driver Qualifying - driver qualifies in Top 10 for 5 races in a row: +5 pts
        // if (s.hasDriverQualifyingStreakChance) { dp += s.reachesQ3Perc * 5; }
        // Driver Race - driver finishes race in Top 10 for 5 races in a row: +10 pts
        // if (s.hasDriverRaceStreakChance) { dp += s.finishesRaceTop10Perc * 10; }

        // TODO: Dominance Factor

        this.expectedPoints = p + dp;
        this.expectedDriverOnlyPoints = dp;

    }

}

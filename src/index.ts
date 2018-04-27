import * as _ from "lodash";
import * as lowdb from "lowdb";
import * as FileAsync from "lowdb/adapters/FileSync";

import { drivers as initialDrivers, teams as initialTeams } from "./InitialData";
import Driver from "./Driver";
import Team from "./Team";
import { RequestInstance as req } from "./Request";
import { IRoundResult } from "./ResultModels";

const db = lowdb(new FileAsync("db.json"));
const drivers = initialDrivers.map((d) => new Driver(d.name, d.num, d.budget, 0));
const teams = initialTeams.map((t) => new Team(t.name, t.budget,
    driverByNum(t.driver1) as Driver, driverByNum(t.driver2) as Driver));
const rounds: IRoundResult[] = [];

async function initializeDb() {
    if (!db.has("rounds").value()) {
        console.log("No DB existing yet, creating new");
        await db.defaults({ rounds: [] }).write();
    }
}

function driverByNum(num: number) {
    return drivers.find((d) => d.num === num);
}

async function fetchResults() {

    // get last round number
    const lastRound = await req.getLastRoundNumber();
    console.log(`Fetched last round number: ${lastRound}`);

    for (let i = 1; i <= lastRound; i++) {

        // try to load race from database if it is there
        const res = await db.get("rounds").filter({ round: i }).value();
        let round: IRoundResult;
        if (res.length === 0) {
            round = await req.getRound(i);
            await db.get("rounds").push(round).write();
        } else {
            round = ((res as any) as IRoundResult[])[0];
            console.log(`Loaded ${round.name} from database.`);
        }
        rounds.push(round);

    }

    // map results to drivers
    rounds.forEach((round) => {

        round.qualifyingResults.forEach((q) => {
            const driver = driverByNum(q.driverNumber);
            if (!driver) { throw Error(`Could not find driver with number ${q.driverNumber}`); }
            driver.qualifyingResults.push(q);
        });

        round.raceResults.forEach((r) => {
            const driver = driverByNum(r.driverNumber);
            if (!driver) { throw Error(`Could not find driver with number ${r.driverNumber}`); }
            driver.raceResults.push(r);
        });

    });

}

function median(values: number[]) {
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ?
        values[half] :
        Math.round((values[half - 1] + values[half]) / 2.0);
}

function calculateDriverStatistics(driver: Driver, teammate: Driver) {

    const roundCount = rounds.length;
    let outqualifiesTeammate = 0;
    let finishesRaceAheadOfTeammate = 0;
    const positionChanges: number[] = [];

    for (let i = 0; i < roundCount; i++) {
        if (driver.qualifyingResults[i].position < teammate.qualifyingResults[i].position) { outqualifiesTeammate++; }
        if (driver.raceResults[i].position < teammate.raceResults[i].position) { finishesRaceAheadOfTeammate++; }
        positionChanges.push(driver.qualifyingResults[i].position - driver.raceResults[i].position);
    }

    // Qualifying
    const medianQualifyingResult = median(driver.qualifyingResults.map((q) => q.position));
    const outqualifiesTeammatePerc = outqualifiesTeammate / roundCount;
    const reachesQ2Perc = driver.qualifyingResults.filter((q) => q.position <= 15).length / roundCount;
    const reachesQ3Perc = driver.qualifyingResults.filter((q) => q.position <= 10).length / roundCount;
    const doesNotQualifyPerc = driver.qualifyingResults.filter((q) => q.times.q1 === 0).length / roundCount;
    const hasDriverQualifyingStreakChance = _.takeRight(driver.qualifyingResults, 4).every((q) => q.position <= 10);
    const hasTeamQualifyingStreakChance = _.takeRight(driver.qualifyingResults, 2).every((q) => q.position <= 10);

    // Race
    const medianRaceResult = median(driver.raceResults.map((r) => r.position));
    const medianRacePositionChange = median(positionChanges);
    const finishesRaceAheadOfTeammatePerc = finishesRaceAheadOfTeammate / roundCount;
    const finishesRaceTop10Perc = driver.raceResults.filter((r) => r.position <= 10).length / roundCount;
    const fastestLapPerc = driver.raceResults.filter((r) => r.hasPostedFastedLap).length / roundCount;
    const dnfChance = driver.raceResults.filter((r) => r.positionText === "R").length / roundCount;
    const dsqChance = driver.raceResults.filter((r) => r.positionText === "D").length / roundCount;
    const hasDriverRaceStreakChance = _.takeRight(driver.raceResults, 4).every((r) => r.position <= 10);
    const hasTeamRaceStreakChance = _.takeRight(driver.raceResults, 2).every((r) => r.position <= 10);

    driver.statistic = {
        medianQualifyingResult, outqualifiesTeammatePerc, reachesQ2Perc, reachesQ3Perc, doesNotQualifyPerc,
        hasDriverQualifyingStreakChance, hasTeamQualifyingStreakChance,
        medianRaceResult, medianRacePositionChange, finishesRaceAheadOfTeammatePerc,
        finishesRaceTop10Perc, fastestLapPerc, dnfChance, dsqChance,
        hasDriverRaceStreakChance, hasTeamRaceStreakChance
    };

}

function calculateTeamStatistics() {
    teams.forEach((t) => {
        calculateDriverStatistics(t.driver1, t.driver2);
        calculateDriverStatistics(t.driver2, t.driver1);
        t.driver1.calculateExpectedPoints();
        t.driver2.calculateExpectedPoints();
    });
}

function outputExpectedPoints() {
    teams.forEach((t) => {
        console.log(`${t.name}: ${t.expectedPoints}`);
        console.log(`\t${t.driver1.name}: ${t.driver1.expectedPoints}`);
        console.log(`\t${t.driver2.name}: ${t.driver2.expectedPoints}`);
    });
}

(async () => {

    console.log("Initializing DB");
    await initializeDb();

    console.log("Fetching Results");
    await fetchResults();

    console.log("Calculating expected points");
    calculateTeamStatistics();

    outputExpectedPoints();

})();

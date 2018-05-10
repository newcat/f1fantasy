import * as _ from "lodash";
import * as lowdb from "lowdb";
import * as FileAsync from "lowdb/adapters/FileSync";

import { drivers as initialDrivers, teams as initialTeams, budgetAvailable } from "./InitialData";
import Driver from "./Driver";
import Team from "./Team";
import { RequestInstance as req } from "./Request";
import { IRoundResult } from "./ResultModels";
import { ICombination } from "./Combination";
import exportMarkdown from "./MarkdownExporter";

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
        console.log(`${t.name}: ${t.expectedPoints.toFixed(2)}`);
        console.log(`\t${t.driver1.name}: ${t.driver1.expectedPoints.toFixed(2)}`);
        console.log(`\t${t.driver2.name}: ${t.driver2.expectedPoints.toFixed(2)}`);
    });
}

function isCompatibleWithCurrentTeam(c: ICombination): boolean {
    const currentDrivers = [ 77, 5, 18, 27, 14 ];
    const currentTeam = "McLaren F1 Team";
    let changesNeeded = 0;
    if (currentDrivers.indexOf(c.d1.num) < 0) { changesNeeded++; }
    if (currentDrivers.indexOf(c.d2.num) < 0) { changesNeeded++; }
    if (currentDrivers.indexOf(c.d3.num) < 0) { changesNeeded++; }
    if (currentDrivers.indexOf(c.d4.num) < 0) { changesNeeded++; }
    if (currentDrivers.indexOf(c.d5.num) < 0) { changesNeeded++; }
    if (c.team.name !== currentTeam) { changesNeeded++; }
    return changesNeeded <= 1;
}

const combinations: ICombination[] = [];
let bestCompatibleComb: ICombination | undefined;
function calculateCombinations() {
    for (const team of teams) {
        const b0 = team.budget;
        for (let d1 = 0; d1 < drivers.length - 4; d1++) {
            const b1 = b0 + drivers[d1].budget;
            for (let d2 = d1 + 1; d2 < drivers.length - 3; d2++) {
                const b2 = b1 + drivers[d2].budget;
                for (let d3 = d2 + 1; d3 < drivers.length - 2; d3++) {
                    const b3 = b2 + drivers[d3].budget;
                    for (let d4 = d3 + 1; d4 < drivers.length - 1; d4++) {
                        const b4 = b3 + drivers[d4].budget;
                        for (let d5 = d4 + 1; d5 < drivers.length; d5++) {
                            const budget = b4 + drivers[d5].budget;
                            if (budget > budgetAvailable) { continue; }
                            for (let turbo = 0; turbo < 5; turbo++) {
                                let turboDriver: Driver;
                                switch (turbo) {
                                    case 0: turboDriver = drivers[d1]; break;
                                    case 1: turboDriver = drivers[d2]; break;
                                    case 2: turboDriver = drivers[d3]; break;
                                    case 3: turboDriver = drivers[d4]; break;
                                    case 4: turboDriver = drivers[d5]; break;
                                    default: turboDriver = drivers[d1];
                                }
                                if (turboDriver.budget > 19) { continue; }
                                const ep = team.expectedPoints + drivers[d1].expectedPoints +
                                    drivers[d2].expectedPoints + drivers[d3].expectedPoints +
                                    drivers[d4].expectedPoints + drivers[d5].expectedPoints +
                                    turboDriver.expectedPoints;
                                const comb = { budget, expectedPoints: ep, team, turbo: turboDriver, d1: drivers[d1],
                                                d2: drivers[d2], d3: drivers[d3], d4: drivers[d4], d5: drivers[d5] };
                                combinations.push(comb);
                                if (isCompatibleWithCurrentTeam(comb) &&
                                    (!bestCompatibleComb || bestCompatibleComb.expectedPoints < comb.expectedPoints)) {
                                        bestCompatibleComb = comb;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function outputCombination(c: ICombination) {

    console.log("Expected Points: ", c.expectedPoints.toFixed(2));
    console.log(`Team: ${c.team.name} (${c.team.expectedPoints.toFixed(2)})`);
    console.log(`Driver 1: ${c.d1.name} (${c.d1.expectedPoints.toFixed(2)})`);
    console.log(`Driver 2: ${c.d2.name} (${c.d2.expectedPoints.toFixed(2)})`);
    console.log(`Driver 3: ${c.d3.name} (${c.d3.expectedPoints.toFixed(2)})`);
    console.log(`Driver 4: ${c.d4.name} (${c.d4.expectedPoints.toFixed(2)})`);
    console.log(`Driver 5: ${c.d5.name} (${c.d5.expectedPoints.toFixed(2)})`);
    console.log(`Turbo Driver: ${c.turbo.name}`);
    console.log(`TOTAL BUDGET USE: ${c.budget}`);

}

(async () => {

    console.log("Initializing DB");
    await initializeDb();

    console.log("Fetching Results");
    await fetchResults();

    console.log("Calculating expected points");
    calculateTeamStatistics();

    outputExpectedPoints();

    console.log("Calculating best combination");
    calculateCombinations();
    console.log(`Found ${combinations.length} valid combinations`);

    const sortedCombs = combinations.sort((a, b) => a.expectedPoints - b.expectedPoints);
    console.log("\n=== BEST COMBINATION ===");
    outputCombination(sortedCombs[sortedCombs.length - 1]);

    console.log("\n=== OTHER COMBINATIONS ===\n");
    _.takeRight(sortedCombs, 10).slice(1).forEach((c) => {
        outputCombination(c);
        console.log("");
    });

    console.log("\n=== BEST COMBINATION WITH CURRENT TEAM ===\n");
    if (bestCompatibleComb) {
        outputCombination(bestCompatibleComb);
    } else {
        console.log("Could not find compatible combination.");
    }

    await exportMarkdown(rounds[rounds.length - 1], teams, drivers, sortedCombs);

})();

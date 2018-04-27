import { drivers as initialDrivers, teams as initialTeams } from "./InitialData";
import Driver from "./Driver";
import Team from "./Team";
import * as _ from "lodash";
import * as lowdb from "lowdb";

const drivers = initialDrivers.map((d) => new Driver(d.name, d.num, d.budget, 0));
const teams = initialTeams.map((t) => new Team(t.name, t.budget,
    driverByNum(t.driver1) as Driver, driverByNum(t.driver2) as Driver));

function driverByNum(num: number) {
    return drivers.find((d) => d.num === num);
}

function fetchResults() {

    

}
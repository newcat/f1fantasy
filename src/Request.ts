import axios from "axios";
import { IRoundResult, IRaceResult, IQualifyingResult } from "./ResultModels";

export class Request {

    private readonly axiosInstance = axios.create({
        baseURL: "https://ergast.com/api/f1/current/"
    });

    private lastRequest?: number;

    public async getLastRoundNumber(): Promise<number> {
        const last = await this.get("last.json");
        return last.RaceTable.round;
    }

    public async getRound(round: number): Promise<IRoundResult> {
        const race = (await this.get(`${round}/results.json`)).RaceTable.Races[0];
        const quali = (await this.get(`${round}/qualifying.json`)).RaceTable.Races[0];
        return {
            name: race.raceName,
            round: Number.parseInt(race.round),
            raceResults: race.Results.map((r: any) => {
                return {
                    driverNumber: Number.parseInt(r.Driver.permanentNumber),
                    position: Number.parseInt(r.position),
                    positionText: r.positionText,
                    status: r.status,
                    hasPostedFastedLap: r.FastestLap ? r.FastestLap.rank === "1" : false
                } as IRaceResult;
            }),
            qualifyingResults: quali.QualifyingResults.map((q: any) => {
                return {
                    driverNumber: Number.parseInt(q.Driver.permanentNumber),
                    position: Number.parseInt(q.position),
                    times: {
                        q1: q.Q1 ? this.parseDuration(q.Q1) : 0,
                        q2: q.Q2 ? this.parseDuration(q.Q2) : 0,
                        q3: q.Q3 ? this.parseDuration(q.Q3) : 0
                    }
                } as IQualifyingResult;
            })
        } as IRoundResult;
    }

    private waitThrottle(): Promise<void> {
        return new Promise((res, rej) => {
            const updateLastRequest = () => { this.lastRequest = Date.now(); };
            if (!this.lastRequest || (Date.now() - this.lastRequest) > 1000) {
                updateLastRequest();
                res();
            } else {
                 setTimeout(() => {
                    updateLastRequest();
                    res();
                }, 1000 - Date.now() + this.lastRequest);
            }
        });
    }

    private async get(url: string): Promise<any> {
        try {
            await this.waitThrottle();
            console.log(`GET /${url}`);
            return (await this.axiosInstance.get(url)).data.MRData;
        } catch (err) {
            console.log(`Failed to get ${url}: `, err);
        }
    }

    private parseDuration(duration: string): number {
        const match = /(\d+):(\d+)\.(\d+)/.exec(duration);
        if (!match) { throw new SyntaxError("Failed to parse duration: " + duration); }
        const minutes = Number.parseInt(match[1]);
        const seconds = Number.parseInt(match[2]);
        const millis = Number.parseInt(match[3]);
        return minutes * 60000 + seconds * 1000 + millis;
    }

}

export const RequestInstance = new Request();

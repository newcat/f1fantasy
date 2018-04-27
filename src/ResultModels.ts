export interface IQualifyingResult {
    driverNumber: number;
    times: {
        q1: number;
        q2: number;
        q3: number;
    };
    position: number;
}

export interface IRaceResult {
    driverNumber: number;
    position: number;
    positionText: string;
    status: string;
    hasPostedFastedLap: boolean;
}

export interface IRoundResult {
    round: number;
    name: string;
    qualifyingResults: IQualifyingResult[];
    raceResults: IRaceResult[];
}

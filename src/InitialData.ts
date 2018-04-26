export interface IInitialDriver {
    name: string;
    team: number;
    num: number;
    budget: number;
}

export interface IInitialTeam {
    name: string;
    driver1: number;
    driver2: number;
    budget: number;
}

export const drivers: IInitialDriver[] = [
    {
        name: "Lewis Hamilton",
        team: 0,
        num: 44,
        budget: 29.8
    },
    {
        name: "Valtteri Bottas",
        team: 0,
        num: 77,
        budget: 25.3
    },
    {
        name: "Sebastian Vettel",
        team: 1,
        num: 5,
        budget: 28.0
    },
    {
        name: "Kimi Räikkönen",
        team: 1,
        num: 7,
        budget: 20.0
    },
    {
        name: "Daniel Ricciardo",
        team: 2,
        num: 3,
        budget: 20.5
    },
    {
        name: "Max Verstappen",
        team: 2,
        num: 33,
        budget: 19.7
    },
    {
        name: "Sergio Perez",
        team: 3,
        num: 11,
        budget: 12.0
    },
    {
        name: "Esteban Ocon",
        team: 3,
        num: 31,
        budget: 11.3
    },
    {
        name: "Lance Stroll",
        team: 4,
        num: 18,
        budget: 8.5
    },
    {
        name: "Sergei Sirotkin",
        team: 4,
        num: 35,
        budget: 7.5
    },
    {
        name: "Nico Hülkenberg",
        team: 5,
        num: 27,
        budget: 12.0
    },
    {
        name: "Carlos Sainz jr.",
        team: 5,
        num: 55,
        budget: 9.5
    },
    {
        name: "Brendon Hartley",
        team: 6,
        num: 28,
        budget: 6.5
    },
    {
        name: "Pierre Gasly",
        team: 6,
        num: 10,
        budget: 7.5
    },
    {
        name: "Romain Grosjean",
        team: 7,
        num: 8,
        budget: 6.5
    },
    {
        name: "Kevin Magnussen",
        team: 7,
        num: 20,
        budget: 7.5
    },
    {
        name: "Fernando Alonso",
        team: 8,
        num: 14,
        budget: 11.5
    },
    {
        name: "Stoffel Vandoorne",
        team: 8,
        num: 2,
        budget: 8.0
    },
    {
        name: "Marcus Ericsson",
        team: 9,
        num: 9,
        budget: 5.5
    },
    {
        name: "Charles Leclerc",
        team: 9,
        num: 16,
        budget: 4.5
    }
];

export const teams: IInitialTeam[] = [
    {
        name: "Mercedes AMG Petronas Motorsport",
        driver1: 44,
        driver2: 77,
        budget: 30.0
    },
    {
        name: "Scuderia Ferrari",
        driver1: 5,
        driver2: 7,
        budget: 27.5
    },
    {
        name: "Aston Martin Red Bull Racing",
        driver1: 3,
        driver2: 33,
        budget: 20.0
    },
    {
        name: "Sahara Force India F1 Team",
        driver1: 11,
        driver2: 31,
        budget: 10.5
    },
    {
        name: "Williams Martini Racing",
        driver1: 18,
        driver2: 35,
        budget: 9.0
    },
    {
        name: "Renault Sport F1 Team",
        driver1: 27,
        driver2: 55,
        budget: 9.7
    },
    {
        name: "Red Bull Toro Rosso Honda",
        driver1: 28,
        driver2: 10,
        budget: 7.8
    },
    {
        name: "Haas F1 Team",
        driver1: 8,
        driver2: 20,
        budget: 5.5
    },
    {
        name: "McLaren F1 Team",
        driver1: 14,
        driver2: 2,
        budget: 9.5
    },
    {
        name: "Alfa Romeo Sauber F1 Team",
        driver1: 9,
        driver2: 16,
        budget: 5.0
    }
];
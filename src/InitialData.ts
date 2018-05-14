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

export const budgetAvailable = 99.1;

export const drivers: IInitialDriver[] = [
    {
        name: "Lewis Hamilton",
        team: 0,
        num: 44,
        budget: 30.1
    },
    {
        name: "Valtteri Bottas",
        team: 0,
        num: 77,
        budget: 25.0
    },
    {
        name: "Sebastian Vettel",
        team: 1,
        num: 5,
        budget: 27.6
    },
    {
        name: "Kimi Räikkönen",
        team: 1,
        num: 7,
        budget: 18.9
    },
    {
        name: "Daniel Ricciardo",
        team: 2,
        num: 3,
        budget: 20.2
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
        budget: 13.2
    },
    {
        name: "Esteban Ocon",
        team: 3,
        num: 31,
        budget: 9.6
    },
    {
        name: "Lance Stroll",
        team: 4,
        num: 18,
        budget: 9.3
    },
    {
        name: "Sergei Sirotkin",
        team: 4,
        num: 35,
        budget: 7.4
    },
    {
        name: "Nico Hülkenberg",
        team: 5,
        num: 27,
        budget: 10.5
    },
    {
        name: "Carlos Sainz jr.",
        team: 5,
        num: 55,
        budget: 10.8
    },
    {
        name: "Brendon Hartley",
        team: 6,
        num: 28,
        budget: 7.3
    },
    {
        name: "Pierre Gasly",
        team: 6,
        num: 10,
        budget: 6.5
    },
    {
        name: "Romain Grosjean",
        team: 7,
        num: 8,
        budget: 5.6
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
        budget: 11.9
    },
    {
        name: "Stoffel Vandoorne",
        team: 8,
        num: 2,
        budget: 7.0
    },
    {
        name: "Marcus Ericsson",
        team: 9,
        num: 9,
        budget: 5.9
    },
    {
        name: "Charles Leclerc",
        team: 9,
        num: 16,
        budget: 6.1
    }
];

export const teams: IInitialTeam[] = [
    {
        name: "Mercedes AMG Petronas Motorsport",
        driver1: 44,
        driver2: 77,
        budget: 31.3
    },
    {
        name: "Scuderia Ferrari",
        driver1: 5,
        driver2: 7,
        budget: 27.6
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
        budget: 11.4
    },
    {
        name: "Williams Martini Racing",
        driver1: 18,
        driver2: 35,
        budget: 9.8
    },
    {
        name: "Renault Sport F1 Team",
        driver1: 27,
        driver2: 55,
        budget: 10.2
    },
    {
        name: "Red Bull Toro Rosso Honda",
        driver1: 28,
        driver2: 10,
        budget: 8.2
    },
    {
        name: "Haas F1 Team",
        driver1: 8,
        driver2: 20,
        budget: 6.0
    },
    {
        name: "McLaren F1 Team",
        driver1: 14,
        driver2: 2,
        budget: 9.6
    },
    {
        name: "Alfa Romeo Sauber F1 Team",
        driver1: 9,
        driver2: 16,
        budget: 6.7
    }
];

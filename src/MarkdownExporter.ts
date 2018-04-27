import Team from "./Team";
import { ICombination } from "./Combination";
import { IRoundResult } from "./ResultModels";

import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

function outputCombination(stream: fs.WriteStream, comb: ICombination) {

    stream.write(`- Expected Points: **${comb.expectedPoints.toFixed(2)}**\n`);
    stream.write(`- Turbo Driver: **${comb.turbo.name}**\n`);
    stream.write(`- Budget: **${comb.budget}**\n\n`);
    stream.write(`[]() | Driver / Team | Expected Points\n--- | --- | ---\n`);
    stream.write(`Team | ${comb.team.name} | ${comb.team.expectedPoints.toFixed(2)}\n`);
    stream.write(`Driver 1 | ${comb.d1.name} | ${comb.d1.expectedPoints.toFixed(2)}\n`);
    stream.write(`Driver 2 | ${comb.d2.name} | ${comb.d2.expectedPoints.toFixed(2)}\n`);
    stream.write(`Driver 3 | ${comb.d3.name} | ${comb.d3.expectedPoints.toFixed(2)}\n`);
    stream.write(`Driver 4 | ${comb.d4.name} | ${comb.d4.expectedPoints.toFixed(2)}\n`);
    stream.write(`Driver 5 | ${comb.d5.name} | ${comb.d5.expectedPoints.toFixed(2)}\n`);

}

export default function exportMarkdown(round: IRoundResult, teams: Team[], sortedCombs: ICombination[]): Promise<void> {

    return new Promise((res, rej) => {

        const stream = fs.createWriteStream(path.resolve(__dirname, "../results", `Round${round.round}.md`));
        stream.once("open", (fd) => {

            stream.write(`# Round ${round.round} - ${round.name}\n`);

            stream.write("## Expected Points - Drivers\nDriver | Expected Points\n--- | ---\n");
            teams.forEach((t) => {
                stream.write(`${t.driver1.name} | ${t.driver1.expectedPoints.toFixed(2)}\n`);
                stream.write(`${t.driver2.name} | ${t.driver2.expectedPoints.toFixed(2)}\n`);
            });

            stream.write("## Expected Points - Teams\nTeam | Expected Points\n--- | ---\n");
            teams.forEach((t) => {
                stream.write(`${t.name} | ${t.expectedPoints.toFixed(2)}\n`);
            });

            stream.write("## Best Combination\n");
            outputCombination(stream, sortedCombs[sortedCombs.length - 1]);

            stream.write("\n## Other Combinations\n");
            _.takeRight(sortedCombs, 10).reverse().splice(1).forEach((c) => {
                outputCombination(stream, c);
                stream.write("\n\n---\n\n");
            });

            stream.end(res);

        });

    });

}

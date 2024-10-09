const fs = require('fs');
const csv = require('csv-parser');

function matchesWonPerTeam() {
    const results = {};

    fs.createReadStream('/home/naveed/Desktop/js-ipl-data-project/src/data/matches.csv')
        .pipe(csv())
        .on('data', (row) => {
            const year = new Date(row.date).getFullYear();
            const winningTeam = row.winner;

            if (!results[year]) results[year] = {};
            results[year][winningTeam] = (results[year][winningTeam] || 0) + 1;
        })
        .on('end', () => {
            fs.writeFileSync('output/matchesWonPerTeam.json', JSON.stringify(results, null, 2));
            console.log('Matches won per team per year saved to output/matchesWonPerTeam.json');
        });
}

matchesWonPerTeam();

// const fs = require('fs');
// const csv = require('csv-parser');

// function extraRunsConceded() {
//     const results = {};

//     fs.createReadStream('/home/naveed/Desktop/js-ipl-data-project/src/data/deliveries.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             const year = new Date(row.date).getFullYear();
//             const team = row.bowling_team;
//             const extras = parseInt(row.extra_runs, 10) || 0;

//             if (year === 2016) {
//                 if (!results[team]) results[team] = 0;
//                 results[team] += extras;
//             }
//         })
//         .on('end', () => {
//             fs.writeFileSync('home/naveed/Desktop/js-ipl-data-project/src/public/output/extra.json', JSON.stringify(results, null, 2));
//             console.log('Extra runs conceded in 2016 saved to output/extraRunsConceded.json');
//         });
// }

// extraRunsConceded();
const fs = require('fs');
const csv = require('csv-parser');

// Function to map match_id to year from matches.csv
function getMatchYearMapping(callback) {
    const matchYearMap = {};
    const matchesFilePath = '/home/naveed/Desktop/js-ipl-data-project/src/data/matches.csv';

    fs.createReadStream(matchesFilePath)
        .pipe(csv())
        .on('data', (row) => {
            matchYearMap[row.id] = parseInt(row.season, 10); // Map match_id to year (season)
        })
        .on('end', () => {
            callback(matchYearMap); // Execute the callback after reading the file
        });
}

// Function to calculate extra runs conceded in 2016
function extraRunsConceded() {
    getMatchYearMapping((matchYearMap) => {
        const results = {};
        const deliveriesFilePath = '/home/naveed/Desktop/js-ipl-data-project/src/data/deliveries.csv';
        const outputFilePath = '/home/naveed/Desktop/js-ipl-data-project/src/public/output/extra.json';

        fs.createReadStream(deliveriesFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const matchYear = matchYearMap[row.match_id]; // Get the year from match_id
                const team = row.bowling_team;
                const extras = parseInt(row.extra_runs, 10) || 0;

                if (matchYear === 2016) {  // Filter only 2016 deliveries
                    if (!results[team]) results[team] = 0;
                    results[team] += extras;
                }
            })
            .on('end', () => {
                fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
                console.log('Extra runs conceded in 2016 saved to', outputFilePath);
            });
    });
}

extraRunsConceded();


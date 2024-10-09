const fs = require('fs');
const csv = require('csv-parser');

function matchesPerYear() {
    const results = {};

    fs.createReadStream('/home/naveed/Desktop/js-ipl-data-project/src/data/matches.csv')
        .pipe(csv())
        .on('data', (row) => {
            const year = new Date(row.date).getFullYear();
            results[year] = (results[year] || 0) + 1;
        })
        .on('end', () => {
            fs.writeFileSync('output/matchesPerYear.json', JSON.stringify(results, null, 2));
            console.log('Number of matches per year saved to output/matchesPerYear.json');
        });
}

matchesPerYear();

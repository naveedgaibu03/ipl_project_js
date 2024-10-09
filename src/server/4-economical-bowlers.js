// const csv = require('csv-parser');
// const fs = require('fs');

// let matches2015 = []; 
// let bowlersEconomy = {}; 

// fs.createReadStream('home/naveed/Desktop/js-ipl-data-project/src/data/matches.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     const year = row['season'];
//     if (year === '2015') {
//       matches2015.push(row['id']); 
//     }
//   })
//   .on('end', () => {
//     console.log('Matches for 2015 processed:', matches2015);
    
//     calculateEconomyRates();
//   });


//   //From Deliveries.csv
// function calculateEconomyRates() {
//   const totalRunsByBowler = {}; 
//   const totalOversByBowler = {}; 

//   fs.createReadStream('home/naveed/Desktop/js-ipl-data-project/src/data/deliveries.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//       const matchId = row['match_id'];
//       const bowler = row['bowler'];
//       const totalRuns = parseInt(row['total_runs'], 10) ; 

//      if (matches2015.includes(matchId)) {
//         if (!totalRunsByBowler[bowler]) {
//           totalRunsByBowler[bowler] = 0;
//           totalOversByBowler[bowler] = 0;
//         }

//         totalRunsByBowler[bowler] += totalRuns;

     
//           totalOversByBowler[bowler] += 1;
//       }
//     })
//     .on('end', () => {
//       for (const bowler in totalRunsByBowler) {
//         const runs = totalRunsByBowler[bowler];
//         const overs = totalOversByBowler[bowler]/6; 
//         const economyRate = (runs / overs).toFixed(2);
//         bowlersEconomy[bowler] = economyRate;
//       }

//       const sortedBowlers = Object.entries(bowlersEconomy).sort((a, b) => a[1] - b[1]);

//       console.log('Top 10 economical bowlers in 2015:');
//       console.log(sortedBowlers.slice(0, 10));

//       writeEconomyToJson(sortedBowlers.slice(0, 10));
//     });
// }

// function writeEconomyToJson(resultant) {
//   const jsonContent = JSON.stringify(resultant, null, 2); 

//   const outputPath = '/home/naveed/Desktop/js-ipl-data-project/src/public/output/10economicalBowler.json';

//   fs.writeFile(outputPath, jsonContent, (err) => {
//     if (err) {
//       console.error('Error writing to file', err);
//     } else {
//       console.log('Successfully sent data into JSON!!!');
//     }
//   });
// }
const csv = require('csv-parser');
const fs = require('fs');

let matches2015 = [];
let bowlersEconomy = {};

// Read matches.csv to get match IDs from 2015
fs.createReadStream('/home/naveed/Desktop/js-ipl-data-project/src/data/matches.csv')
  .pipe(csv())
  .on('data', (row) => {
    const year = row['season'];
    if (year === '2015') {
      matches2015.push(row['id']); 
    }
  })
  .on('end', () => {
    console.log('Matches for 2015 processed:', matches2015);
    calculateEconomyRates();
  });

// Function to calculate economy rates from deliveries.csv
function calculateEconomyRates() {
  const totalRunsByBowler = {}; 
  const totalBallsByBowler = {}; 

  fs.createReadStream('/home/naveed/Desktop/js-ipl-data-project/src/data/deliveries.csv')
    .pipe(csv())
    .on('data', (row) => {
      const matchId = row['match_id'];
      const bowler = row['bowler'];
      const totalRuns = parseInt(row['total_runs'], 10);
      const wideRuns = parseInt(row['wide_runs'], 10) || 0;
      const noBallRuns = parseInt(row['noball_runs'], 10) || 0;

      if (matches2015.includes(matchId)) {
        if (!totalRunsByBowler[bowler]) {
          totalRunsByBowler[bowler] = 0;
          totalBallsByBowler[bowler] = 0;
        }

        // Add all runs to bowler's total runs
        totalRunsByBowler[bowler] += totalRuns;

        // Count only legal deliveries, excluding wide and no-ball deliveries
        if (wideRuns === 0 && noBallRuns === 0) {
          totalBallsByBowler[bowler] += 1;
        }
      }
    })
    .on('end', () => {
      for (const bowler in totalRunsByBowler) {
        const runs = totalRunsByBowler[bowler];
        const balls = totalBallsByBowler[bowler];
        const overs = balls / 6; // Calculate overs from balls

        if (overs > 0) {
          const economyRate = (runs / overs).toFixed(2);
          bowlersEconomy[bowler] = economyRate;
        }
      }

      // Sort bowlers by economy rate in ascending order
      const sortedBowlers = Object.entries(bowlersEconomy).sort((a, b) => a[1] - b[1]);

      console.log('Top 10 economical bowlers in 2015:');
      console.log(sortedBowlers.slice(0, 10));

      writeEconomyToJson(sortedBowlers.slice(0, 10));
    });
}

// Write the top 10 economical bowlers to a JSON file
function writeEconomyToJson(resultant) {
  const jsonContent = JSON.stringify(resultant, null, 2); 

  const outputPath = '/home/naveed/Desktop/js-ipl-data-project/src/public/output/10economicalBowler.json';

  fs.writeFile(outputPath, jsonContent, (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Successfully saved top 10 economical bowlers data to JSON!');
    }
  });
}

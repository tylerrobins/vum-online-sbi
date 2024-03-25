// Import csv
const fs = require('fs');

const bisTypeActsObj = {};
const bisActs = [];
const coverOptsByTypes = {};

function readAndProcessFile(filePath, processRow) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const rows = data.split('\n');
            rows.forEach(row => processRow(row));
            resolve();
        });
    });
}

async function dataModels() {
    // Get Business Activities from csv
    await readAndProcessFile('data/Business Lite Product Options.csv', (row) => {
        // If first row skip
        const columns = row.split(',');
        const category = columns[0];
        if (category === 'Category') return;
        const thisCoverObj = {
            option: {
                coverName: columns[1],
                totalPremium: columns[2],
                stockContentLmt: columns[3],
                barLmt: columns[5],
                paLmt: columns[7],
                plLmt: columns[9],
                sasriaLmt: columns[11],
                coverNotes: cleanString(columns[13])
            }
        };
        if (!coverOptsByTypes[category]) { coverOptsByTypes[category] = []; }
        coverOptsByTypes[category].push(thisCoverObj);
    });

    // Get Cover Options from csv
    await readAndProcessFile('data/Business Lite Business Activities.csv', (row) => {
            const columns = row.split(',');
            const bisType = columns[0];
            if (bisType === "Type") return;
            const coverOption = columns[1].replace(/\r/g, '');
            if (!bisTypeActsObj[bisType]) {
                bisTypeActsObj[bisType] = [];
            }
            bisTypeActsObj[bisType].push(coverOption);
            bisActs.push(coverOption);
        });
    return { bisTypeActsObj, bisActs, coverOptsByTypes };
}

function cleanString(inputString) {
    // Remove \" and \r from the string
    // This targets the exact sequence of \ followed by " and removes them
    // Also removes all carriage return characters
    return inputString.replace(/\"/g, '').replace(/\r/g, '');
}



module.exports = dataModels;

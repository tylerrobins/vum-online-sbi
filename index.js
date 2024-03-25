const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const dataModels = require('./data/dataModels');

const port = process.env.PORT || 3000;

async function startServer() {
    const { bisTypeActsObj, bisActs, coverOptsByTypes } = await dataModels();
    // generateAndLogDataStructure(bisTypeActsObj, bisActs, coverOptsByTypes);
    const router = require('./router')(bisTypeActsObj, bisActs, coverOptsByTypes);

    app.use(express.static('public'));
    app.use(express.static('public'));


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} => ${req.method} ${req.originalUrl}`);
        next();
    });

    app.use(router);
    
    app.listen(port, () => console.log(`Listening on port ${port}!`))
}

startServer().catch(err => console.error("Failed to start Express server:",err));

function generateAndLogDataStructure(bisTypeActsObj, bisActs, coverOptsByTypes ){
    let bisString = "[";
    for (const act in bisActs) {
        bisString += (`"${bisActs[act]}",`);
    }
    bisString += "]";
    console.log(`
        {
            "bisTypeActsObj": {
                "desc": "This is the Business Object, it contains all the Business Activities by Type. With Type being the first key and the Business Activities being the values.",
                "contains": ${JSON.stringify(bisTypeActsObj)}
            },
            "bisActs": {
                "desc": "This is a List of all the business activities",
                "contains": ${bisString}
            },
            "coverOptsByTypes": {
                "desc": "This is the Cover Options Object, it contains all Cover Options by Type. The first key is the Type and the values are the Cover Options avaliable to that type.",
                "contains": ${JSON.stringify(coverOptsByTypes)}
            },
        }`
    );
}

const router = require('express').Router();

// Get DATA
const bisActsByType = require('../data/bisActsByType');
const coverOptsByTypes = require('../data/coverOptionsObj');
const DateOptionsController = require('../data/inceptionDateLogic');

function createRouter(channelInfo) {
    const channelName = channelInfo;
    const dateOptionsController = new DateOptionsController();

    router.get('', (req, res) => {
        // redirect to business-activies
        res.redirect(`/${channelName.route}/business-activities`);
    });

    router.get('/business-activities', (req, res) => {
        console.log('Business Activities');
        const cellNumber = req.query['cell-number'] || "";
        res.render(
            `${channelName.route}/business-activities`,
            {
                cellNumber,
                bisActsByType,
                channelName
            }
        );
    });

    router.get('/cover-options', (req, res) => {
        const bisAct = req.query['business-activity'];
        const bisType = bisActsByType[bisAct];
        const coverOpts = coverOptsByTypes[bisType];
        const cellNumber = req.query['cell-number'];
        res.render(
            `${channelName.route}/cover-options`,
            {
                cellNumber,
                bisAct,
                bisType,
                coverOpts,
                channelName
            }
        );
    });

    router.get('/inception-form', (req, res) => {
        const inceptionDateOptions = dateOptionsController.getInceptionDateOptions();
        const bisAct = req.query['business-activity'];
        const bisType = req.query['business-type'];
        const coverOpt = req.query['cover-option'];
        const cellNumber = req.query['cell-number'];
        if (cellNumber.length > 0) {
            console.log(`Cell Number: ${cellNumber}`);
        } else {
            console.log(`No cell number provided`);
        }
        console.log(`Cell Number: ${JSON.stringify(cellNumber)}`);
        console.log(`Inception Date Options: ${JSON.stringify(inceptionDateOptions)}`);
        res.render(
            `${channelName.route}/inception-form`,
            {
                ...inceptionDateOptions,
                cellNumber,
                bisAct,
                bisType,
                coverOpt,
                channelName
            }
        );
    });

    router.post('/business-activities', (req, res) => {
        const cellNumber = req.body['cell-number'];
        const bisAct = req.body.bisAct;
        console.log(`Business Activity: ${bisAct}, Cell Number: ${cellNumber}`);
        res.redirect(`/${channelName.route}/cover-options?cell-number=${cellNumber}&business-activity=${bisAct}`);
    });

    router.post('/cover-options', (req, res) => {
        const cellNumber = req.body['cell-number'];
        const coverOpt = req.body['cover-option'];
        const bisAct = req.body['business-activity'];
        const bisType = bisActsByType[bisAct];
        console.log(`Cover Option: ${coverOpt}, Cell Number: ${cellNumber}, Business Activity: ${bisAct}, Business Type: ${bisType}`);
        res.redirect(`/${channelName.route}/inception-form?cell-number=${cellNumber}&business-activity=${bisAct}&business-type=${bisType}&cover-option=${coverOpt}`);
    });
    
    return router;
}

module.exports = createRouter;

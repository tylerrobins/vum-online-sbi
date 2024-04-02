const router = require('express').Router();

// Get DATA
const bisActsByType = require('../data/bisActsByType');
const coverOptsByTypes = require('../data/coverOptionsObj');
const DateOptionsController = require('../data/inceptionDateLogic');

function createRouter(channelInfo) {
    const dateOptionsController = new DateOptionsController();

    router.get('', (req, res) => {
        // redirect to business-activies
        res.redirect(`/${channelInfo.route}/business-activities`);
    });

    router.get('/business-activities', (req, res) => {
        const cellNumber = req.query['cell-number'] || "";
        res.render(
            `${channelInfo.route}/business-activities`,
            {
                cellNumber,
                bisActsByType,
                channelInfo
            }
        );
    });

    router.get('/cover-options', (req, res) => {
        const bisAct = req.query['business-activity'];
        const bisType = bisActsByType[bisAct];
        const coverOpts = coverOptsByTypes[bisType];
        const cellNumber = req.query['cell-number'];
        res.render(
            `${channelInfo.route}/cover-options`,
            {
                cellNumber,
                bisAct,
                bisType,
                coverOpts,
                channelInfo
            }
        );
    });

    router.get('/inception-form', (req, res) => {
        const inceptionDateOptions = dateOptionsController.getInceptionDateOptions();
        const bisAct = req.query['business-activity'];
        const bisType = req.query['business-type'];
        const coverOpt = req.query['cover-option'];
        const cellNumber = req.query['cell-number'];
        res.render(
            `${channelInfo.route}/inception-form`,
            {
                ...inceptionDateOptions,
                cellNumber,
                bisAct,
                bisType,
                coverOpt,
                channelInfo
            }
        );
    });

    router.post('/business-activities', (req, res) => {
        const cellNumber = req.body['cell-number'];
        const bisAct = req.body.bisAct;
        res.redirect(`/${channelInfo.route}/cover-options?cell-number=${cellNumber}&business-activity=${bisAct}`);
    });

    router.post('/cover-options', (req, res) => {
        const cellNumber = req.body['cell-number'];
        const coverOpt = req.body.coverOpt;
        const bisAct = req.body['business-activity'];
        const bisType = bisActsByType[bisAct];
        res.redirect(`/${channelInfo.route}/inception-form?cell-number=${cellNumber}&business-activity=${bisAct}&business-type=${bisType}&cover-option=${coverOpt}`);
    });

    router.get('/inception-form2', (req, res) => {
        const cellNumber = req.query['cell-number'] || "";
        res.render(
            `${channelInfo.route}/inception-form2`,
            {
                cellNumber,
                bisActsByType,
                coverOptsByTypes,
                channelInfo
            }
        );
    })
    
    return router;
}

module.exports = createRouter;

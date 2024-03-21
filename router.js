const router = require('express').Router();

const avaliableRoutes = {
    '/': {
        method: 'GET',
        title: 'Index',
        description: 'Returns the index page with all available routes and their descriptions'
    },
    '/inception/business-activities': {
        method: 'GET',
        title: 'Inception - Business Activities',
        description: 'Return starting page for inception'
    },
    
};

function myRouter( bisTypeActsObj, bisActs, coverOptsByTypes) {
    router.get('/', (req, res) => {
        res.render('index', { bisTypeActsObj, bisActs, coverOptsByTypes });
    });
    return router;
}

module.exports = myRouter;
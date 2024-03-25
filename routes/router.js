const router = require('express').Router();
const createRouter = require('./create-router');

// Routes
const avaliableRoutes = {
    '/': {
        method: 'GET',
        title: 'Index',
        description: 'Returns the index page with all available routes and their descriptions',
        route: ''
    },
    '/business-activities': {
        method: 'GET',
        title: 'Inception - Business Activities',
        description: 'Return starting page for inception',
        route: '/business-activities'
    },
    '/cover-options': {
        method: 'POST',
        title: 'Inception - Cover Options',
        description: 'Return cover options based on the business activity',
        route: '/cover-options'
    }
};

router.get('/', (req, res) => {
    res.render('index', { avaliableRoutes });
});

router.use('/santam-example',createRouter({
    route: 'santam-example',
    title: 'Santam Example'
  }));


module.exports = router;
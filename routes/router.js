const router = require('express').Router();
const fs = require('fs-extra');

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
        method: 'GET | POST',
        title: 'Business Activities Selection Page',
        description: 'Returns the business activities selection page with a form to select a business activity. Posts the selected business activity and redirects to cover options page',
    },
    '/cover-options': {
        method: 'GET | POST',
        title: 'Cover Options Selection Page',
        description: 'Returns the cover options selection page with a form to select a cover option. Posts the selected cover option and redirects to inception form page',
    },
    '/inception-form': {
        method: 'GET | POST',
        title: 'Inception Form Page',
        description: 'Returns the inception form page with a form to select an inception date. Posts the inception form data and redirects to the channels WhatsApp chat',
    },
};

const availableChannels = {
    example: {
        route: 'example',
        title: 'Example'
    },
};

router.get('/', (req, res) => {
    res.render('index', { avaliableRoutes, availableChannels });
});

// Base directories for the example to copy from
const baseViewDir = `views/example`;
const basePublicDir = `public/example`;

// Iterate through the availableChannels to set up dynamic routes and directories
Object.keys(availableChannels).forEach(async channelKey => {
    const channel = availableChannels[channelKey];

    // Determine the target directories based on the channel
    const channelViewsDir = `views/${channel.route}`;
    const channelPublicDir = `public/${channel.route}`;

    // Copy the example directory to the new channel's directory for views
    if (!fs.existsSync(channelViewsDir)) {
        try {
            await fs.copy(baseViewDir, channelViewsDir);
            console.log(`Copied views for channel: ${channel.route}`);
        } catch (err) {
            console.error(`Error copying views for channel ${channel.route}:`, err);
        }
    }

    // Copy the example directory to the new channel's directory for public
    if (!fs.existsSync(channelPublicDir)) {
        try {
            await fs.copy(basePublicDir, channelPublicDir);
            console.log(`Copied public files for channel: ${channel.route}`);
        } catch (err) {
            console.error(`Error copying public files for channel ${channel.route}:`, err);
        }
    }

    // Create channel specific routes
    router.use(`/${channel.route}`, createRouter({
        route: channel.route,
        title: channel.title
    }));
});

module.exports = router;
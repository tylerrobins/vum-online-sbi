## New channels
Channels each have their own unique:
- router 
- public folder
- views folder

### Router
Within the routes directory, there is a channel file (.js) that contains the router and create-router file.
So within the route directory you will have:
- routes
    - create-router.js
    - router.js

##### Router.js file
In the router.js file, you will have:
```javascript
router.use('/channel-one',createRouter({
    route: 'channel-one',
    title: 'Channel One'
  }));
router.use('/channel-two',createRouter({
    route: 'channel-two',
    title: 'Channel Two'
  }));
```

The create channel router function (createRouter) will create all the routes needed for the channel, with the channel specific information.

!NB
The route property in the createRouter function needs to be what is used when creating the view folder and the public folder.

### Public folder
This folder requires the same name as the route property in the createRouter function. So if the route property is 'channel-one', the public folder will be 'channel-one'.
e.g
- public
    - channel-one
        - css
        - js
        - imgs
    - channel-two
        - css
        - js
        - imgs
    - css
    - js
    - imgs

The channel specific css, js and imgs will be stored in the channel specific public folder.
Where as the global css, js and imgs will be stored in the public folder.
The global folders will contain the base structures, layouts and functionality, where as the channel specific folders will contain the channel specific css, js and imgs (such as logos and page titles).

### Views folder
This folder requires the same name as the route property in the createRouter function. So if the route property is 'channel-one', the views folder will be 'channel-one'.
e.g
- views
    - channel-one
        - index.ejs
        - about.ejs
    - channel-two
        - index.ejs
        - about.ejs
    - index.ejs

Each channel specific view will contain relative and absolute connections to the channel specific public folder. So any changes that need to be made should be made there.



const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

const X_AUTH_USER_CODE = 'x-auth-user-code';
const X_APP_KEY = 'x-app-key';
const X_UPDATE_ID = 'x-update-id';

app.use(express.static(path.join(__dirname, '../')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
})

app.use('/api', (req, res, next) => {
    if (req.headers[X_APP_KEY]
            && req.headers[X_APP_KEY] === 'myappkey') {
        next();
        return;
    }
    res.status(400).json({error: 'Common headers missing'});
});

app.use('/api/auth', (req, res, next) => {
    if (req.headers[X_AUTH_USER_CODE]
            && req.headers[X_AUTH_USER_CODE] === 'myusercode') {
        next();
        return;
    }
    res.status(401).json({error: 'Unauthorized'});
});

app.get('/api/auth/profile', (req, res) => {
    res.status(200).json({name: 'Sumeet'});
});

app.post('/api/auth/profile/update', (req, res) => {
    const updateId = req.headers[X_UPDATE_ID];
    if(req.body.name && updateId) {
        res.status(201).json({status: `updated: ${updateId}`});
        return;
    }
    res.status(400).json({error: 'missing update header/ post data'});
});

app.get('/api/app/status', (req, res) => {
    res.status(200).json({status: 'success'});
});

app.get('/api/app/echo', (req, res) => {
    if (req.query.version && req.query.locale) {
        res.status(200).json({
            version: req.query.version,
            locale: req.query.locale
        });
        return;
    }
    res.status(400).json({error: 'version query param missing'});
});

app.listen(process.env.NODE_PORT);
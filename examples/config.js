const baseUrl = 'http://localhost:9000';

const authEndpoints = {
    'profile' : {
        type: 'GET',
        url: '/profile'
    },
    'profile-update' : {
        type: 'POST',
        url: '/profile/update',
        headers: {
            'X-Update-Id': '1234'
        }
    }
};

const unAuthEndpoints = {
    'echo' : {
        type: 'GET',
        url: '/echo?version={version}&locale={locale}'
    },
    'status' : {
        type: 'GET',
        url: '/status',
        responseType: 'json'
    }
};

const authHeaders = {
    'X-Auth-User-Code' : 'myusercode'
};

const commonHeaders = {
    'X-App-Name': 'Demo $olar',
    'X-App-Key' : 'myappkey',
    'Content-Type': 'application/json'
};

const authConfig = {
    'basePath' : '/api/auth'
};

const unAuthConfig = {
    'basePath' : '/api/app',
    'headers' : {
        'Unauth' : true
    }
};
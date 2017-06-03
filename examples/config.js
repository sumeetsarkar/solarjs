const baseUrl = 'http://localhost:9000';

const authEndpoints = {
    'profile' : {
        method: 'GET',
        url: '/profile'
    },
    'profile-update' : {
        method: 'POST',
        url: '/profile/update',
        headers: {
            'X-Update-Id': '1234'
        }
    }
};

const unAuthEndpoints = {
    'echo' : {
        method: 'GET',
        url: '/echo?version={version}&locale={locale}'
    },
    'status' : {
        method: 'GET',
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
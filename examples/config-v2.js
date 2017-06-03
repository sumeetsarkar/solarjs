const solarConfig = {
    baseUrl: 'http://localhost:9000',
    authEndpoints: {
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
    },
    unAuthEndpoints: {
        'echo' : {
            method: 'GET',
            url: '/echo?version={version}&locale={locale}'
        },
        'status' : {
            method: 'GET',
            url: '/status',
            responseType: 'json'
        }
    },
    authHeaders: {
        'X-Auth-User-Code' : 'myusercode'
    },
    commonHeaders: {
        'X-App-Name': 'Demo $olar',
        'X-App-Key' : 'myappkey',
        'Content-Type': 'application/json'
    },
    authConfig: {
        'basePath' : '/api/auth'
    },
    unAuthConfig: {
        'basePath' : '/api/app',
        'headers' : {
            'Unauth' : true
        }
    }
};
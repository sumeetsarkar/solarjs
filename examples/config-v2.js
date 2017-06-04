const solarConfig = {
    baseUrl: 'http://localhost:9000',
    authEndpoints: {
        'profile': {
            method: 'GET',
            url: '/profile'
        },
        'profile-update': {
            method: 'POST',
            url: '/profile/update',
            headers: {
                'X-Update-Id': '1234'
            }
        }
    },
    unAuthEndpoints: {
        'echo': {
            method: 'GET',
            url: '/echo?version={version}&locale={locale}'
        },
        'status': {
            method: 'GET',
            url: '/status',
            responseType: 'json'
        }
    },
    commonHeaders: {
        'X-App-Name': 'Demo $olar',
        'X-App-Key': 'myappkey',
        'Content-Type': 'application/json'
    },
    authConfig: {
        'basePath': '/api/auth',
        'headers': {
            'X-Auth-User-Code': 'myusercode'
        }
    },
    unAuthConfig: {
        'basePath': '/api/app',
        'headers': {
            'Unauth': true
        }
    },
    customRequestGroups: {
        'group1': {
            parent: 'unAuth',
            config: {
                'basePath': '/custom/v1',
                'headers': {
                    'Custom-Group-Header': 'CustomGroupHeaderValue'
                }
            },
            endpoints: {
                'status': {
                    method: 'GET',
                    url: '/status',
                    responseType: 'json'
                }
            }
        },
        'group2': {
            parent: 'auth',
            config: {
                'basePath': '/custom/v2',
                'headers': {
                    'Custom-Group-Header-V2': 'CustomGroupHeaderValueV2'
                }
            },
            endpoints: {
                'profile': {
                    method: 'GET',
                    url: '/profile',
                    responseType: 'json'
                }
            }
        },
        'group3': {
            config: {
                'basePath': '/custom/v3',
                'headers': {
                    'Custom-Group-Header-V3': 'CustomGroupHeaderValueV3'
                }
            },
            endpoints: {
                'status': {
                    method: 'GET',
                    url: '/status',
                    responseType: 'json'
                }
            }
        }
    }
};
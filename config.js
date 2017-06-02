const baseUrl = 'http://my-app-endpoint.domain.com';

const authEndpoints = {
    'api1' : {
        type: 'GET',
        'url': '/v1/getprofile'
    },
    'api2' : {
        type: 'POST',
        'url': '/v1/updateconfig'
    }
};

const unAuthEndpoints = {
    'api3' : {
        type: 'GET',
        'url': '/v1/getnews?locale={locale}'
    },
    'api4' : {
        type: 'GET',
        'url': '/v1/getconfig?version={version}'
    }
};

const authHeaders = {
    'x-auth-user-code' : '1234qwer123ewr',
};

const commonHeaders = {
    'X-App-Name': 'Demo $olar',
    'Content-Type': 'application/json'
};

const authConfig = {
    'basePath' : '/solar/api'
};

const unAuthConfig = {
    'basePath' : '/solar/api'
};
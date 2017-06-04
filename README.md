# Solar

> Solar is a fast, small, and highly configurable JavaScript XHR wrapper library.

The aim is to keep all the XHR requests in a webapp manageable and configurable. Solar allows grouping of requests into authenticated and unauthenticated configs under a common baseUrl. Each config can specify basePaths and additional headers. In addition, configs can be added for Common headers, request specific headers and responseTypes.

Once the configuration is done, Solar can be used to make XHR requests with just the api name. If needed additional parameter payload can be passed in too, apart from the regular success and error callbacks.

However, Solar can also be used to send XHR requests wihtout any configs for standalone requests.

### Limitations for now
Currently supports GET, POST, PUT

### Upcoming features
1. Promises support
2. HTTP Delete support
2. Custom configurable request groups, apart from Auth and Unauth groups

## Including Solar
Solar is available only as standalone library from github repo. No CDN support as of now.

### Browser
#### Script tag

```html
<script src="<your-path>/solar.min.js"></script>
```

### How To Use [Solar](lib/solar.js)

#### Chain addition of solar config
```js
$olar.setBaseUrl(baseUrl)
    .setAuthenticatedEndpoints(authEndpoints)
    .setUnAuthenticatedEndpoints(unAuthEndpoints)
    .setCommonHeaders(commonHeaders)
    .setAuthHeaders(authHeaders)
    .setAuthConfig(authConfig)
    .setUnAuthConfig(unAuthConfig);
```

#### Or Load full config at once from json
```js
$olar.loadConfig(solarConfig);
```

### Solar config declaration styles
1. [Individual Config](examples/config.js)
2. [Single JSON config](examples/config-v2.js)

### Solar example usage
[Example usage in app.js](examples/app.js)

### Simple Solar call once config is done
```js
$olar.executeUnAuth('status');
```

### Making Authenticated API requests
As per configuration, Solar picks up the following -
Http Method type
Auth specific/ common/ endpoint specific headers
Auth basePath
XHR Reponse Type
Additional headers can be passed on while sending the request
executeAuth takes in payload, success callback and error callback

```js
$olar.executeAuth('profile-update',
    {   
        data: { /* Post Data */
            name: ['Sumeet Sarkar']
        },
        headers: { /* Headers */
            'X-Auth-Dynamic': 'some-dynamic-data'
        }
    },
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);
```

### Making Unauthenticated API requests
As per configuration, Solar picks up the following -
Http Method type
Common/ endpoint specific headers
UnAuth basePath
XHR Reponse Type
Additional headers can be passed on while sending the request
executeUnAuth takes in payload, success callback and error callback

```js
$olar.executeUnAuth('echo', 
    {   
        params: { /* Query Params */
            version: 1234,
            locale: 'en'
        }
    },
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);
```

### Bypassing all configs and using Solar to make XHR
```js
$olar.request({
        /* Method */
        method: 'GET',
        /* Url */
        url: '/api/app/echo?version={version}&locale={locale}',
        /* Query Params */
        params: { 
            version: 1234,
            locale: 'en'
        },
        /* Headers */
        headers: {
            'X-App-Name': 'Demo $olar',
            'X-App-Key' : 'myappkey',
            'Content-Type': 'application/json'
        }
    },
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);
```

#### To display all configs
```js
$olar.info();
```

### Starting the example
    npm run start-example

### Build Solar dist
    npm run build
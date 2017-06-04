# Solar

> Solar is a fast, small, and highly configurable JavaScript XHR wrapper library.

The aim is to keep all the XHR requests in a webapp manageable and configurable. Solar allows grouping of requests into authenticated and unauthenticated configs or custom request groups under a common baseUrl. Each config can specify basePaths and additional headers. Custom Request groups can inherit from a parent auth or unauth config. In addition, configs can be added for Common headers, request specific headers and responseTypes.

Once the configuration is done, Solar can be used to make XHR requests with just the api name or group name if any. If needed additional parameter payload can be passed in as argument apart from the regular success and error callbacks.

However, Solar can also be used to send XHR requests wihtout any configs for standalone requests.

### Limitations for now
Currently supports GET, POST, PUT

### Upcoming features
1. Promises support
2. HTTP Delete support

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
    .setAuthConfig(authConfig)
    .setUnAuthConfig(unAuthConfig)
    .addCustomRequestGroup('group1', group1)
    .addCustomRequestGroup('group2', group2)
    .addCustomRequestGroup('group3', group3);
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
$olar.executeAuth('profile');
$olar.executeUnAuth('status');
$olar.executeCustom('group1', 'status');
```

### Making Authenticated API requests
As per configuration, Solar picks up the following -
Http Method type, Auth specific/ common/ endpoint specific headers, Auth basePath, XHR Reponse Type.
Additional headers can be passed on while sending the request.
Function executeAuth takes in payload, success callback and error callback

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
Http Method type, Common/ endpoint specific headers, UnAuth basePath, XHR Reponse Type.
Additional headers can be passed on while sending the request.
Function executeUnAuth takes in payload, success callback and error callback

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

### Making Custom Group API requests
Solar picks up the api from the group specified and merges group specific & common configs together.
If the custom group inherits a parent group like auth or unauth, then corresponding parent's configs are merged.

```js
// call custom group api
$olar.executeCustom('group1', 'status', 
    {}, /* No Post Data */ /* No Query params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);
```


### Bypassing all configs and using Solar to make simple standalone XHR
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
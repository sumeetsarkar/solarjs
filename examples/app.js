/**
 * Demo usage of $solar lib
 */ 
// chain addition of solar config
$olar.setBaseUrl(baseUrl)
    .setAuthenticatedEndpoints(authEndpoints)
    .setUnAuthenticatedEndpoints(unAuthEndpoints)
    .setCommonHeaders(commonHeaders)
    .setAuthConfig(authConfig)
    .setUnAuthConfig(unAuthConfig)
    .addCustomRequestGroup('group1', group1)
    .addCustomRequestGroup('group2', group2)
    .addCustomRequestGroup('group3', group3);

// load full config at once from json
$olar.loadConfig(solarConfig);

// to display all configs
$olar.info();

// Making Authenticated API requests
$olar.executeAuth('profile',
    {}, /* No Post Data */ /* No Query Params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err));

// Making Authenticated API requests
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

// Making Unauthenticated API requests
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

$olar.executeUnAuth('status',
    {}, /* No Post Data */ /* No Query params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);

// call without any callbacks
$olar.executeUnAuth('status');

// call custom group api
$olar.executeCustom('group1', 'status', 
    {}, /* No Post Data */ /* No Query params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);

// call custom group api
$olar.executeCustom('group2', 'profile', 
    {}, /* No Post Data */ /* No Query params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);

// call custom group api
$olar.executeCustom('group3', 'status', 
    {}, /* No Post Data */ /* No Query params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);

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
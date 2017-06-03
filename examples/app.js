/**
 * Demo usage of $solar lib
 */ 
$olar.setBaseUrl(baseUrl)
    .setAuthenticatedEndpoints(authEndpoints)
    .setUnAuthenticatedEndpoints(unAuthEndpoints)
    .setCommonHeaders(commonHeaders)
    .setAuthHeaders(authHeaders)
    .setAuthConfig(authConfig)
    .setUnAuthConfig(unAuthConfig);

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
    (err) => /* Error callback */ console.error(err));

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
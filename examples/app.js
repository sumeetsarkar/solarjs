/**
 * Demo usage of $solar lib
 */ 
$olar.setBaseUrl(baseUrl);
$olar.setAuthenticatedEndpoints(authEndpoints);
$olar.setUnAuthenticatedEndpoints(unAuthEndpoints);
$olar.setCommonHeaders(commonHeaders);
$olar.setAuthHeaders(authHeaders);
$olar.setAuthConfig(authConfig);
$olar.setUnAuthConfig(unAuthConfig);

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
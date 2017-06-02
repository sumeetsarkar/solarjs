/**
 * Demo for using $solar lib
 */ 
$olar.setBaseUrl(baseUrl);
$olar.setAuthenticatedEndpoints(authEndpoints);
$olar.setUnAuthenticatedEndpoints(unAuthEndpoints);
$olar.setCommonHeaders(commonHeaders);
$olar.setAuthHeaders(authHeaders);
$olar.setAuthConfig(authConfig);
$olar.setUnAuthConfig(unAuthConfig);

// Making Authenticated API requests
$olar.executeAuth('api1',
    {}, /* No Post Data */
    {}, /* No Query Params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err));

// Making Authenticated API requests
$olar.executeAuth('api2',
    {   /* Post Data */
        foo: ['bar'],
        baz: null
    }, 
    {}, /* No Query Params */
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err));

// Making Unauthenticated API requests
$olar.executeUnAuth('api3',
    {}, /* No Post Data */
    {   /* Query Params */
        version: 1234
    },
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);

$olar.executeUnAuth('api4',
    {}, /* No Post Data */
    {   /* Query params */
        locale: 'en'
    },
    (data) => /* Success callback */ console.log(data),
    (err) => /* Error callback */ console.error(err)
);
/**
 * A generic configurable library for making XHR requests in web applications
 * Author: Sumeet Sarkar
 */
(function() {
    const lib = {};
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
    let baseUrl = '';
    let authConfig = {
        /**
         *  {
         *      'basePath': 'authpath/my/app/api',
         *  }
         */
    };
    let unAuthConfig = {
        /**
         *  {
         *      'basePath': 'unauthpath/my/app/public',
         *  }
         */
    };
    let authEndpoints = {
        /**
         * 'api1': {
         *      'type': 'GET',
         *      'url': '/auth/a/b/c'
         *  }
         */
    };
    let unAuthEndpoints = {
        /**
         * 'api1': {
         *      'type': 'GET',
         *      'url': '/unauth/a/b/c'
         *  }
         */
    };
    let authHeaders = {
        /**
         * 'X_AUTH_HEADER_KEY' : 'Header Value'
         */
    };
    let commonHeaders = {
        /**
         * 'X_COMMON_HEADER_KEY' : 'Header Value'
         */
    };
    // set base url for all APIs
    lib.setBaseUrl = function(url) {
        baseUrl = url;
    }
    // set config for auth APIs
    lib.setAuthConfig = function(config) {
        authConfig = config;
    }
    // set config for unauth APIs
    lib.setUnAuthConfig = function(config) {
        unAuthConfig = config;
    }
    // set config json for all authenticated APIs
    lib.setAuthenticatedEndpoints = function(endpoints) {
        authEndpoints = endpoints;
    }
    // set config json for all unauthenticated APIs
    lib.setUnAuthenticatedEndpoints = function(endpoints) {
        unAuthEndpoints = endpoints;
    }
    // set headers needed for authenticated APIs
    lib.setAuthHeaders = function(headers) {
        authHeaders = headers;
    }
    // set common headers needed for all APIs
    lib.setCommonHeaders = function(headers) {
        commonHeaders = headers;
    }

    /**
     * Called by execute function to send XHR with final set of params
     * returns 1 if request sent without error
     * @param {*} config - auth/unauth config to set up request url etc.
     * @param {*} headers - auth headers if any
     * @param {*} endpoint - deduced endpoint object (type, url)
     * @param {*} data - post data if any
     * @param {*} params - query params object if any
     * @param {*} successCb - success callback
     * @param {*} errorCb - error callback
     */
    function makeXHR(config, headers, endpoint, data, params, successCb, errorCb) {
        const type = endpoint['type'] ? endpoint.type : 0;
        if (type) {
            switch(type.toLowerCase()) {
                case 'post':
                case 'put':
                    if (!data) break;
                    data = JSON.stringify(data);
                case 'get':
                    const xhr = new XMLHttpRequest();
                    let requestUrl = `${baseUrl}${config.basePath}${endpoint.url}`
                                        .supplant(params);
                    xhr.open(type, requestUrl);
                    for (prop in headers) {
                        xhr.setRequestHeader(prop, headers[prop]);
                    }
                    for (prop in commonHeaders) {
                        xhr.setRequestHeader(prop, commonHeaders[prop]);
                    }
                    xhr.addEventListener("readystatechange", function() {
                        if (this.readyState === 4) {
                            if (this.status == 200)
                                successCb(this.responseText, this.status);
                            else
                                errorCb(this, this.status);
                        }
                    });
                    xhr.send(data);
                    return 1;
            }
        }
        return 0;
    }

    /**
     * Send Auth/ Unauth XHR request
     * returns 1 if request sent without error
     * @param {*} isAuth - true for auth and false for unauth
     * @param {*} api - api key to query from auth/ unauth endpoints collection
     * @param {*} data - post data if any
     * @param {*} params - query params object if any
     * @param {*} successCb - success callback
     * @param {*} errorCb - error callback
     */
    function execute(isAuth, api, data, params, successCb, errorCb) {
        const collection = isAuth ? authEndpoints : unAuthEndpoints;
        const config = isAuth ? authConfig : unAuthConfig;
        const headers = isAuth ? authHeaders : {};
        const endpoint = collection[api] ? collection[api] : 0;
        return endpoint ? makeXHR(config, headers, endpoint, data, params, successCb, errorCb) : 0;
    }

    // curried functions for auth and unauth XHR requests
    lib.executeAuth = execute.bind(this, true);
    lib.executeUnAuth = execute.bind(this, false);

    // console logs all the configs setup for the library
    lib.info = function() {
        console.log(authEndpoints);
        console.log(unAuthEndpoints);
        console.log(authConfig);
        console.log(unAuthConfig);
        console.log(authHeaders);
        console.log(commonHeaders);
    }
    this.$olar = lib;
}());
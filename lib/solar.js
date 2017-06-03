/**
 * A generic configurable library for making XHR requests
 * Author: Sumeet Sarkar
 */
(function() {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
    const global = (typeof window != 'undefined') ? window : this;
    let baseUrl = '',
        authConfig = {
            /**
             *  {
             *      'basePath': 'authpath/my/app/api',
             *      'headers': {
             *          'config-specfic-header' : 'value'
             *      }
             *  }
             */
        },
        unAuthConfig = {
            /**
             *  {
             *      'basePath': 'unauthpath/my/app/public',
             *      'headers': {
             *          'config-specfic-header' : 'value'
             *      }
             *  }
             */
        },
        authEndpoints = {
            /**
             * 'api1': {
             *      'type': 'GET',
             *      'url': '/auth/a/b/c',
             *      'responseType': 'json || blob || text || document || arraybuffer',
             *      'headers': {
             *          'specfic-header' : 'value'
             *      }
             *  }
             */
        },
        unAuthEndpoints = {
            /**
             * 'api1': {
             *      'type': 'GET',
             *      'url': '/unauth/a/b/c'
             *  }
             */
        },
        authHeaders = {
            /**
             * 'X_AUTH_HEADER_KEY' : 'Header Value'
             */
        },
        commonHeaders = {
            /**
             * 'X_COMMON_HEADER_KEY' : 'Header Value'
             */
        };

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
    function makeXHR(config, headers, endpoint, payload, successCb, errorCb) {
        const type = endpoint['type'] ? endpoint.type : 0;
        let data = {};
        // check if endpoint method type is not undefined
        if (type) {
            // switch for method type
            switch(type.toLowerCase()) {
                case 'post':
                case 'put':
                    if (payload && !payload.data) break;
                    data = JSON.stringify(payload.data);
                case 'get':
                    const xhr = new XMLHttpRequest();
                    // add response type or default to json
                    xhr.responseType = endpoint.responseType || 'json';
                    
                    // extract query params
                    const params = payload ? payload.params : {};
                    
                    // form request url
                    const requestUrl = `${baseUrl}${config.basePath}${endpoint.url}`.supplant(params);

                    // open xhr
                    xhr.open(type, requestUrl);
                    
                    // add common headers
                    for (prop in commonHeaders)
                        xhr.setRequestHeader(prop, commonHeaders[prop])

                    // add config specific headers
                    for (prop in (config.headers || {}))
                        xhr.setRequestHeader(prop, config.headers[prop])

                    // add endpoint specific headers
                    for (prop in (endpoint.headers || {}))
                        xhr.setRequestHeader(prop, endpoint.headers[prop])

                    // add endpoint specific payload headers
                    for (prop in (payload ? payload.headers : {} || {}))
                        xhr.setRequestHeader(prop, payload.headers[prop])

                    // add auth headers if any
                    for (prop in headers)
                        xhr.setRequestHeader(prop, headers[prop])

                    // add readystatechange listener to xhr
                    xhr.addEventListener("readystatechange", function() {
                        if (this.readyState === 4) {
                            responseHandler(this, type, successCb, errorCb);
                        }
                    });
                    
                    // xhr send
                    xhr.send(data);
                    return 1;
            }
        }
        return 0;
    }

    function responseHandler(xhr, type, successCb, errorCb) {
        let isSuccess = false;
        switch(type.toLowerCase()) {
            case 'post':
            case 'put': isSuccess = (xhr.status == 200 || 201 || 202); break;
            case 'get': isSuccess = (xhr.status == 200);
        }
        isSuccess ? successCb(xhr.response, xhr.status, xhr) : errorCb(xhr);
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
    function execute(isAuth, api, payload, successCb, errorCb) {
        const collection = isAuth ? authEndpoints : unAuthEndpoints;
        const config = isAuth ? authConfig : unAuthConfig;
        const headers = isAuth ? authHeaders : {};
        const endpoint = collection[api] ? collection[api] : 0;
        return endpoint ? makeXHR(config, headers, endpoint, payload, successCb, errorCb) : 0;
    }

    const lib = {
        // set base url for all APIs
        setBaseUrl : function(url) {
            baseUrl = url;
            return this;
        },

        // set config for auth APIs
        setAuthConfig : function(config) {
            authConfig = config;
            return this;
        },

        // set config for unauth APIs
        setUnAuthConfig : function(config) {
            unAuthConfig = config;
            return this;
        },

        // set config json for all authenticated APIs
        setAuthenticatedEndpoints : function(endpoints) {
            authEndpoints = endpoints;
            return this;
        },

        // set config json for all unauthenticated APIs
        setUnAuthenticatedEndpoints : function(endpoints) {
            unAuthEndpoints = endpoints;
            return this;
        },

        // set headers needed for authenticated APIs
        setAuthHeaders : function(headers) {
            authHeaders = headers;
            return this;
        },

        // set common headers needed for all APIs
        setCommonHeaders : function(headers) {
            commonHeaders = headers;
            return this;
        },

        // curried functions for auth and unauth XHR requests
        executeAuth : execute.bind(this, true),
        executeUnAuth : execute.bind(this, false),

        // console logs all the configs setup for the library
        info : function() {
            console.log(authEndpoints);
            console.log(unAuthEndpoints);
            console.log(authConfig);
            console.log(unAuthConfig);
            console.log(authHeaders);
            console.log(commonHeaders);
        }
    };

    // expose to global property $olar
    global.$olar = lib;

}());
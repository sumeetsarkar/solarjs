/**
 * A generic configurable library for making XHR requests
 * Author: Sumeet Sarkar
 */
(function() {

    const global = (typeof window != 'undefined') ? window : this;
    let baseUrl = '',
        sAuthConfig = {
            /**
             *  {
             *      'basePath': 'authpath/my/app/api',
             *      'headers': {
             *          'config-specfic-header' : 'value'
             *      }
             *  }
             */
        },
        sUnAuthConfig = {
            /**
             *  {
             *      'basePath': 'unauthpath/my/app/public',
             *      'headers': {
             *          'config-specfic-header' : 'value'
             *      }
             *  }
             */
        },
        sAuthEndpoints = {
            /**
             * 'api1': {
             *      'method': 'GET',
             *      'url': '/auth/a/b/c',
             *      'responseType': 'json || blob || text || document || arraybuffer',
             *      'headers': {
             *          'specfic-header' : 'value'
             *      }
             *  }
             */
        },
        sUnAuthEndpoints = {
            /**
             * 'api1': {
             *      'method': 'GET',
             *      'url': '/unauth/a/b/c'
             *  }
             */
        },
        sAuthHeaders = {
            /**
             * 'X_AUTH_HEADER_KEY' : 'Header Value'
             */
        },
        sCommonHeaders = {
            /**
             * 'X_COMMON_HEADER_KEY' : 'Header Value'
             */
        };

    /**
     * Called by execute function to send XHR with final set of params
     * @param {*} payload - post data if any
     * @param {*} successCb - success callback
     * @param {*} errorCb - error callback
     */
    function makeXHR(payload, successCb, errorCb) {
        let data = {};
        // switch for method type
        switch(payload.method.toLowerCase()) {
            case 'post':
            case 'put':
                data = payload.data ? JSON.stringify(payload.data) : data;
            case 'get':
                const xhr = new XMLHttpRequest();
                // add response type or default to json
                xhr.responseType = payload.responseType || 'json';
                
                // extract query params
                const params = payload ? payload.params : {};
                
                // set query params in url
                const url = payload.url.supplant(params);

                // open xhr
                xhr.open(payload.method, url);

                // set headers
                for (let prop in (payload.headers || {}))
                    xhr.setRequestHeader(prop, payload.headers[prop]);
                
                // add readystatechange listener to xhr
                xhr.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        responseHandler(this, payload.method, successCb, errorCb);
                    }
                });
                
                // xhr send
                xhr.send(data);
        }
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
     * @param {*} isAuth - true for auth and false for unauth
     * @param {*} api - api key to query from auth/ unauth endpoints collection
     * @param {*} payload - query params object if any
     * @param {*} successCb - success callback
     * @param {*} errorCb - error callback
     */
    function execute(isAuth, api, payload, successCb, errorCb) {
        const collection = isAuth ? sAuthEndpoints : sUnAuthEndpoints;
        const config = isAuth ? sAuthConfig : sUnAuthConfig;
        const authHeaders = isAuth ? sAuthHeaders : {};
        // check if api exists in Solar collection
        let endpoint = collection[api];
        if (endpoint) {
            // check for baseUrl
            if (!baseUrl) throw 'No base url configured !!!';

            // check for basePath
            const basePath = (config && config.basePath) ?
                                    config.basePath : '';

            // check for responseType, defaults to json
            const responseType = (config && config.responseType) ?
                                    config.responseType : 'json';
            
            // check for endpoint url
            const url = endpoint.url ? endpoint.url : '';
            
            // form request url
            const requestUrl = `${baseUrl}${basePath}${url}`;

            // xhr method, defaults to GET if not found
            const requestMethod = endpoint.method ?
                                    endpoint.method : 'GET';
            
            // form consolidated headers
            const requestHeaders = extend(
                /* empty object */
                {},
                /* add common headers */
                (commonHeaders || {}),
                /* add config specific headers */   
                (config.headers || {}),
                /* add endpoint specific headers */
                (endpoint.headers || {}),
                /* add deduced auth headers */
                (authHeaders || {}),
                /* add payload specific headers */
                /* adding payload headers last to prevent overried duplicates if any */
                (payload.headers || {})
            );
            
            // prepare final payload
            payload.method = requestMethod;
            payload.url = requestUrl;
            payload.headers = requestHeaders;
            payload.responseType = responseType;

            // make XHR request
            makeXHR(payload, successCb, errorCb);
        } else {
            throw `No such API found - ${api} !!!`;
        }
    }

    function extend(parent, ...children) {
        if (parent) {
            (children || []).forEach(item => {
                for (let prop in item) parent[prop] = item[prop];
            })
        }
        return parent;
    }

    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' 
                        || typeof r === 'number' ? r : a;
            }
        );
    };

    const lib = {
        // set base url for all APIs
        setBaseUrl : function(url) {
            baseUrl = url;
            return this;
        },

        // set config for auth APIs
        setAuthConfig : function(config) {
            sAuthConfig = config;
            return this;
        },

        // set config for unauth APIs
        setUnAuthConfig : function(config) {
            sUnAuthConfig = config;
            return this;
        },

        // set config json for all authenticated APIs
        setAuthenticatedEndpoints : function(endpoints) {
            sAuthEndpoints = endpoints;
            return this;
        },

        // set config json for all unauthenticated APIs
        setUnAuthenticatedEndpoints : function(endpoints) {
            sUnAuthEndpoints = endpoints;
            return this;
        },

        // set headers needed for authenticated APIs
        setAuthHeaders : function(headers) {
            sAuthHeaders = headers;
            return this;
        },

        // set common headers needed for all APIs
        setCommonHeaders : function(headers) {
            sCommonHeaders = headers;
            return this;
        },

        /**
         * loads all Solar config at once
         * All configs loaded are added to the lib using function chaining,
         * this is kepy by design, so as to consider config passed as atomic.
         * This ensures all older residual configs if any set by setter functions
         * will be replaced with new values in config if present or set to undefined.
         * @param {*} config - config json
         */
        loadConfig : function(config) {
            if (!config) throw 'Solar config is undefined !!!'
            this.setBaseUrl(config.baseUrl)
                .setAuthenticatedEndpoints(config.authEndpoints)
                .setUnAuthenticatedEndpoints(config.unAuthEndpoints)
                .setCommonHeaders(config.commonHeaders)
                .setAuthHeaders(config.authHeaders)
                .setAuthConfig(config.authConfig)
                .setUnAuthConfig(config.unAuthConfig);
        },

        // curried functions for auth and unauth XHR requests
        executeAuth : execute.bind(this, true),
        executeUnAuth : execute.bind(this, false),

        // console logs all the configs setup for the library
        info : function() {
            console.log('Solar Config ---------------');
            console.log(sAuthEndpoints);
            console.log(sUnAuthEndpoints);
            console.log(sAuthConfig);
            console.log(sUnAuthConfig);
            console.log(sAuthHeaders);
            console.log(sCommonHeaders);
            console.log('----------------------------');
        }
    };

    // expose to global property $olar
    global.$olar = lib;

}());
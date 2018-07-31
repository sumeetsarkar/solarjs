/**
 * A generic configurable library for making XHR requests
 * Author: Sumeet Sarkar
 */
(function (context) {
  const global = (typeof context !== 'undefined') ? context : this;
  let sBaseUrl = '';
  let sAuthConfig = {
    /**
     *  {
     *      'basePath': '/my/app/auth/api',
     *      'headers': {
     *          'AuthConfig-specfic-header' : 'value'
     *      }
     *  }
     */
  };
  let sUnAuthConfig = {
    /**
     *  {
     *      'basePath': '/my/app/public/api',
     *      'headers': {
     *          'UnAuthConfig-specfic-header' : 'value'
     *      }
     *  }
     */
  };
  let sAuthEndpoints = {
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
  };
  let sUnAuthEndpoints = {
    /**
     * 'api1': {
     *      'method': 'GET',
     *      'url': '/unauth/a/b/c',
     *      'responseType': 'json || blob || text || document || arraybuffer',
     *      'headers': {
     *          'specfic-header' : 'value'
     *      }
     *  }
     */
  };
  let sCommonHeaders = {
    /**
     * 'X_COMMON_HEADER_KEY' : 'Header Value'
     */
  };
  let sCustomRequestGroups = {
    /**
     * {
     *  'group1': {
     *     parent: 'unAuth',
     *     config: {
     *          'basePath': '/custom/v1',
     *          'headers': {
     *              'Custom-Group-Header': 'CustomGroupHeaderValue'
     *          }
     *      },
     *      endpoints: {
     *          'status': {
     *              method: 'GET',
     *              url: '/status',
     *              responseType: 'json'
     *          }
     *      }
     * }
     */
  };

  /**
   * extends object properties to parent
   * @param {*} parent - object to which props are added
   * @param {*} children - objects from which parent extends
   * @return {*} parent - with extended properties
   */
  function extend(parent, ...children) {
    if (parent) {
      (children || []).forEach(item => {
        for (let prop in item) {
          if (item.hasOwnProperty(prop)) {
            parent[prop] = item[prop];
          }
        }
      });
    }
    return parent;
  }

  function SolarException(message) {
    this.message = `SolarException: ${message}`;
    this.toString = function () { return this.message; };
  }

  // prototype function inject to replace strings of pattern {key} with passed key
  // TODO: change the String prototype implementation
  String.prototype.inject = function i(item) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
          let c = item[b];
          return typeof c === 'string'
                  || typeof c === 'number' ? c : a;
        }
    );
  };

  /**
   * handles XHR response
   * @param {*} xhr - xhr object
   * @param {*} method - http method type
   * @param {*} successCb - success callback
   * @param {*} errorCb - error callback
   * @return {*} void
   */
  function responseHandler(xhr, method, successCb, errorCb) {
    let isSuccess = false;
    switch (method.toLowerCase()) {
      default: break;
      case 'post':
      case 'put': isSuccess = (xhr.status === 200
          || xhr.status === 201
          || xhr.status === 202);
        break;
      case 'get': isSuccess = (xhr.status === 200);
    }
    isSuccess ?
        (successCb && successCb(xhr.response, xhr.status, xhr))
        : (errorCb && errorCb(xhr));
  }

  /**
   * Called by execute function to send XHR with final set of params
   * @param {*} payload - { method, url, headers, responseType, data, params }
   * @param {*} successCb - success callback
   * @param {*} errorCb - error callback
   * @return {*} void
   */
  function makeXHR(payload, successCb, errorCb) {
    let data = {};
    // switch to method type
    switch (payload.method.toLowerCase()) {
      default: break;
      case 'post':
      case 'put': data = JSON.stringify(payload.data || data); break;
      case 'get': break;
    }
    const xhr = new XMLHttpRequest();
    // add response type or default to json
    xhr.responseType = payload.responseType || 'json';

    // extract query params
    const params = payload.params || {};

    // set query params in url
    const url = payload.url.inject(params);

    // open xhr
    xhr.open(payload.method, url);

    // set headers
    const payloadHeaders = payload.headers || {};
    for (const prop in payloadHeaders) {
      if (payloadHeaders.hasOwnProperty(prop)) {
        xhr.setRequestHeader(prop, payload.headers[prop]);
      }
    }

    // add readystatechange listener to xhr
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        responseHandler(this, payload.method, successCb, errorCb);
      }
    });

    // xhr send
    xhr.send(data);
  }

  /**
   * Prepare final Payload to makeXHR
   * @param {*} config - group (auth, unauth, custom) config
   * @param {*} endpoint - api endpoint object
   * @param {*} payload - { method, url, headers, responseType, data, params }
   * @param {*} successCb - success callback
   * @param {*} errorCb - error callback
   * @return {*} void
   */
  function preparePayload(config = {}, endpoint, payload = {}, successCb, errorCb) {
    // check for sBaseUrl
    if (!sBaseUrl) throw new SolarException('No base url configured !!!');

    // check for basePath
    const basePath = (config.basePath) ? config.basePath : '';

    // check for responseType, defaults to json
    const responseType = (config.responseType) ? config.responseType : 'json';

    // check for endpoint url
    const url = endpoint.url || '';

    // compose request url
    const requestUrl = `${sBaseUrl}${basePath}${url}`;

    // xhr method, defaults to GET if not found
    const requestMethod = endpoint.method || 'GET';
    // compose consolidated headers

    const requestHeaders = extend(
        /* empty object */
        {},
        /* add common headers */
        (sCommonHeaders || {}),
        /* add config specific headers */
        (config.headers || {}),
        /* add endpoint specific headers */
        (endpoint.headers || {}),
        /* add payload specific headers */
        /* adding payload headers last to prevent overried duplicates if any */
        (payload.headers || {}));

    // prepare final payload
    payload.method = requestMethod;
    payload.url = requestUrl;
    payload.headers = requestHeaders;
    payload.responseType = responseType;

    // make XHR request
    makeXHR(payload, successCb, errorCb);
  }

  /**
   * Send Auth/ Unauth XHR request
   * @param {*} isAuth - true for auth and false for unauth
   * @param {*} api - api key to query from auth/ unauth collection
   * @param {*} payload - { headers, responseType, data, params }
   * @param {*} successCb - success callback
   * @param {*} errorCb - error callback
   * @return {*} void
   */
  function execute(isAuth, api, payload, successCb, errorCb) {
    const collection = isAuth ? sAuthEndpoints : sUnAuthEndpoints;
    const config = isAuth ? sAuthConfig : sUnAuthConfig;
    // check if api exists in Solar collections
    const endpoint = collection[api];
    if (!endpoint) throw new SolarException(`No such API found - ${api} !!!`);
    preparePayload(config, endpoint, payload, successCb, errorCb);
  }

  const lib = {
      // set base url for all APIs
    setBaseUrl: function (url) {
      sBaseUrl = url;
      return this;
    },

    // set config for auth APIs
    setAuthConfig: function (config) {
      sAuthConfig = config;
      return this;
    },

    // set config for unauth APIs
    setUnAuthConfig: function (config) {
      sUnAuthConfig = config;
      return this;
    },

    // set config json for all authenticated APIs
    setAuthenticatedEndpoints: function (endpoints) {
      sAuthEndpoints = endpoints;
      return this;
    },

    // set config json for all unauthenticated APIs
    setUnAuthenticatedEndpoints: function (endpoints) {
      sUnAuthEndpoints = endpoints;
      return this;
    },

    // set common headers needed for all APIs
    setCommonHeaders: function (headers) {
      sCommonHeaders = headers;
      return this;
    },

    // TODO: add validator script to verify custom groups JSON sturcture
    setCustomRequestGroups: function (customReqGroups) {
      sCustomRequestGroups = customReqGroups;
      return this;
    },

    // TODO: add validator script to verify individual group JSON
    addCustomRequestGroup: function (name, groupConfig) {
      if (!sCustomRequestGroups) sCustomRequestGroups = {};
      sCustomRequestGroups[name] = groupConfig;
      return this;
    },

    // TODO: work on a way to maintain copy objects
    // to prevent mutation of config by accident while processing
    getCustomRequestGroups: function () {
      // return extend({}, sCustomRequestGroups);
      return sCustomRequestGroups;
    },

    /**
     * loads all Solar config at once
     * All configs loaded are added to the lib using function chaining,
     * this is kepy by design, so as to consider config passed as atomic.
     * This ensures all older residual configs if any set by setter functions
     * will be replaced with new values in config if present or set to undefined.
     * @param {*} config - config json
     * @return {*} void
     */
    loadConfig: function (config) {
      if (!config) throw new SolarException('Solar config is undefined !!!');
      this.setBaseUrl(config.baseUrl)
          .setAuthenticatedEndpoints(config.authEndpoints)
          .setUnAuthenticatedEndpoints(config.unAuthEndpoints)
          .setCommonHeaders(config.commonHeaders)
          .setAuthConfig(config.authConfig)
          .setUnAuthConfig(config.unAuthConfig)
          .setCustomRequestGroups(config.customRequestGroups);
      return this;
    },

      // curried functions for auth and unauth XHR requests
    executeAuth: execute.bind(this, true),
    executeUnAuth: execute.bind(this, false),

    /**
     * Prepare final Payload to makeXHR
     * @param {*} group - group (auth, unauth, custom) config
     * @param {*} api - api name
     * @param {*} payload - { headers, responseType, data, params }
     * @param {*} successCb - success callback
     * @param {*} errorCb - error callback
     * @return {*} void
     */
    executeCustom: function (group, api, payload, successCb, errorCb) {
      const customGroups = this.getCustomRequestGroups();
      if (!group || !api) throw new SolarException('Group or API name cannot be undefined !!!');
      if (!customGroups[group]) throw new SolarException(`No such group - "${group}" in custom request groups !!!`);

      const requestGroup = customGroups[group];
      const endpoints = requestGroup.endpoints;
      if (!endpoints) throw new SolarException(`No endpoints in group - "${group}"`);

      const endpoint = endpoints[api];
      if (!endpoint) throw new SolarException(`No such api "${api}" in  group - "${group}" !!!`);

      // make copy of the group config
      const groupConfig = extend({}, requestGroup.config || {});
      const parent = requestGroup.parent;
      if (parent) {
        let addOnConfig;
        switch (parent.toLowerCase()) {
          default: break;
          case 'auth': addOnConfig = sAuthConfig; break;
          case 'unauth': addOnConfig = sUnAuthConfig; break;
        }
        if (addOnConfig) {
          // prefix parent basePath to the group basePath
          groupConfig.basePath = `${(addOnConfig.basePath || '')}${groupConfig.basePath}`;
          // extend parent headers to the group headers
          groupConfig.headers = extend({}, (addOnConfig.headers || {}), groupConfig.headers);
        }
      }
      preparePayload(groupConfig, endpoint, payload, successCb, errorCb);
    },

    /**
     * @param {*} payload - { method, url, headers, responseType, data, params }
     * @param {*} successCb - success callback
     * @param {*} errorCb - error callback
     * @return {*} void
     */
    request: function (payload, successCb, errorCb) {
      if (!payload) throw new SolarException('Payload cannot be empty !!!');
      if (!payload.method) throw new SolarException('Method cannot be empty !!!');
      if (!payload.url) throw new SolarException('Url cannot be empty !!!');
      makeXHR(payload, successCb, errorCb);
    },

    // console logs all the configs setup for the library
    info: function () {
      console.log('Solar Config ---------------');
      console.log(sBaseUrl);
      console.log(sAuthEndpoints);
      console.log(sAuthEndpoints);
      console.log(sUnAuthEndpoints);
      console.log(sAuthConfig);
      console.log(sUnAuthConfig);
      console.log(sCommonHeaders);
      console.log(sCustomRequestGroups);
      console.log('----------------------------');
    }
  };

  // expose to global property $olar
  global.$olar = lib;
}(window) );

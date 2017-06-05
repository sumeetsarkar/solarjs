const baseUrl = 'http://localhost:9000';

const authEndpoints = {
  'profile': {
    method: 'GET',
    url: '/profile'
  },
  'profile-update': {
    method: 'POST',
    url: '/profile/update',
    headers: {
      'X-Update-Id': '1234'
    }
  }
};

const unAuthEndpoints = {
  'echo': {
    method: 'GET',
    url: '/echo?version={version}&locale={locale}'
  },
  'status': {
    method: 'GET',
    url: '/status',
    responseType: 'json'
  }
};

const commonHeaders = {
  'X-App-Name': 'Demo $olar',
  'X-App-Key': 'myappkey',
  'Content-Type': 'application/json'
};

const authConfig = {
  'basePath': '/api/auth',
  'headers': {
    'X-Auth-User-Code': 'myusercode'
  }
};

const unAuthConfig = {
  'basePath': '/api/app',
  'headers': {
    'Unauth': true
  }
};

const group1 = {
  parent: 'unauth',
  config: {
    'basePath': '/custom/v1',
    'headers': {
      'Custom-Group-Header': 'CustomGroupHeaderValue'
    }
  },
  endpoints: {
    'status': {
      method: 'GET',
      url: '/status',
      responseType: 'json'
    }
  }
};

const group2 = {
  parent: 'auth',
  config: {
    'basePath': '/custom/v2',
    'headers': {
      'Custom-Group-Header-V2': 'CustomGroupHeaderValueV2'
    }
  },
  endpoints: {
    'profile': {
      method: 'GET',
      url: '/profile',
      responseType: 'json'
    }
  }
};

const group3 = {
  config: {
    'basePath': '/custom/v3',
    'headers': {
      'Custom-Group-Header-V3': 'CustomGroupHeaderValueV3'
    }
  },
  endpoints: {
    'status': {
      method: 'GET',
      url: '/status',
      responseType: 'json'
    }
  }
};

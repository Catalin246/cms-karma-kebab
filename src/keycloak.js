import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://keycloak-service-india-dev.apps.inholland.hcs-lab.nl',
  realm: 'karma-kebab-realm',
  clientId: 'karma-kebab-cms',
});

const initKeycloak = () => {
  return new Promise((resolve, reject) => {
    keycloak.init({ 
      onLoad: 'login-required', // Enforce login
      redirectUri: window.location.origin + '/cms', 
      checkLoginIframe: false
    }).then((authenticated) => {
      if (authenticated) {
        resolve(keycloak);
      } else {
        reject('Authentication failed');
      }
    }).catch((error) => {
      reject(error);
    });
  });
};

const login = () => {
  keycloak.login();
};

const logout = () => {
  keycloak.logout();
};

const getToken = () => {
  return keycloak.token;
};

const isAdmin = () => {
  return keycloak.hasRealmRole('admin');
};

export { initKeycloak, login, logout, getToken, isAdmin };

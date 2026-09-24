import { configuration } from '../config/Config';
import { api } from '../config/Services';
import { extendsRequest } from './RequestService';
import axios from 'axios';
import moment from 'moment';
import uuid from 'uuid/v4';

const ID_TOKEN_KEY = configuration.TOKEN_KEY;
const PROFILE_KEY = configuration.PROFILE_KEY;
const TIME_TOKEN = configuration.TIME_KEY;
const PERMISSION_KEY = configuration.PERMISSION_KEY;
const API_TOKEN_KEY = configuration.API_TOKEN_KEY;

export async function login(input, callback) {
    const instance = axios.create();

    let url = api.url.sessionmanagement.authenticate;
    let username = input.username;
    let password = input.password;
    let recaptcha = input.recaptcha;
    let request = {
        identity: {
            "reqtxnid": `${uuid()}`,
            "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
            "appid": "amala",
            "userid": username
        },
        parameter: {
            data: { username, password, recaptcha }
        }
    }

    await instance.post(url, request).then((response) => {
        callback(response);
    });
}

export async function loginNoAuth(input, callback) {
    const instance = axios.create();

    let url = api.url.wso.login;
    let username = input.username;
    let password = input.password;

    let request = {
        identity: {
            "apptxnid": `${uuid()}`,
            "reqtxnid": `${uuid()}`,
            "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
            "appid": "amala",
            "userid": username,
            "seqno": 1
        },
        parameter: {
            data: { username, password }
        }
    }

    await instance.post(url, request).then((response) => {
        callback(response);
    });
}

export function getOptionsCustomIdentity(url, username, criteria = {}, sort = {}, column = []) {
    let request = {
        identity: {
            // "apptxnid" : "amala",
            "reqtxnid": `${uuid()}`,
            "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
            "appid": "amala",
            "userid": username
        },
        paging: { limit: -1, page: 1 },
        parameter: { column, criteria, sort }
    }
    return axios.post(url, request).then((response) => { return response; });
}

export function resetpassword(username, newpassword) {
    let url = api.url.user.resetpassword;
    let request = {
        identity: {
            // "apptxnid" : "amala",
            "reqtxnid": `${uuid()}`,
            "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
            "appid": "amala",
            "userid": username
        },
        parameter: {
            data: { username, newpassword }
        }
    }
    return axios.post(url, request).then((response) => { return response; });
}

export function logout() {
    setExpire();
}

export function requireAuth(nextState, replace) {
    if (!isLoggedIn()) {
        replace({ pathname: '/' });
    }
}

export function getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY);
}

export function clearLocalStorage() {
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(TIME_TOKEN);
    localStorage.removeItem(PERMISSION_KEY);
    localStorage.removeItem(API_TOKEN_KEY);
    localStorage.removeItem("permission");
    window.location.replace('/');
}

export function setIdToken(token) {
    let idToken = token;
    localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
    const idToken = getIdToken();
    return !!idToken;
}

export function setTimeToken() {
    var current_time = Math.floor(Date.now() / 1000);
    localStorage.setItem(TIME_TOKEN, current_time);
}

export function setExpire() {
    const instance = axios.create();
    let url = api.url.sessionmanagement.expire;
    let idToken = localStorage.getItem(ID_TOKEN_KEY);
    let identity = {
        "signature": `${idToken}`,
        "reqtxnid": `${uuid()}`,
        "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
        "appid": "amala",
        "userid": 'admin'
    };
    let request = {
        identity,
        parameter: {}
    }

    if (getAPIToken() !== null) {
        instance.defaults.headers.common['Authorization'] = getAPIToken();
    }

    /* Interceptors for check response and check token refresh */
    instance.interceptors.response.use(async (config) => {
        return config;
    }, (error) => {
        if (error.response) {
            const originalRequest = error.config;
            const { status } = error.response;

            if (status === 401) {
                return new Promise(async function (resolve, reject) {
                    await extendsRequest(resolve, reject, originalRequest);
                });
            }
        }
        return Promise.reject(error);
    });

    instance.post(url, request).then((response) => {
        clearLocalStorage();
    })
}

export function extendSession(minutes) {
    let idToken = localStorage.getItem(ID_TOKEN_KEY);
    let url = '';
    let identity = {
        "signature": `${idToken}`
    };
    let parameter = {
        "minutes": `${minutes}`
    };
    let request = {
        identity,
        parameter
    }
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8",
        },
        body: JSON.stringify(request)
    })
        .then((response) => response.json())
        .then((response) => {
        })
        .catch((error) => {
            console.log('Error fetching and parsing data', error);
        });
}

/* Set Profile */
export function setProfile(profileData, username, detail) {
    profileData.username = username;
    profileData = { ...detail };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
}

/* Get Profile */
export function getProfile() {
    // get profile_key
    let profileKey = localStorage.getItem(PROFILE_KEY);
    let decoded = profileKey ? JSON.parse(profileKey) : false;
    return decoded;
}

/* Set Bearer token API */
export function setAPIToken(token) {
    localStorage.setItem(API_TOKEN_KEY, JSON.stringify(token));
}

/* Get Bearer token API */
export function getAPIToken() {
    // get profile_key
    let chiperApiToken = localStorage.getItem(API_TOKEN_KEY);
    let plainApiToken = chiperApiToken ? JSON.parse(chiperApiToken) : false;

    return 'Bearer ' + plainApiToken;
}

/* Set Role Permission */
export function setPermission(usermenu) {
    localStorage.setItem("permission", JSON.stringify(usermenu));
}

/* Get Role Permission */
export function getPermission() {
    let profileKey = localStorage.getItem("permission");
    let decoded = profileKey ? JSON.parse(profileKey) : false;
    return decoded;
}
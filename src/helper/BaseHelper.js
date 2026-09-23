import { api } from '../config/Services';
import { setAPIToken, getAPIToken, getIdToken, clearLocalStorage, getProfile } from '../utilities/AuthService';
import { configuration } from '../config/Config';
import moment from 'moment';
import axios from 'axios';
import uuid from 'uuid/v4';

const ResponRequestEnum = {
    STATUS_SUCCESS         : "0000"
}

const TypeRequestEnum = {
    REQUEST_GET            : "GET",
    REQUEST_POST           : "POST",
    REQUEST_DELETE         : "DELETE",
    REQUEST_PUT            : "PUT",
    REQUEST_PATCH          : "PATCH"
}

class BaseHelper {
    static url = ""

    static handleResponse = ({ data }, callback) => {
        const {
            responsecode,
            responsemssage
        } = data.status || {};

        let {
            result,
            paging
        } = data;
        
        if (paging) result = {
            data: result,
            paging
        };

        if (callback) callback(responsecode === ResponRequestEnum.STATUS_SUCCESS ? true : false, result, responsemssage);
        else return { status: responsecode === ResponRequestEnum.STATUS_SUCCESS, data: result || data, message: responsemssage}
    }

    static async request(method, url, data, callback) {
        const { identity } = api;
        data.identity = identity;

        const client = axios.create({
            baseURL: url,
            json: true
        });

        let headers = {
            "Content-Type": "application/json"
        }

        const Authorization = getAPIToken();

        if(Authorization) client.defaults.headers.common['Authorization'] = Authorization;

        /* Interceptors for check response and check token refresh */
        client.interceptors.response.use(async (response) => {
            return response;
        }, (error) => {
            const { response, config } = error;
            if (response) {
                const { status } = response;
                if (status === 401) {
                    return new Promise(async function (resolve, reject) {
                        await this.extendsRequest(resolve, reject, config);
                    });
                }
            }
            return Promise.reject(error);
        });

        return client({
                method,
                data,
                headers,
                // timeout: 40000,
                responseType: 'json',
            })
            .then(async (response) => this.handleResponse(response, callback))
            .catch(async error => this.handleResponse({
                data: {
                    status: {
                        responsecode: "0001",
                        responsemssage: error.message,
                    },
                    result: null,
                }
            }, callback));
    }

    static extendsRequest(resolve, reject, originalRequest) {
        const { SESSION_TIME } = configuration;
        let data = {},
            method = TypeRequestEnum.REQUEST_POST,
            headers = {
                "Content-Type": "application/json"
            };
        
        let userid = (getProfile() && getProfile().username) ? getProfile().username : null;
        data = {
            identity: {
                "reqtxnid": `${uuid()}`,
                "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
                "appid": "amala",
                "userid": userid,
                "signature": getIdToken()
            },
            parameter: {
                data: { minutes: SESSION_TIME }
            }
        }

        const client = axios.create({
            baseURL: api.url.sessionmanagement.extend,
            json: true
        });

        return client({
                method,
                data,
                headers,
                // timeout: 40000,
                responseType: 'json',
            })
            .then(async ({ data }) => { 
                const { result, status } = data;
                const {
                    responsecode,
                } = status || {};

                if (responsecode === ResponRequestEnum.STATUS_SUCCESS) {
                    if (result.bearer) {
                        /* Set API Token from WSO */
                        await setAPIToken(result.bearer);
    
                        /* call again last request */
                        originalRequest.headers['Authorization'] = getAPIToken();
                        return this.handleResponse(await resolve(client(originalRequest)));
                    }
                } else {
                    /* Force logout, not call service expire */
                    setTimeout(function () {
                        clearLocalStorage();
                    }, 3000);
                }
            })
            .catch(async error => {
                reject(error);
            });
    }

    static post(url, data, callback) {
        return this.request(TypeRequestEnum.REQUEST_POST, url, data, callback)
    }

    static put(url, data, callback) {
        return this.request(TypeRequestEnum.REQUEST_PUT, url, data, callback)
    }

    static patch(url, data, callback) {
        return this.request(TypeRequestEnum.REQUEST_PATCH, url, data, callback)
    }

    static delete(url, data, callback) {
        return this.request(TypeRequestEnum.REQUEST_DELETE, url, data, callback)
    }

    static get(url, data, callback) {
        return this.request(TypeRequestEnum.REQUEST_GET, url, data, callback)
    }
}

export default BaseHelper;

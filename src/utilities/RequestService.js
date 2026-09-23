import { api } from '../config/Services';
import { setAPIToken, getAPIToken, getIdToken, clearLocalStorage, getProfile } from '../utilities/AuthService';
import { Alert } from '../components/Base/BaseComponent';
import { Modal } from 'antd';
import { configuration } from '../config/Config';
import { ErrorResponseOptions } from './enum/Index';
import moment from 'moment';
import axios from 'axios';
import uuid from 'uuid/v4';

const { confirm } = Modal;
var identity = api.identity;
const SESSION_TIME = configuration.SESSION_TIME;

export function GeneralRequest(url, paging = {}, column = [], criteria = {}, sort = {}, data = {}) {
    var body = { identity, paging, parameter: { column, criteria, sort, data } };
    return BaseRequest('POST', url, body);
}

export function RetrieveRequest(url, criteria = {}, paging = {}, column = [], sort = {}, data = {}) {
    var body = { identity, paging, parameter: { column, criteria, sort, data } };
    return BaseRequest('POST', url, body);
}

export function SaveRequest(url, data = {}, fileData = '') {
    data = { identity, parameter: { data } };
    if (typeof fileData === 'object') {
        //request for upload image
        fileData.append("request", JSON.stringify(data));
        return BaseRequest('POST', url, fileData);
    } else {
        return BaseRequest('POST', url, data);
    }
}

export function DetailRequest(url, data = {}, callback, type, action) {
    let label = (action === 'rating') ? 'rating' : 'reject';
    if (type === 'confirm') {
        confirm({
            title: 'Are you sure to ' + label + ' this data?',
            onOk() {
                data = { identity, parameter: { data } };
                BaseRequest('POST', url, data).then((response) => {
                    callback(response);
                });
            },
            onCancel() { },
        });
    } else {
        data = { identity, parameter: { data } };
        return BaseRequest('POST', url, data);
    }
}

export function DeleteRequest(url, data = {}, callback, active = null, type) {
    let label = '';
    if (active === null) { label = 'delete'; }
    else {
        if (type === 'termination') {
            label = (active) ? 'terminate' : 'reactivate';
        } else {
            label = (active) ? 'deactivate' : 'activate';
        }
    }
    confirm({
        title: 'Are you sure to ' + label + ' this data?',
        onOk() {
            data = { identity, parameter: { data } };
            BaseRequest('POST', url, data).then((response) => {
                callback(response);
            });
        },
        onCancel() { },
    });
}

export function CancelRequest(url, data = {}, callback, title = 'Are you sure ?') {
    confirm({
        title,
        onOk() {
            data = { identity, parameter: { data } };
            BaseRequest('POST', url, data).then((response) => {
                callback(response);
            });
        },
        onCancel() { },
    });
}

export function RequestWithoutAuth(url, data = {}) {
    identity.userid = 'SYSTEM';
    identity.signature = 'Yzhzlx&#tihzm]w~ZBA]h5AE^4D6(fl;[T~*~0i<GMWyB(2P>o46Pt6sF<)zZ';
    data = { identity, parameter: { data } };
    return BaseRequest('POST', url, data);
}

export function extendsRequest(resolve, reject, originalRequest) {
    let instance = axios.create();
    let url = api.url.sessionmanagement.extend;
    let userid = (getProfile() && getProfile().username) ? getProfile().username : null;
    let request = {
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
    instance.post(url, request)
        .then(async (response) => {
            const { result, status } = response.data;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.bearer) {
                    /* Set API Token from WSO */
                    await setAPIToken(result.bearer);

                    /* call again last request */
                    originalRequest.headers['Authorization'] = getAPIToken();
                    await resolve(instance(originalRequest));
                }
            } else {
                const { responsemessage } = status;
                Alert.error(responsemessage);

                /* Force logout, not call service expire */
                setTimeout(function () {
                    clearLocalStorage();
                }, 3000);
            }
        }).catch((err) => {
            reject(err);
        });
}

export function BasicRequest(url, data) {
    const identity = {
        "reqtxnid": `${uuid()}`,
        "reqdate": moment().format("YYYY-MM-DD HH:mm:ss"),
        "appid": "amala",
        "userid": "SYSTEM",
        "signature": `${uuid()}`
    };
    const request = { identity, parameter: { data } };
    return BaseRequest('POST', url, request);
}

function BaseRequest(method, url, data = {}) {
    const instance = axios.create();
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

    if (method !== 'GET') {
        return instance.post(url, data).then((response) => {
            return response.data;
        }).catch(async (error) => {
            /* Handle error message */
            let response = (error.response && error.response) ? error.response : {};
            let responsecode = (response && response.status) ? response.status : null;
            let responsemssage = 'Something went wrong, Please try again';
            /* filter error response message */
            let geterrordetail = ErrorResponseOptions.filter(val => val.code === responsecode);
            responsemssage = (geterrordetail.length > 0 && geterrordetail[0]) ? geterrordetail[0]['message'] : responsemssage;

            response = {
                status: {
                    responsecode: (responsecode) ? responsecode.toString() : null,
                    responsedesc: responsecode + " - " + responsemssage,
                    responsemessage: responsecode + " - " + responsemssage
                }
            };
            return response;
        });
    } else {
        return instance.get(url).then((response) => {
            return response.data;
        });
    }
}
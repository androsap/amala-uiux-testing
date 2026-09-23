import { configuration } from '../config/Config';
import { apiUrls } from './EncodedURLs';
import moment from "moment";
import jwt from 'jwt-simple';
import uuid from 'uuid/v4';


function wrapApi(obj) {
    const cache = new Map();

    return new Proxy(obj, {
        get(target, prop) {
            if (cache.has(prop)) return cache.get(prop);

            const value = target[prop];
            let result;

            if (typeof value === 'string') {
                try {
                    result = atob(value);
                } catch (e) {
                    result = value;
                }
            } else if (value !== null && typeof value === 'object') {
                result = wrapApi(value);
            } else {
                result = value;
            }

            cache.set(prop, result);
            return result;
        }
    });
};

export const api = {
    identity: {
        apptxnid: `${uuid()}`,
        reqtxnid: `${uuid()}`,
        reqdate: moment().format("YYYY-MM-DD HH:mm:ss"),
        appid: "alms-1",
        userid: "member",
        seqno: "1"
    },
    url: wrapApi(apiUrls)
};
import { configuration } from '../config/Config';
import { buildApiUrls } from './ApiURL';
import moment from "moment";
import uuid from 'uuid/v4';

const TOKEN_KEY = configuration.TOKEN_KEY;
const PROFILE_KEY = configuration.PROFILE_KEY;
const profileKey = localStorage.getItem(PROFILE_KEY);
const profile = profileKey ? JSON.parse(profileKey) : {};

/*
 * REACT_APP_API_ENDPOINT kosong => URL API jadi relatif same-origin ("/amala/...",
 * "/api/...", "/lms/..."), sehingga host backend tidak pernah ikut ter-bundle di
 * chunk.js. nginx yang melayani origin ini yang mem-proxy ke API gateway.
 * Kalau di-set (mis. build production lama), URL tetap absolut seperti sebelumnya.
 */
const API_BASE = process.env.REACT_APP_API_ENDPOINT || '';

export const api = {
    identity: {
        apptxnid: `${uuid()}`,
        reqtxnid: `${uuid()}`,
        reqdate: moment().format("YYYY-MM-DD HH:mm:ss"),
        appid: "alms-1",
        userid: profile.username,
        signature: localStorage.getItem(TOKEN_KEY),
        seqno: "1"
    },
    url: buildApiUrls(API_BASE)
};

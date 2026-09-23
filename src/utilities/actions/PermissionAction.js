import { api } from '../../config/Services';
import {
    ROLE_PERMISSION_SET_PERMISSION,
    ROLE_PERMISSION_GET_PERMISSION,
    MIDDLEWARE_PERMISSION_START_API,
    MIDDLEWARE_PERMISSION_END_API,
    MIDDLEWARE_PERMISSION_ACCESS_DENIED,
    MIDDLEWARE_PERMISSION_ERROR_API,
    MIDDLEWARE_PERMISSION_ACCESS,
    ROLE_PERMISSION_CAN
} from "./ActionTypes";

export const permissionApiStart = label => ({
    type: MIDDLEWARE_PERMISSION_START_API,
    payload: label
});

export const permissionApiEnd = label => ({
    type: MIDDLEWARE_PERMISSION_END_API,
    payload: label
});

export const permissionAccessDenied = url => ({
    type: MIDDLEWARE_PERMISSION_ACCESS_DENIED,
    payload: {
        url
    }
});

export const permissionApiError = error => ({
    type: MIDDLEWARE_PERMISSION_ERROR_API,
    error
});

export function loadPermission(rolecode) {
    return getPermissionData(rolecode);
}

export function getPermissionData(rolecode) {
    var identity = api.identity;
    let data = { identity, parameter: { data: { rolecode } } };

    const configuration = {
        url: api.url.role.retrieveroledetail,
        method: "POST",
        data,
        onSuccess: setPermission,
        onFailure: () => console.log("Error occured loading data"),
        label: ROLE_PERMISSION_GET_PERMISSION
    }

    return PermissionMiddlewareActions(configuration);
}

function PermissionMiddlewareActions({
    url = "",
    method = "GET",
    data = {},
    accessToken = null,
    onSuccess = () => { },
    onFailure = () => { },
    label = "",
    headersOverride = null
}) {
    return {
        type: MIDDLEWARE_PERMISSION_ACCESS,
        payload: { url, method, data, accessToken, onSuccess, onFailure, label, headersOverride }
    };
}

export function setPermission(data) {
    return {
        type: ROLE_PERMISSION_SET_PERMISSION,
        payload: data
    };
}

export function can(module, action) {
    return {
        type: ROLE_PERMISSION_CAN,
        payload: { module, action }
    }
}
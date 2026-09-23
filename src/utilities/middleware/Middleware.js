
import axios from "axios";
import { ACCESS_MIDDLEWARE, MIDDLEWARE_PERMISSION_ACCESS } from "../actions/ActionTypes"
import { accessDenied, apiError, apiStart, apiEnd } from "../actions/MiddlewareActions";
import { permissionAccessDenied, permissionApiError, permissionApiStart, permissionApiEnd } from "../actions/PermissionAction";

export const Middleware = ({ dispatch }) => next => action => {
    next(action);

    if (action.type !== ACCESS_MIDDLEWARE) return;

    const { url, data, onSuccess, onFailure, label } = action.payload;

    if (label) { dispatch(apiStart(label)); }

    axios.post(url, data)
        .then(({ data }) => {
            dispatch(onSuccess(data));
        })
        .catch(error => {
            dispatch(apiError(error));
            dispatch(onFailure(error));
            if (error.response && error.response.status === 403) {
                dispatch(accessDenied(window.location.pathname));
            }
        })
        .finally(() => {
            if (label) {
                dispatch(apiEnd(label));
            }
        });
}

export const PermissionMiddleware = ({ dispatch }) => next => action => {
    next(action);

    if (action.type !== MIDDLEWARE_PERMISSION_ACCESS) return;

    const { url, data, onSuccess, onFailure, label } = action.payload;

    if (label) { dispatch(permissionApiStart(label)); }

    axios.post(url, data)
        .then(({ data }) => {
            dispatch(onSuccess(data));
        })
        .catch(error => {
            dispatch(permissionApiError(error));
            dispatch(onFailure(error));
            if (error.response && error.response.status === 403) {
                dispatch(permissionAccessDenied(window.location.pathname));
            }
        })
        .finally(() => {
            if (label) {
                dispatch(permissionApiEnd(label));
            }
        });
}
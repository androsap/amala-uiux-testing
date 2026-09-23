import { ACCESS_MIDDLEWARE } from "./ActionTypes";

import { API_START, API_END, ACCESS_DENIED, API_ERROR } from "./ActionTypes";

export const apiStart = label => ({
  type: API_START,
  payload: label
});

export const apiEnd = label => ({
  type: API_END,
  payload: label
});

export const accessDenied = url => ({
  type: ACCESS_DENIED,
  payload: {
    url
  }
});

export const apiError = error => ({
  type: API_ERROR,
  error
});

function MiddlewareActions({
    url = "",
    method = "GET",
    data = {},
    accessToken = null,
    onSuccess = () => {},
    onFailure = () => {},
    label = "",
    headersOverride = null
  }) {
    return {
      type: ACCESS_MIDDLEWARE,
      payload: {
        url,
        method,
        data,
        accessToken,
        onSuccess,
        onFailure,
        label,
        headersOverride
      }
    };
  }

  export default MiddlewareActions;
import { configuration } from '../config/Config';
import jwt from 'jwt-simple';

const PERMISSION_KEY = configuration.PERMISSION_KEY;

export function setPermission(rolecode) {
    let permission = {};
    // let url = getServices.state.url.role.detail;
    let url = '';
    getServicePermission(url, { rolecode }).then((response) => {
        const { result } = response;
        for (const field in result.rolepermission) {
            permission[result.rolepermission[field]["menuname"]] = {};
            for (const field2 in result.rolepermission[field]["function"]) {
                permission[result.rolepermission[field]["menuname"]][result.rolepermission[field]["function"][field2]["functionname"]] = result.rolepermission[field]["function"][field2]["grant"];
            }
        }
        localStorage.setItem(PERMISSION_KEY, jwt.encode(permission, '&&_0x24410e', 'HS256', true));
        window.location.replace('/');
    });
}

function getServicePermission(url, parameter) {
    // var identity = getServices.state.identity;
    var identity = '';
    var body = {
        identity,
        parameter
    }

    return (fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
        },
        body: JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('Error fetching and parsing data', error);
            window.alert("An error accured : \n" + error);
        }));
}

export function _getUserPermission() {
    // get profile_key
    let permission_key = localStorage.getItem(PERMISSION_KEY);
    // decode
    let permission = (permission_key) ? jwt.decode(permission_key, '&&_0x24410e', false, 'HS256') : {};
    return permission;
}

export function _checkPermission(permissionList, module, action) {
    //default menu is show
    let result = '';
    if (permissionList[module] === undefined || permissionList[module][action] === 0) {
        result = 'hidden';
    }
    result = '';
    return result;
}

export function _checkPermissionMenuGroup(permissionList, module) {
    //default menu group is hidden
    let result = 'hidden';
    //check permission each module
    for (const field in module) {
        if (permissionList[module[field]] !== undefined && permissionList[module[field]]['access']) {
            result = '';
            break;
        }
    }
    result = '';
    return result;
}

import {
    ROLE_PERMISSION_SET_PERMISSION,
    ROLE_PERMISSION_GET_PERMISSION,
    MIDDLEWARE_PERMISSION_START_API,
    MIDDLEWARE_PERMISSION_END_API,
    ROLE_PERMISSION_CAN
} from '../actions/ActionTypes';

const initialState = {
    rolecode: null,
    rolename: null,
    roledescription: null,
    status: null,
    usermenu: {},
    enrollmentaccess: {}
}


export default (state = initialState, action) => {
    const { payload } = action;
    switch (action.type) {
        case ROLE_PERMISSION_SET_PERMISSION:
            return {
                ...state,
                usermenu: (payload.usermenu_final) ? payload.usermenu_final : state.usermenu,
                enrollmentaccess: (payload.enrollmentaccess) ? payload.enrollmentaccess : state.enrollmentaccess,
            }
            // let usermenu_final = {};
            // let responseusermenu = (payload.result !== undefined && payload.result.usermenu !== undefined) ? payload.result.usermenu : [];
            // let responseenrollmembershiplist = (payload.result !== undefined && payload.result.enrollmembershiplist !== undefined) ? payload.result.enrollmembershiplist : [];

            // /* USER MENU MAPPING */
            // var menucode = '';
            // var functioncode = '';
            // var grant = null;
            // for (const group_key in responseusermenu) {
            //     for (const function_key in responseusermenu[group_key]['listmenu']) {
            //         menucode = responseusermenu[group_key]['listmenu'][function_key]['menucode'];
            //         if (usermenu_final[menucode] === undefined) { usermenu_final[menucode] = {}; }

            //         for (const key in responseusermenu[group_key]['listmenu'][function_key]['function']) {
            //             functioncode = responseusermenu[group_key]['listmenu'][function_key]['function'][key]['functioncode'];
            //             grant = responseusermenu[group_key]['listmenu'][function_key]['function'][key]['grant'];
            //             if (usermenu_final[menucode][functioncode] === undefined) { usermenu_final[menucode][functioncode] = null; }
            //             usermenu_final[menucode][functioncode] = grant;
            //         }
            //     }
            // }

            // /* MAPPING ENROLLMENT ACCESS */
            // var enrollmentaccess = {};
            // var membershipid = null;
            // for (const key in responseenrollmembershiplist) {
            //     membershipid = responseenrollmembershiplist[key]['membershipid'];
            //     grant = responseenrollmembershiplist[key]['grant'];
            //     enrollmentaccess["MEMBERSHIP_" + membershipid] = grant;
            // }

            // return {
            //     ...state,
            //     rolecode: (payload.result !== undefined && payload.result.rolecode !== undefined) ? payload.result.rolecode : state.rolecode,
            //     rolename: (payload.result !== undefined && payload.result.rolename !== undefined) ? payload.result.rolename : state.rolename,
            //     roledescription: (payload.result !== undefined && payload.result.roledescription !== undefined) ? payload.result.roledescription : state.roledescription,
            //     status: (payload.result !== undefined && payload.result.status !== undefined) ? payload.result.status : state.status,
            //     usermenu: usermenu_final,
            //     enrollmentaccess
            // }
        case MIDDLEWARE_PERMISSION_START_API:
            if (action.payload === ROLE_PERMISSION_GET_PERMISSION) {
                return {
                    ...state,
                    isLoading: true
                };
            }
            break;
        case MIDDLEWARE_PERMISSION_END_API:
            if (action.payload === ROLE_PERMISSION_GET_PERMISSION) {
                return {
                    ...state,
                    isLoading: false
                };
            }
            break;
        case ROLE_PERMISSION_CAN:
            return true;
        default:
            return state;
    }
}
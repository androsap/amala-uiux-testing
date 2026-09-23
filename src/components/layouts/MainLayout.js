import React, { Suspense, lazy } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { Layout, Spin, Skeleton, Row, Modal } from 'antd';
import { getProfile, isLoggedIn, getPermission, logout } from '../../utilities/AuthService';
import { setPermission } from "../../utilities/actions/PermissionAction";
import axios from 'axios';
import Header from '../Header';
import Error404 from '../../pages/error/Error404';
import Error403 from '../../pages/error/Error403';
import MiniViewRouter from '../../routers/MiniView.router';
import DefaultLayout from './DefaultLayout';
import IdleTimer from 'react-idle-timer';
import CacheBuster from '../../CacheBuster';
import Footer from '../Footer';

import ProfileUpdateOtpRouter from '../../routers/ProfileUpdateOtp.router';
import EmailVerifyRouter from '../../routers/EmailVerify.router';
import NomineeConfirmationRouter from '../../routers/NomineeConfirmation.router';

const { Content } = Layout;
const router = [];


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            timeIdle: false,
            isIdle: false
        }
        this.idleTimer = null;
        this.onIdle = this._onIdle.bind(this);
    }

    componentWillMount() {
        var pathname = this.props.location.pathname;
        var modulename = pathname.split("/")[1];
        let isBOD = (getProfile().rolename === 'BOD');

        if (isLoggedIn() && modulename !== 'activation' && (modulename !== 'mini-view' || modulename !== 'profile-update-otp')) {
            this.setState({ isLoading: true });

            let response = getPermission();
            var usermenu_final = {};
            var menucode = '';
            var functioncode = '';
            var grant = null;
            var responseusermenu = (response && response.usermenu) ? response.usermenu : [];
            for (const group_key in responseusermenu) {
                for (const function_key in responseusermenu[group_key]['listmenu']) {
                    menucode = responseusermenu[group_key]['listmenu'][function_key]['menucode'];
                    if (usermenu_final[menucode] === undefined) { usermenu_final[menucode] = {}; }

                    for (const key in responseusermenu[group_key]['listmenu'][function_key]['function']) {
                        functioncode = responseusermenu[group_key]['listmenu'][function_key]['function'][key]['functioncode'];
                        grant = responseusermenu[group_key]['listmenu'][function_key]['function'][key]['grant'];
                        if (usermenu_final[menucode][functioncode] === undefined) { usermenu_final[menucode][functioncode] = null; }
                        usermenu_final[menucode][functioncode] = grant;
                    }
                }
            }
        }

        /* get data timeIdle from env.json */
        axios.get("/config/env.json").then((response) => {
            const { data } = response;
            if (data) {
                const { timeIdle } = data;
                this.setState({ timeIdle });
            }
        });
    }

    _onIdle(e) {
        this.notificationForceLogout();
    }

    notificationForceLogout() {
        let secondsToGo = 5;
        const modal = Modal.warning({
            title: 'You are idle',
            content: `Your application will log out in ${secondsToGo} seconds.`,
            closable: false
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `Your application will log out in ${secondsToGo} seconds.`,
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
            logout();
        }, secondsToGo * 1000);
    }

    render() {
        const { isLoading } = this.state;
        var pathname = this.props.location.pathname;
        var modulename = pathname.split("/")[1];

        let isBranch = (getProfile().branchcode && getProfile().tickoffid) ? true : false;
        let isBOD = (getProfile().rolename === 'BOD');

        let excludeRoute = ["activation", "announcement", "reset-password-member", "reset-password"];

        return (
            <CacheBuster {...this.props}>
                {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                    if (loading) return null;

                    if (!loading && !isLatestVersion) {
                        refreshCacheAndReload();
                    }

                    if (modulename === 'otp' || modulename === 'profile-verified') {
                        return <ProfileUpdateOtpRouter />
                    } else if (modulename === 'email-verified') {
                        return <EmailVerifyRouter />
                    } else if (modulename === 'nominee') {
                        return <NomineeConfirmationRouter />;
                    } else if (isLoggedIn() && !excludeRoute.includes(modulename)) {
                        const { timeIdle } = this.state;
                        return (
                            <Layout>
                                <Content className='homepage-container'>
                                    <Suspense fallback={
                                        <Row>
                                            <Content className='homepage-content'>
                                                <Skeleton active />
                                            </Content>
                                        </Row>
                                    }>
                                        <Switch>
                                            {
                                                router.map((obj, key) => {
                                                    return (<PrivateRoute {...this.props} key={key} layout={obj.layout} component={obj.component} path={"/" + obj.path} permission={this.props.permission.usermenu} prefixname={obj.prefixname} menucode={obj.menucode} />)
                                                })
                                            }
                                            <Route component={Error404} />
                                        </Switch>
                                    </Suspense>
                                </Content>
                            </Layout>
                        )
                    } else {
                        return ((modulename === 'mini-view') ? <MiniViewRouter /> : <Error404 />);
                    }
                }}
            </CacheBuster>
        )
    }
}

function PrivateRoute({ layout: ManagementLayout, layout: DefaultLayout, component: Component, ...props }) {
    let permission = props.permission;
    let menucode = props.menucode;
    let access = props.prefixname + "_ACCESS";
    return (
        <Route {...props} permission={permission}
            render={props =>
                (permission[menucode] !== undefined) ?
                    (permission[menucode][access]) ?
                        (ManagementLayout) ? <ManagementLayout {...props}><Component {...props} permission={permission} /></ManagementLayout> : <Component {...props} permission={permission} />
                        : <Error403 {...props} /> : null} />);
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
    setPermission: (data) => dispatch(setPermission(data))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
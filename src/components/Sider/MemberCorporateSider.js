import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { connect } from "react-redux";

const { Sider } = Layout;

class App extends React.Component {
    render() {
        const { memberid, permission, location } = this.props;
        let permissionList = permission.usermenu;
        let selectedTab = location.pathname.split('/', 4) ? [location.pathname.split('/')[4]] : ['profile'];

        return (
            <Sider width={200} style={{ background: '#fff' }} breakpoint="lg" collapsedWidth="0">
                <Menu mode="inline" defaultSelectedKeys={selectedTab} style={{ height: '100%' }} >
                    <Menu.Item key="profile" className={_checkPermission(permissionList, 'MBERCORP', 'MBERCORP_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/profile"}>Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="mailing" className={_checkPermission(permissionList, 'MBRMAIL', 'MBRMAIL_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/mailing"}>Mailing</Link>
                    </Menu.Item>
                    {/* <Menu.Item key="account" className={_checkPermission(permissionList, 'MBRACC', 'MBRACC_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/account"}>Account</Link>
                    </Menu.Item> */}
                    <Menu.Item key="tier" className={_checkPermission(permissionList, 'MBRTIER', 'MBRTIER_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/tier"}>Tier</Link>
                    </Menu.Item>
                    <Menu.Item key="transaction" className={_checkPermission(permissionList, 'MBRTRANS', 'MBRTRANS_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/transaction"}>Transaction</Link>
                    </Menu.Item>
                    <Menu.Item key="certificate" className={_checkPermission(permissionList, 'REDEEM', 'REDEEM_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/certificate"}>Certificate</Link>
                    </Menu.Item>
                    <Menu.Item key="receipt" className={_checkPermission(permissionList, 'MBRRECPT', 'MBRRECPT_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/receipt"}>Receipt</Link>
                    </Menu.Item>
                    <Menu.Item key="alias" className={_checkPermission(permissionList, 'MBALIAS', 'MBALIAS_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/alias"}>Alias</Link>
                    </Menu.Item>
                    <Menu.Item key="redemption" className={_checkPermission(permissionList, 'REDEEM', 'REDEEM_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/redemption"}>Redemption</Link>
                    </Menu.Item>
                    <Menu.Item key="notes" className={_checkPermission(permissionList, 'MBNOTES', 'MBNOTES_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/notes"}>Notes</Link>
                    </Menu.Item>
                    <Menu.Item key="tour-code" className={_checkPermission(permissionList, 'MBCOTOUR', 'MBCOTOUR_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/tour-code"}>Tour Code</Link>
                    </Menu.Item>
                    <Menu.Item key="travel-coordinator" className={_checkPermission(permissionList, 'MBCOTRCO', 'MBCOTRCO_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/travel-coordinator"}>Travel Coordinator</Link>
                    </Menu.Item>
                    <Menu.Item key="member-relation" className={_checkPermission(permissionList, 'MBRRELA', 'MBRRELA_ACCESS')}>
                        <Link to={"/member-corporate/form/" + memberid + "/member-relation"}>Member Relation</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}

export function _checkPermission(permissionList, menucode, functioncode) {
    let result = '';
    if (permissionList[menucode] === undefined || (permissionList[menucode] && !permissionList[menucode][functioncode])) {
        result = "hidden";
    }
    return result;
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);
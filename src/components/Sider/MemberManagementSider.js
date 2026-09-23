import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../config/Services';
import { Layout, Menu, Col, Row } from 'antd';
import { connect } from "react-redux";
import { Progression } from '../Base/BaseComponent';

const { Sider } = Layout;
const { SubMenu } = Menu;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: true,
            emptyData: false
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    };

    componentWillUnmount() {
        this.props.onRef(undefined)
    };

    emptyData = () => {
        this.setState({ showProgress: false, emptyData: true })
    };

    showProgress = (key) => {
        this.setState({ showProgress: (key.keyPath[1] === 'sub1') && !this.state.emptyData ? true : false })
    };

    retrieveProgression = () => {
        this.setState({ showProgress: true })
        this.componentProgression.retrieveData();
    };

    render() {
        const { memberid, permission, location } = this.props;
        let permissionList = permission.usermenu;
        let selectedTab = location.pathname.split('/', 4) ? [location.pathname.split('/')[4]] : ['personal-information'];

        const requestProgression = {
            url: api.url.completionbonus.getprogress,
            data: { memberid: this.props.match.params.ID }
        }

        return (
            <Col>
                <Sider width={200} style={{ background: '#fff' }} breakpoint="lg" collapsedWidth="0">
                    <Row type="flex" justify="center" style={{ marginBottom: 15 }} className={this.state.showProgress ? '' : 'hidden'}>
                        <Progression ref={(e) => { this.componentProgression = e }} {...this.props} type='circle' request={requestProgression} startcolor='#108ee9' endcolor='#87d068' emptydata={this.emptyData} />
                    </Row>
                    <Menu mode="inline" defaultSelectedKeys={selectedTab} style={{ height: '100%' }} onClick={this.showProgress} >
                        <SubMenu key="sub1" title="Profile" >
                            <Menu.Item key="personal-information" className={_checkPermission(permissionList, 'MMBRPROF', 'MMBRPROF_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/personal-information"}> Personal Information </Link>
                            </Menu.Item>
                            <Menu.Item key="address" className={_checkPermission(permissionList, 'MMBRADRS', 'MMBRADRS_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/address"}>Address</Link>
                            </Menu.Item>
                            <Menu.Item key="contact" className={_checkPermission(permissionList, 'MMBRCNTC', 'MMBRCNTC_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/contact"}>Contact</Link>
                            </Menu.Item>
                            <Menu.Item key="hobbies" className={_checkPermission(permissionList, 'MMBRHOBI', 'MMBRHOBI_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/hobbies"}>Preferences & Interest</Link>
                            </Menu.Item>
                            <Menu.Item key="mailing" className={_checkPermission(permissionList, 'MBRMAIL', 'MBRMAIL_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/mailing"}>Mailing</Link>
                            </Menu.Item>
                            <Menu.Item key="alias" className={_checkPermission(permissionList, 'MBALIAS', 'MBALIAS_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/alias"}>Alias</Link>
                            </Menu.Item>
                            <Menu.Item key="notes" className={_checkPermission(permissionList, 'MBNOTES', 'MBNOTES_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/notes"}>Notes</Link>
                            </Menu.Item>
                            <Menu.Item key="member-relation" className={_checkPermission(permissionList, 'MBRRELA', 'MBRRELA_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/member-relation"}>Member Relation</Link>
                            </Menu.Item>
                            <Menu.Item key="travel-coordinator" className={_checkPermission(permissionList, 'MBTRAVEL', 'MBTRAVEL_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/travel-coordinator"}>Travel Coordinator</Link>
                            </Menu.Item>
                            <Menu.Item key="reset-password" className={_checkPermission(permissionList, 'MBRESET', 'MBRESET_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/reset-password"}>Reset Password</Link>
                            </Menu.Item>
                            <Menu.Item key="identity" className={_checkPermission(permissionList, 'MMBRIDT', 'MMBRIDT_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/identity"}>Identity Card</Link>
                            </Menu.Item>
                            <Menu.Item key="terminate-reactivate" className={_checkPermission(permissionList, 'MBTERM', 'MBTERM_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/terminate-reactivate"}>Terminate/Reactivate</Link>
                            </Menu.Item>
                        </SubMenu>
                        {/* <Menu.Item key="account" className={_checkPermission(permissionList, 'MBRACC', 'MBRACC_ACCESS')}>
                        <Link to={"/member/form/" + memberid + "/account"}>Account</Link>
                    </Menu.Item> */}
                        <Menu.Item key="tier" className={_checkPermission(permissionList, 'MBRTIER', 'MBRTIER_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/tier"}>Tier</Link>
                        </Menu.Item>
                        <Menu.Item key="card" className={_checkPermission(permissionList, 'MBRCRD', 'MBRCRD_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/card"}>Cards</Link>
                        </Menu.Item>
                        <Menu.Item key="cobrand" className={_checkPermission(permissionList, 'MBRCBRN', 'MBRCBRN_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/cobrand"}>Cobrand</Link>
                        </Menu.Item>
                        <SubMenu key="sub2" title="Activity" >
                            <Menu.Item key="list" className={_checkPermission(permissionList, 'MBRACT', 'MBRACT_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/activity"}>List</Link>
                            </Menu.Item>
                            <Menu.Item key="limit" className={_checkPermission(permissionList, 'ACCLMTNA', 'ACCLMTNA_ACCESS')}>
                                <Link to={"/member/form/" + memberid + "/limit"}>Limit</Link>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="retro-claim" className={_checkPermission(permissionList, 'MBRRETCL', 'MBRRETCL_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/retro-claim"}>Retro Claim</Link>
                        </Menu.Item>
                        <Menu.Item key="transaction" className={_checkPermission(permissionList, 'MBRTRANS', 'MBRTRANS_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/transaction"}>Transaction</Link>
                        </Menu.Item>
                        <Menu.Item key="certificate" className={_checkPermission(permissionList, 'CERTIF', 'CERTIF_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/certificate"}>Certificate</Link>
                        </Menu.Item>
                        {/* <Menu.Item key="certificateotp" className={_checkPermission(permissionList, 'CERTIF', 'CER_ACCESSOTP')}>
                            <Link to={"/member/form/" + memberid + "/certificateotp"}>Certificate with OTP</Link>
                        </Menu.Item> */}
                        <Menu.Item key="receipt" className={_checkPermission(permissionList, 'MBRRECPT', 'MBRRECPT_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/receipt"}>Receipt</Link>
                        </Menu.Item>
                        <Menu.Item key="redemption" className={_checkPermission(permissionList, 'REDEEM', 'REDEEM_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/redemption"}>Redemption</Link>
                        </Menu.Item>
                        <Menu.Item key="redemptionotp" className={_checkPermission(permissionList, 'REDEEMOTP', 'REDOTP_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/redemptionotp"}>Redemption with OTP</Link>
                        </Menu.Item>
                        <Menu.Item key="buy-mileage" className={_checkPermission(permissionList, 'MBBUYMIL', 'MBBUYMIL_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/buy-mileage"}>Buy Mileage</Link>
                        </Menu.Item>
                        <Menu.Item key="mileage-statement" className={_checkPermission(permissionList, 'MMBRMILST', 'MBRMILST_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/mileage-statement"}>Mileage Statement</Link>
                        </Menu.Item>
                        <Menu.Item key="buy-product" className={_checkPermission(permissionList, 'MBRRELA', 'MBRRELA_ACCESS')}>
                            <Link to={"/member/form/" + memberid + "/buy-product"}>Buy Product</Link>
                        </Menu.Item>
                    </Menu >
                </Sider >
            </Col >
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
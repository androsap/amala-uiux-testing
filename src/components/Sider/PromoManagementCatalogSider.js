import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Col } from 'antd';
import { connect } from 'react-redux';

const { Sider } = Layout;

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

    handleSelectMenu = () => {
        window.scrollTo(0, 0);
    };

    render() {
        const { promocode, promotype, permission, location } = this.props;
        let permissionList = permission.usermenu;
        let selectedTab = (location) ? [location.pathname.split('/')[4]] : ['basic-info'];

        return (
            <Col>
                <Sider width={200} style={{ background: '#fff' }} breakpoint='lg' collapsedWidth='0'>
                    <Menu mode='inline' defaultSelectedKeys={selectedTab} style={{ height: '100%' }} onSelect={this.handleSelectMenu}>
                        <Menu.Item key='basic-info' className={_checkPermission(permissionList, 'PRMANCT', 'PRMANCT_ACCESS')}>
                            <Link to={`/promo-manage-catalog/form/${promocode}/basic-info`}>Basic Info</Link>
                        </Menu.Item>
                        <Menu.Item key='member-criteria' className={_checkPermission(permissionList, 'PRMEMCR', 'PRMEMCR_ACCESS')}>
                            <Link to={`/promo-manage-catalog/form/${promocode}/member-criteria`}>Member Criteria</Link>
                        </Menu.Item>
                        {(promotype === 'AIR') ?
                            <Menu.Item key='air-criteria' className={_checkPermission(permissionList, 'PRMACR', 'PRMACR_ACCESS')}>
                                <Link to={`/promo-manage-catalog/form/${promocode}/air-criteria`}>Air Criteria</Link>
                            </Menu.Item> :
                            <Menu.Item key='nonair-criteria' className={_checkPermission(permissionList, 'PRMNACR', 'PRMNACR_ACCESS')}>
                                <Link to={`/promo-manage-catalog/form/${promocode}/nonair-criteria`}>Non Air Criteria</Link>
                            </Menu.Item>
                        }
                        <Menu.Item key='bonus-activity' className={_checkPermission(permissionList, 'PRMNBACC', 'PRMNBACC_ACCESS')}>
                            <Link to={`/promo-manage-catalog/form/${promocode}/bonus-activity`}>Bonus Activity Code</Link>
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
        result = 'hidden';
    }
    return result;
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);
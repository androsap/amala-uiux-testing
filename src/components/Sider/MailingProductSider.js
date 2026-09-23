import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Col } from 'antd';
import { connect } from 'react-redux';

const { Sider } = Layout;

class MailingProductSider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: true,
            emptyData: false
        }
    };

    componentDidMount() {
        this.props.onRef(this)
    };

    handleSelectMenu = () => {
        window.scrollTo(0, 0);
    };

    render() {
        const { mailingproductcode, permission, location } = this.props;
        const permissionList = permission.usermenu;
        const selectedTab = (location) ? [location.pathname.split('/')[4]] : ['basic-info'];

        return (
            <Col>
                <Sider width={200} style={{ background: '#fff' }} breakpoint='lg' collapsedWidth='0'>
                    <Menu mode='inline' defaultSelectedKeys={selectedTab} style={{ height: '100%' }} onSelect={this.handleSelectMenu}>
                        <Menu.Item key='basic-info' className={_checkPermission(permissionList, 'PRMCT', 'PRMCT_UPDATE')}>
                            <Link to={`/mailing-product/form/${mailingproductcode}/basic-info`}>Basic Info</Link>
                        </Menu.Item>
                        <Menu.Item key='air-criteria' className={_checkPermission(permissionList, 'PRMCT', 'PRMCT_UPDATE')}>
                            <Link to={`/mailing-product/form/${mailingproductcode}/price`}>Price</Link>
                        </Menu.Item>
                        <Menu.Item key='bonus-activity' className={_checkPermission(permissionList, 'PRMCT', 'PRMCT_UPDATE')}>
                            <Link to={`/mailing-product/form/${mailingproductcode}/vendor`}>Vendor</Link>
                        </Menu.Item>
                        <Menu.Item key='member-criteria' className={_checkPermission(permissionList, 'PRMCT', 'PRMCT_UPDATE')}>
                            <Link to={`/mailing-product/form/${mailingproductcode}/cancel-update-fee`}>Cancel / Update Fee</Link>
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
export default connect(mapStateToProps)(MailingProductSider);
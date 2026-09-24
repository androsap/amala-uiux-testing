
import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from 'react-redux';
import { DetailRequest } from '../../utilities/RequestService';
import { Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Tabs } from 'antd';

import DetailInformation from './detail_information/Form';
import ConversionConfig from './conversion_config/Form';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            prrulename: null,
            active: false
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
            }
            this.setState({ titlepage, actionspage });
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            } else {
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (prruleid) => {
        this.setState({ isLoading: true });
        DetailRequest(api.url.revenuebased.retrievedetail, { prruleid }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                const { prrulename, status } = result || {};
                this.setState({ prrulename, active: status });
            } else {
                Alert.error(status.responsemessage);
                this.setState({ formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    render() {
        const { usermenu } = this.props.permission;
        const { prrulename, titlepage, actionspage, active } = this.state;

        document.title = titlepage + ' Partner Rule | Loyalty Management System';
        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>{titlepage} {actionspage === 'create' ? `Accrual Rule` : prrulename}</Title>
                    </Col>
                    <Divider />
                </Row>
                <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                    <TabPane tab="Detail Information" key="1">
                        <DetailInformation {...this.props} active={active} />
                    </TabPane>
                    {
                        (actionspage !== 'create' && usermenu["ACCRLRT"]["ACCRLRT_ACCESS"]) ?
                            <TabPane tab="Conversion Configuration" key="2">
                                <ConversionConfig {...this.props} active={active} />
                            </TabPane> : ''
                    }
                </Tabs>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
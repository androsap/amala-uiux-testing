import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Divider, Typography, Tabs, Spin } from 'antd';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import PromoRule from './promo_rule/Form';
import CatalogInfo from './catalog_info/Form';
import Status from './status/Form';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            actionspage: 'create',
            specialfielddisabled: false,
            generalfielddisabled: false,
            formrender: true,
            result: [],
            type: null
        };
        this.handler = this.handler.bind(this);
    }

    handler(type) {
        DetailRequest(api.url.redemptionpromo.catalog.detail, { promocatalogcode: this.props.match.params.ID }).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({ type, result });
            };
        });
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ id, actionspage, specialfielddisabled, generalfielddisabled });
            this.handler();
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ formrender: false });
            }
        }
    }

    render() {
        const { formrender, actionspage, id, specialfielddisabled, generalfielddisabled, result, type } = this.state;
        const status = (type === 'status') ? !result.active : result.active;

        if (formrender) {
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{(actionspage === 'create') ? 'Add New Redemption Promo' : `Edit ${result.catalogname}`}</Title>
                        </Col>
                        {(actionspage === 'create') ? '' : <Text strong>Status: {(status) ? 'Active' : 'Inactive'}</Text>}
                        <Divider />
                    </Row>
                    {(actionspage === 'create') ? <CatalogInfo {...this.props} formrender={formrender} id={id} actionspage={actionspage} specialfielddisabled={specialfielddisabled} generalfielddisabled={generalfielddisabled} /> :
                        <Spin spinning={result.length === 0 ? true : false}>
                            <Tabs tabPosition='left' destroyInactiveTabPane={true}>
                                <TabPane tab='Basic Info' key='basic_info'>
                                    <CatalogInfo {...this.props} formrender={formrender} actionspage={actionspage} promocatalogcode={id} id={id} specialfielddisabled={specialfielddisabled} generalfielddisabled={generalfielddisabled} />
                                </TabPane>
                                <TabPane tab='Promo Rule' key='promo_rule'>
                                    <PromoRule {...this.props} promocatalogcode={id} promotype={result.promotype} id={id} specialfielddisabled={specialfielddisabled} generalfielddisabled={generalfielddisabled} />
                                </TabPane>
                                <TabPane tab='Status' key='status'>
                                    <Status {...this.props} promocatalogcode={id} action={() => this.handler('status')} />
                                </TabPane>
                            </Tabs>
                        </Spin>
                    }
                </Row>
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);
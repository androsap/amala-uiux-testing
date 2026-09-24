import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Tabs } from 'antd';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert } from '../../../components/Base/BaseComponent';

import BasicInfo from './basic_info/Form';
import Variants from './variants/Index';
import Log from './log/Index';

const { TabPane } = Tabs;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                data: {}
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (inventorycode, updateVariant) => {
        let url = api.url.inventorysys.detail;
        this.setState({ isLoading: true });
        DetailRequest(url, { inventorycode }).then((response) => {
            const { status = {}, result } = response || {};
            const { inventorycode, inventoryname, categorycode, totalquantity, notes, ordercode, date, inventoryvariantid, variants } = result || {};
            if (status.responsecode === '0000') {

                let data = { inventorycode, inventoryname, categorycode, totalquantity, notes, ordercode, date, inventoryvariantid, variants };

                if (updateVariant) {
                    data.totalquantity = variants.map((item) => Number(item.quantity)).reduce((prev, curr) => prev + curr, 0);
                    SaveRequest(api.url.inventorysys.update, data).then((response) => {
                        const { status } = response;
                        const { responsecode, responsemessage } = status;
                        if (responsecode !== '0000') {
                            Alert.error(responsemessage);
                        }
                    })
                }
                this.setState({ fieldvalue: { ...this.state.fieldvalue, data }, });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    };

    handleRefresh = (inventorycode) => {
        this.getDetail(inventorycode, true);
    };

    render() {
        const { actionspage, fieldvalue } = this.state;

        return (
            <Row>
                <Tabs tabPosition="left" destroyInactiveTabPane={true} onChange={() => this.getDetail(fieldvalue.data.inventorycode)}>
                    <TabPane tab="Basic Info" key="1">
                        <BasicInfo {...this.props} state={this.state} />
                    </TabPane>
                    {actionspage === 'create' ? null : <TabPane tab="Variant" key="2">
                        <Variants {...this.props} state={this.state} handleRefresh={this.handleRefresh} />
                    </TabPane>}
                    {actionspage === 'create' ? null : <TabPane tab="Stock Logs" key="3">
                        <Log {...this.props} state={this.state} />
                    </TabPane>}
                </Tabs>
            </Row>
        )

    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));

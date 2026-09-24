import React, { Component } from 'react';
import { DeleteRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { ActivityCodeSelect, Alert, Button, PartnerLocationSelect, PartnerSelect, SearchForm, TableBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal, Spin, Divider } from 'antd';
import { jsUcfirst } from '../../../../utilities/Helpers';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: []
        };
    };

    componentDidMount() {
        document.title = 'Accrual Promo Management | Loyalty Management System';
    };

    deleteData(criteriacode) {
        let url = api.url.promomanage.criteria.delete;
        let data = { criteriacode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback);
    };

    handleSearchForm = (previouscriteria) => {
        const criteriavalue = previouscriteria[`${this.props.type}`];
        const name = previouscriteria[`${this.props.type}name`];
        const criteria = {
            criteriavalue,
            name: (name) ? `%${name}%` : null
        };

        this.componentTable.handleSearchForm(criteria);
    };

    handleModal = (visible, data) => {
        this.setState({ visible, data });
        if (!visible) this.componentTable.getList();
    };

    render() {
        const { visible, data } = this.state;
        const { menucode, prefixmenuname, type, promocode } = this.props;
        const configurationSearchForm = (type === 'partner') ? [
            { labeltext: 'Partner Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Partner Name', showDefaultSearch: true },
            { labeltext: 'Partner Code', datafield: `${[type]}`, type: 'exact', placeholder: 'Partner Code', showDefaultSearch: true },
        ] : (type === 'activity_code') ? [
            { labeltext: 'Activity Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Activity Name', showDefaultSearch: true },
            { labeltext: 'Activity Code', datafield: `${[type]}`, type: 'exact', placeholder: 'Activity Code', showDefaultSearch: true },
        ] : [
            { labeltext: 'Partner Location Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Partner Location Name', showDefaultSearch: true },
            { labeltext: 'Partner Location Code', datafield: `${[type]}`, type: 'exact', placeholder: 'Partner Location Code', showDefaultSearch: true },
        ];

        const criteriakey = (type === 'partner') ? 'PARTNER' : (type === 'tier') ? 'TIER' : (type === 'activity_code') ? 'ACTIVITY_CODE' : 'LOCATION_CODE';
        const firstTitle = `${(type === 'partner') ? 'Partner' : (type === 'activity_code') ? 'Activity' : 'Partner Location'} Name`;
        const secondTitle = `${(type === 'partner') ? 'Partner' : (type === 'activity_code') ? 'Activity' : 'Partner Location'} Code`;
        const configurationTable = {
            url: api.url.promomanage.criteria.retrieve,
            criteria: { criteriakey, promocode, promocategorytype: 'NONAIR' },
            columns: [
                {
                    type: 'field', title: firstTitle, dataIndex: 'name', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: secondTitle, dataIndex: 'criteriavalue', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%', align: 'center',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(row.criteriacode)} />
                            </span>
                        )
                    }
                },
                { type: 'field' }
            ]
        };

        return (
            <React.Fragment>
                <Modal centered visible={visible} title={`Add ${jsUcfirst(type, '_')}`} onCancel={() => this.handleModal(false)} footer={null} destroyOnClose={true} width={700}>
                    <FormAdd {...this.props} data={data} ref={(e) => { this.componentAddMembership = e }} onClose={() => this.handleModal(false)} />
                </Modal>

                <Row style={{ marginBottom: 15 }}>
                    <Col xs={23} lg={20}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup {jsUcfirst(type, '_')}</Divider>
                    </Col>
                    <Col xs={1}><span></span></Col>
                    <Col xs={24} lg={3}>
                        <Button htmlType='button' type='primary' style={{ marginTop: 15 }} size='default' label='+ New Setup' onClick={() => this.handleModal(true)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
};

class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actioncode: 'create'
        };
    };

    componentDidMount() { };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { partnerform, activitycodeform, partnerlocationform } = input || {};
                const { type, match } = this.props;

                const promocode = match.params.ID;
                const promocategorytype = 'NONAIR';
                const criteriavaluelist = (type === 'partner') ? [partnerform] : (type === 'activity_code') ? [activitycodeform] : [partnerlocationform];
                const criteriakey = (type === 'partner') ? 'PARTNER' : (type === 'activity_code') ? 'ACTIVITY_CODE' : 'LOCATION_CODE';

                let data = { promocode, promocategorytype, criteriakey, criteriavaluelist };
                let url = api.url.promomanage.criteria.create;
                let message = 'New data has been created';

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                        this.props.onClose();
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                });
            };
        });
    };

    handleInput = async (value) => {
        if (value && (value.length > 0)) {
            const { type } = this.props;

            if (type === 'partner') {
                this.componentPartnerSelect.retrieveData({ partnername: `%${value}%` });
            } else if (type === 'activity_code') {
                this.componentActivitySelect.retrieveData({ activityname: `%${value}%` });
            } else this.componentPartnerLocationSelect.retrieveData({ partnerlocationcode: `%${value}%` });
        } else this.handleData(value);
    };

    handleData = (value) => {
        const { type } = this.props;

        if (!value || (value.length === 0)) {
            if (type === 'partner') {
                this.props.form.resetFields(['partnerform', []]);
                this.componentPartnerSelect.handleResetOptions();
            } else if (type === 'activity_code') {
                this.props.form.resetFields(['activitycodeform', []]);
                this.componentActivitySelect.handleResetOptions();
            } else {
                this.props.form.resetFields(['partnerlocationform', []]);
                this.componentPartnerLocationSelect.handleResetOptions();
            };
        };
    };

    render() {
        const { isLoading } = this.state;
        const { menucode, prefixmenuname, type } = this.props;
        const generalfielddisabled = false;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                {(type === 'partner') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext='Partner' datafield='partnerform' disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : (type === 'activity_code') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <ActivityCodeSelect ref={(e) => { this.componentActivitySelect = e }} labeltext='Activity Code' datafield='activitycodeform' form={this.props.form} disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : <Col className='gutter-row' xs={24} sm={19}>
                                    <PartnerLocationSelect ref={(e) => { this.componentPartnerLocationSelect = e }} labeltext='Partner Location' datafield='partnerlocationform' form={this.props.form} disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col>}
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                                <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='ACCESS'></Button>
                                <Button htmlType='button' type='defaut' label='Back' onClick={this.props.onClose}></Button>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            </React.Fragment >
        );
    };
};

const FormAdd = Form.create()(Add);
const SetupFormIndex = Form.create()(App);
export default SetupFormIndex;

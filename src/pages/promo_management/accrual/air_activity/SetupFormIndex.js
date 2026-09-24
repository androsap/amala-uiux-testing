import React, { Component } from 'react';
import { DeleteRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { AirlineSelect, Alert, Button, SearchForm, TableBase, InputText, UploadDraggerBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal, Spin, Divider } from 'antd';
import { jsUcfirst } from '../../../../utilities/Helpers';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleupload: false,
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

    handleModal = (value, type) => {
        this.setState({ [type]: value })
        if (!value) this.componentTable.getList();
    };

    render() {
        const { visible, visibleupload } = this.state;
        const { menucode, prefixmenuname, type, promocode, upload } = this.props;
        const configurationSearchForm = (type === 'marketing_airline' || type === 'operating_airline') ? [
            { labeltext: 'Airline Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Airline Name', showDefaultSearch: true },
            { labeltext: 'Airline Code', datafield: `${[type]}`, type: 'exact', placeholder: 'Airline Code', showDefaultSearch: true },
        ] : (type === 'marketing_booking_class' || type === 'operating_booking_class') ? [
            { labeltext: 'Booking Class', datafield: `${[type]}`, type: 'text', placeholder: 'Booking Class', showDefaultSearch: true },
        ] : [
            { labeltext: 'Tour Code', datafield: `${[type]}`, type: 'text', placeholder: 'Tour Code', showDefaultSearch: true },
        ];

        const firstTitle = (type === 'marketing_airline' || type === 'operating_airline') ? 'Airline Code' : (type === 'marketing_booking_class' || type === 'operating_booking_class') ? 'Booking Class' : (type === 'tour_code') ? 'Tour Code' : 'Flight Number';
        const criteriakey = (type === 'marketing_airline') ? 'MARKETING_AIRLINE' : (type === 'operating_airline') ? 'OPERATING_AIRLINE' :
            (type === 'marketing_flight_number') ? 'MARKETING_FLT_NUM' : (type === 'operating_flight_number') ? 'OPERATING_FLT_NUM' :
                (type === 'marketing_booking_class') ? 'MARKETING_BC' : (type === 'operating_booking_class') ? 'OPERATING_BC' : 'TOUR_CODE';

        let configurationTable = {
            url: api.url.promomanage.criteria.retrieve,
            criteria: { criteriakey, promocode, promocategorytype: 'AIR' },
            columns: [
                {
                    type: 'field', title: 'Airline Name', dataIndex: 'name', sorter: true, key: 'airline',
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'field', title: firstTitle, dataIndex: 'criteriavalue', sorter: true,
                    render: (value) => { return (value) ? (value) : '-' }
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

        if (type !== 'marketing_airline' && type !== 'operating_airline') configurationTable = { ...configurationTable, columns: configurationTable.columns.filter(obj => obj.key !== 'airline') };

        return (
            <React.Fragment>
                <Modal centered visible={visible || visibleupload} title={`${(visible) ? 'Add' : 'Upload'} ${jsUcfirst(type, '_')}`} onCancel={() => this.handleModal(false, (visible) ? 'visible' : 'visibleupload')} footer={null} destroyOnClose={true} width={700}>
                    <FormAdd {...this.props} visibleupload={visibleupload} onClose={() => this.handleModal(false, (visible) ? 'visible' : 'visibleupload')} />
                </Modal>

                <Row style={{ marginBottom: 15 }}>
                    <Col xs={23} lg={(upload) ? 16 : 20}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup {jsUcfirst(type, '_')}</Divider>
                    </Col>
                    <Col xs={1}><span></span></Col>
                    <Col xs={24} lg={(upload) ? 7 : 3}>
                        <Button htmlType='button' type='primary' style={{ marginTop: 15 }} size='default' label='+ New Setup' onClick={() => this.handleModal(true, 'visible')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                        {(upload) ?
                            <Button htmlType='button' type='primary' style={{ marginTop: 15, marginBottom: 15 }} size='default' label='New with Upload' icon='upload' onClick={() => this.handleModal(true, 'visibleupload')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' /> : null
                        }
                    </Col>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
}

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
                const { criteriavalueform } = input || {};
                const { type, match } = this.props;

                const promocode = match.params.ID;
                const promocategorytype = 'AIR';
                const criteriavaluelist = [criteriavalueform];
                const criteriakey = (type === 'marketing_airline') ? 'MARKETING_AIRLINE' : (type === 'operating_airline') ? 'OPERATING_AIRLINE' :
                    (type === 'marketing_flight_number') ? 'MARKETING_FLT_NUM' : (type === 'operating_flight_number') ? 'OPERATING_FLT_NUM' :
                        (type === 'marketing_booking_class') ? 'MARKETING_BC' : (type === 'operating_booking_class') ? 'OPERATING_BC' : 'TOUR_CODE';

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
                })
            };
        });
    };

    saveUploadAction = (e) => {
        e.preventDefault();
        const fileupload = this.props.form.getFieldValue('specificcardnumber');

        this.setState({ isLoading: true });
        if (fileupload.length !== 0) {

            let dataList = {
                filename: fileupload[0]['name'],
                promocategorytype: 'AIR',
                criteriatype: (this.props.type === 'marketing_flight_number') ? 'MARKETING_FLT_NUM' : 'OPERATING_FLT_NUM',
                promocode: this.props.match.params.ID
            }
            let message = 'New data has been created';
            let url = api.url.promomanage.upload;

            var fileRequest = new FormData();
            var file = fileupload[0]['originFileObj'];
            fileRequest.append('file', file);

            SaveRequest(url, dataList, fileRequest).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode === '0000') {
                    Alert.success((responsemessage) ? responsemessage : message);
                    this.props.onClose();
                } else Alert.error(responsemessage);
            });
        } else {
            this.setState({ isLoading: false });
            Alert.error('Please upload file to process it')
        };
    };

    handleInput = async (value) => {
        if (value && (value.length > 0)) {
            this.componentAirlineSelect.retrieveData({ airlinename: `%${value}%` });
        } else this.handleData(value);
    };

    handleData = (value) => {
        if (!value || (value.length === 0)) {
            this.props.form.resetFields(['criteriavalueform', []]);
            this.componentAirlineSelect.handleResetOptions();
        }
    };

    render() {
        const { isLoading } = this.state;
        const { menucode, prefixmenuname, type, visibleupload } = this.props;
        const generalfielddisabled = false
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: (visibleupload) ? 24 : 14 } }
        };

        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={(visibleupload) ? this.saveUploadAction : this.saveAction}>
                            <Row gutter={24}>
                                {((type === 'marketing_airline') || (type === 'operating_airline')) ? <Col className='gutter-row' xs={24} sm={19}>
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext={'Airline Code'} datafield='criteriavalueform' disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : ((type === 'marketing_booking_class') || (type === 'operating_booking_class')) ? <Col className='gutter-row' xs={24} sm={19}>
                                    <InputText labeltext={`${(type === 'marketing_booking_class') ? 'Marketing' : 'Operating'} Booking Class`} datafield='criteriavalueform' form={this.props.form} maxLength={45} disabled={generalfielddisabled} />
                                </Col> : (!visibleupload) ? <Col className='gutter-row' xs={24} sm={19}>
                                    <InputText labeltext={jsUcfirst(type, '_')} datafield='criteriavalueform' form={this.props.form} maxLength={45} disabled={generalfielddisabled} />
                                </Col> : null}
                                {(visibleupload) ?
                                    <UploadDraggerBase form={this.props.form} accept={'.csv'} datafield='specificcardnumber' disabled={generalfielddisabled} /> : null
                                }
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
}

const FormAdd = Form.create()(Add);
const SetupFormGeneral = Form.create()(App);
export default SetupFormGeneral;

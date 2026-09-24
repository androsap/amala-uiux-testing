import React, { Component } from 'react';
import { DeleteRequest, SaveRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { AirportSelect, Alert, Button, OriDesSelect, SearchForm } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal, Spin, Table, Divider } from 'antd';

const { Column } = Table;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            visible: false,
            visibleupload: false,
        };
    };

    componentDidMount() {
        document.title = 'Accrual Promo Management | Loyalty Management System';
        this.getDetail();
    };

    getDetail = async (criteria) => {
        const { promocode } = this.props;
        const criteriakey = ['ORIGIN', 'DESTINATION', 'OD'];
        let dataList = [];

        await Promise.all(criteriakey.map((val) => {
            criteria = { ...criteria, promocode, criteriakey: val, promocategorytype: 'AIR' }
            return RetrieveRequest(api.url.promomanage.criteria.retrieve, criteria).then((response) => {
                const { status, result } = response;
                if (status.responsecode === '0000') {
                    if (result.length !== 0) {
                        dataList = dataList.concat(result);
                    }
                } else Alert.error(status.responsemessage);
            });
        }));
        await this.setState({ dataList });
    };

    deleteData(criteriacode) {
        let url = api.url.promomanage.criteria.delete;
        let data = { criteriacode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.getDetail();
        };
        DeleteRequest(url, data, callback);
    };

    handleSearchForm = (previouscriteria) => {
        let origin = (previouscriteria.origin) ? (previouscriteria.origin) : undefined;
        let destination = (previouscriteria.destination) ? (previouscriteria.destination) : undefined;

        let criteriavalue = (origin && !destination) ? `%${origin}%` : (!origin && destination) ? `%${destination}%` : (origin && destination) ? `${origin}-${destination}` : '';
        let criteria = { criteriavalue };

        this.getDetail(criteria);
    };

    handleModal = (value, type) => {
        this.setState({ [type]: value })
        if (!value) this.getDetail();
    };

    render() {
        const { visible } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: 'Origin', datafield: 'origin', type: 'component', component: AirportSelect, placeholder: 'Origin', showDefaultSearch: true },
            { labeltext: 'Destination', datafield: 'destination', type: 'component', component: AirportSelect, placeholder: 'Destination', showDefaultSearch: true },
        ]

        let number = 0;
        let dataList = this.state.dataList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

        return (
            <React.Fragment>
                <Modal centered visible={visible} title={'Add'} onCancel={() => this.handleModal(false, 'visible')} footer={null} destroyOnClose={true} width={700}>
                    <FormAdd {...this.props} onClose={() => this.handleModal(false, 'visible')} />
                </Modal>

                <Row style={{ marginBottom: 15 }}>
                    <Col xs={23} lg={20}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Origin Destination</Divider>
                    </Col>
                    <Col xs={1}><span></span></Col>
                    <Col xs={24} lg={3}>
                        <Button htmlType='button' type='primary' style={{ marginTop: 15 }} size='default' label='+ New Setup' onClick={() => this.handleModal(true, 'visible')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <Table rowKey={record => record.criteriacode} dataSource={dataList} size='middle' pagination={true} onChange={this.handleTableChange}>
                    <Column title='No' dataIndex='number' key='number' width={'10%'} />
                    <Column title='Origin' dataIndex='origin' key='origin' width={'35%'}
                        render={(text, record) => {
                            if (record.criteriakey === 'ORIGIN') {
                                return record.criteriavalue
                            } else if (record.criteriakey === 'OD') {
                                return record.criteriavalue.split('-')[0]
                            } else return '-'
                        }} />
                    <Column title='Destination' dataIndex='destination' key='destination' width={'35%'}
                        render={(text, record) => {
                            if (record.criteriakey === 'DESTINATION') {
                                return record.criteriavalue
                            } else if (record.criteriakey === 'OD') {
                                return record.criteriavalue.split('-')[1]
                            } else return '-'
                        }} />
                    <Column title='Action'
                        align='center'
                        width={'20%'}
                        key='action'
                        render={(text, record) => (
                            <span>
                                <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(record.criteriacode)} />
                            </span>
                        )} />
                </Table>
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

    componentDidMount() {
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.componentOriDesSelect.retrieveData();
            this.setState({ isLoading: false });
        }, 1000);
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { formorigin, formdestination } = input || {};
                const { match } = this.props;

                const promocode = match.params.ID;
                const promocategorytype = 'AIR';
                const criteriavaluelist = ((formorigin && !formdestination) ? [formorigin] : (!formorigin && formdestination) ? [formdestination] : [`${formorigin}-${formdestination}`]);
                const criteriakey = ((formorigin && !formdestination) ? 'ORIGIN' : (!formorigin && formdestination) ? 'DESTINATION' : 'OD');

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
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const generalfielddisabled = false
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
                                <Col className='gutter-row' xs={24} sm={19}>
                                    <OriDesSelect ref={(e) => { this.componentOriDesSelect = e }} labeltext={['Origin', 'Destination']} datafield={['formorigin', 'formdestination']} form={this.props.form} disabled={generalfielddisabled} />
                                </Col>
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
const SetupFormIndex = Form.create()(App);
export default SetupFormIndex;

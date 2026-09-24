import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, SearchForm, Alert, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Layout } from 'antd';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';

import DetailSuspectDuplicate from './Details';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            visible: false,
            dataChecks: {}
        }
    };

    componentDidMount() {
        document.title = 'Suspect Duplicate Verification | Loyalty Management System';
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleCancel = () => {
        this.setState({ visible: false, visibleDetail: false ,visibleDetails: false });
    };

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleDetailModals = (dataChecks) => {
        this.setState({ visible: true, dataChecks });
    };


    render() {
        const { visible, dataChecks } = this.state;
        const configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true, normalSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: 'Tier', datafield: 'tierid', type: 'component', placeholder: 'Tier', showDefaultSearch: false, component: TierSelect },
            { labeltext: 'Full Name', datafield: 'name', type: 'text', placeholder: 'Full Name', showDefaultSearch: true },
            { labeltext: 'Date of Birth', datafield: 'dateofbirth', type: 'datepicker', placeholder: 'Date of Birth', showDefaultSearch: false },
            { labeltext: 'Email', datafield: 'email', type: 'text', placeholder: 'Email', showDefaultSearch: true },
            { labeltext: 'Enroll Start Period', datafield: 'enrolldatestart', type: 'datepicker', placeholder: 'Enroll Start Period', showDefaultSearch: true },
            { labeltext: 'Enroll End Period', datafield: 'enrolldateend', type: 'datepicker', placeholder: 'Enroll End Period', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.member.list,
            criteria: { memberstatus: 'SUSPECTDUPLICATE' },
            sort: { updateddate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true, width: '10%',
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true, width: '10%',
                    render: (value, row, index) => { return (row.membershipname && value) ? row.membershipname.substring(0, 3) + ' - ' + value : '-' }
                },
                {
                    type: 'html', title: 'Full Name', dataIndex: 'name', sorter: false,
                    render: (value, row, index) => { return value ? value.length > 30 ? value.substring(0, 30) + '...' : value : null }
                },
                {
                    type: 'html', title: 'Date of Birth', dataIndex: 'dateofbirth', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Gender', dataIndex: 'gender', sorter: true },
                { type: 'field', title: 'Email', dataIndex: 'email', sorter: true },
                {
                    type: 'html', title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' type='default' size='small' icon='eye' title='Detail' onClick={() => this.handleDetailModals(row)} />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Modal title='Member Suspect Duplicate Verification' visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={1200} style={{ top: 20 }} >
                    <Layout>
                        <Layout.Content style={{ padding: '0 24px 24px 24px', background: '#fff' }}>
                            <DetailSuspectDuplicate {...this.props} result={dataChecks} closemodalrefresh={this.handleOk} />
                        </Layout.Content>
                    </Layout>
                </Modal>
                <Row>
                    <Col xs={24} xl={24}>
                        <Title level={3}>Suspect Duplicate Verification</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} showAdvanceSearch={true}/>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export class TierSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData(criteria = {}) {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let url = api.url.tier.list;
        let column = [];
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var options = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershipname.substring(0, 3) + ' - ' + obj.tiername;
                    result2['value'] = obj.tierid;
                    return result2;
                });

                this.setState({ options, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        return (<SelectBase {...this.props} options={this.state.options} isLoading={this.state.isLoading} />)
    }
}

export default Form.create()(App);
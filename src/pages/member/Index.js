import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest, DetailRequest, RequestWithoutAuth } from '../../utilities/RequestService';
import { Button, SearchForm, Alert, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Button as AntButton, Tooltip } from 'antd';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';
import { getProfile } from '../../utilities/AuthService';

const { Title, Paragraph } = Typography;

const isBOD = getProfile().rolename === 'BOD';

// const optionsStatus = [
//     { value: 'ACTIVE', label: 'ACTIVE' },
//     { value: 'INACTIVEEMAIL', label: 'INACTIVE EMAIL' },
//     { value: 'GRACEPERIOD', label: 'GRACE PERIOD' },
//     { value: 'MERGED', label: 'MERGED' },
//     { value: 'DECEASED', label: 'DECEASED' },
//     { value: 'TEST', label: 'TEST' },
//     { value: 'SUSPECTEDFRAUD', label: 'SUSPECTED FRAUD' },
//     { value: 'FRAUD', label: 'FRAUD' },
//     { value: 'TERMINATED', label: 'TERMINATED' },
//     { value: 'SUSPECTDUPLICATE', label: 'SUSPECT DUPLICATE' },
//     { value: 'DUPLICATE', label: 'DUPLICATE' }
// ];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false
        }

        this.componentTable = [];
    }
    componentDidMount() {
        document.title = "Manage Member | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching });
            }
        })
    }

    handleResendEmail = (email) => {
        let url = api.url.activation.resendemail;
        let data = { email };

        DetailRequest(url, data).then((response) => {
            let { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                Alert.success(responsemessage);
            } else {
                Alert.error(responsemessage);
            }

            this.componentTable.getList();
        });
    }

    handleActivation = (email) => {
        let url = api.url.activation.generatekey;
        let data = { email };
        DetailRequest(url, data).then((response) => {
            let { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let key = response.result.key;
                let url = api.url.activation.activation;
                let data = { key };
                RequestWithoutAuth(url, data).then((response) => {
                    let { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        Alert.success(responsemessage);
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.componentTable.getList();
                });
            } else {
                Alert.error(responsemessage);
            }
        });
    }

    render() {
        const { searching } = this.state;
        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'exact', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number', 'min.9'] },
            { labeltext: "Full Name", datafield: "name", type: 'text', placeholder: 'Full Name', showDefaultSearch: (window.innerWidth > 767), validationrules: ['min.3'] },
            // { labeltext: "Date of Birth", datafield: "dateofbirth", type: 'datepicker', placeholder: 'Date of Birth', showDefaultSearch: (window.innerWidth > 767) },
            { labeltext: "Email", datafield: "email", type: 'exact', placeholder: 'Email', showDefaultSearch: (window.innerWidth > 767), validationrules: ['pattern.email'] }

            // { labeltext: "Status", datafield: "memberstatus", type: 'select', placeholder: 'Status', showDefaultSearch: false, options: optionsStatus },
            // filter tier tidak bisa diaplikasikan karena value pada tabel merupakan gabungan dari TierID + TierName
            // { labeltext: "Tier", datafield: "tierid", type: 'component', placeholder: 'Tier', showDefaultSearch: true, component: TierSelect },
        ];
        const configurationTable = {
            url: api.url.member.list,
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true,
                    render: (value, row) => { return row.membershipname ? row.membershipname.substring(0, 3) + " - " + value : value }
                },
                {
                    type: 'html', title: 'Full Name', dataIndex: 'name', sorter: false,
                    render: (value) => { return value ? value.length > 30 ? value.substring(0, 30) + '...' : value : null }
                },
                {
                    type: 'html', title: 'Date of Birth', dataIndex: 'dateofbirth', sorter: true, className: { hidden: isBOD },
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Gender', dataIndex: 'gender', sorter: true, className: { hidden: isBOD } },
                {
                    type: 'field', title: 'Email', dataIndex: 'email', sorter: true,
                    render: (value) => { return (value.length < 26) ? value : <Tooltip title={<Paragraph copyable style={{ color: '#ffffff' }}>{value}</Paragraph>}>{value.substring(0, 25) + '...'}</Tooltip> }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'memberstatus', sorter: false, className: { hidden: isBOD },
                    render: (value) => { return (value) ? value.toUpperCase() : '' }
                },
                {
                    type: 'html', title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: true, className: { hidden: isBOD },
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: isBOD ? 'auto' : 115,
                    render: (_value, row) => {
                        return (
                            <Row>
                                <AntButton type="primary" size="small" icon="mail" title="Resend Email" className={(row.memberstatus.toUpperCase() === 'ACTIVE') ? 'btn-custom-info hidden' : 'btn-custom-info'} onClick={() => this.handleResendEmail(row.email)} />
                                <AntButton type="primary" size="small" icon="file-done" title="Activation" className={(row.memberstatus.toUpperCase() === 'ACTIVE') ? 'hidden' : ''} onClick={() => this.handleActivation(row.email)} />
                                <Button url={'/member/form/' + row.memberid} size="small" title="View" icon="eye" />
                            </Row>
                        )
                    }
                },
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Manage Member</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm form={this.props.form} showAdvanceSearch={(window.innerWidth < 768)} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find a Member</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
                </Layout.Content>
            </Layout>
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
                    result2['label'] = obj.membershipname.substring(0, 3) + " - " + obj.tiername;
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

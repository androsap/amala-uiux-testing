import React from 'react';
import { api } from '../../../config/Services';
import { SaveRequest } from '../../../utilities/RequestService';
import { SearchForm, TableBase, ReceiptCatalogueSelect, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        document.title = "Member Receipt | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleActions = async (receiptnumber, action) => {
        let url = (action === 'send') ? api.url.memberreceipt.send : api.url.memberreceipt.download;
        let custommessage = (action === 'send') ? 'Email sent' : 'Downloading file...';
        let data = { receiptnumber };
        //show loader
        await this.setState({ isLoading: true });
        SaveRequest(url, data).then(async (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                if (action === 'download') window.location.href = response.result.path;

                let message = (responsemessage) ? responsemessage : custommessage;
                Alert.success(message);

                await this.componentTable.getList();
            } else {
                Alert.error(responsemessage);
            }
            //hide loader
            await this.setState({ isLoading: false });
        })
    }

    render() {
        const { isLoading } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.memberreceipt.list,
            criteria: { memberid },
            sort: { issuedate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Receipt Number', dataIndex: 'receiptnumber', sorter: true, render: (value, { buymileage, cataloguetype }) => {
                        return (value) ? ((buymileage && buymileage.memberbuymileageid && cataloguetype) ? <a href={`/member/form/${memberid}/buy-mileage/form${(cataloguetype === 'MILEAGE_EXPIRY') ? `-expired-buy` : ``}/${buymileage.memberbuymileageid}`}>{value}</a> : value) : '-'
                    }
                },
                {
                    type: 'field', title: 'Receipt Type Name', dataIndex: 'receipttypename', sorter: true,
                    render: (value) => { return (value) ? (value === 'BUY EXPIRED MILEAGE') ? 'Buy to Extend Mileage' : (value === 'BUY AWARD MILES') ? 'Buy Mileage' : value : '' }
                },
                { type: 'field', title: 'Currency Code', dataIndex: 'currencycode', sorter: true },
                { type: 'field', title: 'Amount', dataIndex: 'amount', sorter: true },
                { type: 'field', title: 'Email', dataIndex: 'emailaddress', sorter: true },
                {
                    type: 'html', title: 'Issue Date', dataIndex: 'issuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" icon="mail" title="Send Email" type="primary" onClick={() => this.handleActions(row.receiptnumber, 'send')} />
                                <Button htmlType="button" size="small" icon="download" title="Download" type="default" onClick={() => this.handleActions(row.receiptnumber, 'download')} />
                            </span>
                        )
                    }
                }
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Receipt Number", datafield: "receiptnumber", type: 'text', placeholder: 'Receipt Number', showDefaultSearch: true },
            { labeltext: "Receipt Type Name", datafield: "receipttypename", type: 'component', placeholder: 'Receipt Type Name', showDefaultSearch: true, component: ReceiptCatalogueSelect, valueFrom: 'receipttypename' },
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>Manage Member Receipt</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
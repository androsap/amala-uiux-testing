import React from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button, Alert, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';

const { Title, Text } = Typography;
const { confirm } = Modal;

const optionsReportType = [
    { value: 'airaccrual', label: 'Air Accrual' },
    { value: 'airaward', label: 'Air Award' },
    { value: 'nonairaccrual', label: 'Non Air Accrual' },
    { value: 'nonairaward', label: 'Non Air Award' },
    { value: 'redeposit', label: 'Redeposit' },
    { value: 'customtransaction', label: 'Custom Transaction' },
    { value: 'memberprofile', label: 'Member Profile' },
    { value: 'redeposit', label: 'Redeposit' },
    { value: 'memberterminate', label: 'Terminate Member' },
    { value: 'buymileage', label: 'Buy Mileage' },
    { value: 'cobrandfasttrack', label: 'Cobrand Fast Track' },
    { value: 'earningcobrand', label: 'Earning Cobrand' },
    { value: 'cobrandsummary', label: 'Cobrand Summary' },
    { value: 'cobrandmember', label: 'Cobrand Member' },
];

const optionsType = [
    { value: 'daily', label: 'Daily' },
    { value: 'historical', label: 'Historical' }
];
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            visible: false,
            idreport: undefined,
            criteria: {},
            fielddisabled: {
                generatedatefromdisabled: false,
                generatedatetodisabled: true
            },
            listDownload: []
        }
        this.componentTable = [];

        this.handleGenerateDateFrom = this.handleGenerateDateFrom.bind(this);
    }

    componentDidMount() {
        document.title = "Download Data Report | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            let generatedatefrom = this.props.form.getFieldValue('generatedatefrom');
            let activitydatefrom = this.props.form.getFieldValue('activitydatefrom');
            let dateValidation = '';
            let idreport = (criteria.idreport === null) ? null : criteria.idreport.split('%')[1];

            if (!err && (generatedatefrom || activitydatefrom || idreport)) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            } else {
                if (!err || !idreport) {
                    dateValidation = "Insert Generate Date is required";
                }
            }
            this.setState({ dateValidation, idreport });
        })
    }

    handleGenerateDateFrom = (generatedatefrom) => {
        let generatedatetodisabled = (generatedatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, generatedatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ generatedateto: undefined });

        let activitydatefrom = this.props.form.getFieldValue('activitydatefrom');
        if (!generatedatefrom && !activitydatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                transactiontype: undefined, memberstatus: undefined, tier: undefined
            })
        }
    }

    downloadData = (idreport) => {
        const callback = () => {
            let url = api.url.monitoringreport.generate;
            let data = { idreport };
            let message = 'Downloading file...';
            DetailRequest(url, data).then((response) => {
                const { status = {}, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    window.location.href = result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }
        confirm({
            title: 'Are you sure to download this file?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    handleReportTypeChange = (type) => {
        let generatedatefromdisabled = true;
        let generatedatetodisabled = true;
        if (type === 'daily') {
            this.props.form.setFieldsValue({ generatedatefrom: moment(), generatedateto: moment() });
        } else if (type === 'historical') {
            generatedatefromdisabled = false;
            this.props.form.setFieldsValue({ insertdatefrom: undefined, insertdateto: undefined });
        } else {
            this.props.form.setFieldsValue({ insertdatefrom: undefined, insertdateto: undefined });
        }
        let fielddisabled = { ...this.state.fielddisabled, generatedatefromdisabled, generatedatetodisabled };
        this.setState({ type, fielddisabled });
    }

    render() {
        const { searching, fielddisabled, dateValidation } = this.state;
        const { generatedatefromdisabled, generatedatetodisabled } = fielddisabled;
        const reportid = this.props.form.getFieldValue('idreport') !== undefined ? true : false;

        const generatedatefrom = this.props.form.getFieldValue('generatedatefrom');

        const configurationSearchForm = [
            { labeltext: "Report Type", datafield: "reporttype", type: 'select', placeholder: 'Report Type', showDefaultSearch: true, options: optionsReportType, validationrules: !reportid ? ['required'] : [] },
            {
                labeltext: "Type", datafield: "type", type: 'select', placeholder: 'Type', showDefaultSearch: true, options: optionsType, validationrules: !reportid ? [''] : [], onChange: (e) => this.handleReportTypeChange(e)
            },
            {
                labeltext: "Insert Date From", datafield: "generatedatefrom", type: 'datepicker', placeholder: 'Insert Date From', showDefaultSearch: true,
                onChange: (e) => this.handleGenerateDateFrom(e), maxDate: moment().subtract(0, 'days'), disabled: generatedatefromdisabled
            },
            {
                labeltext: "Insert Date To", datafield: "generatedateto", type: 'datepicker', placeholder: 'Insert Date To', showDefaultSearch: true,
                defaultPickerValue: generatedatefrom, disabled: !generatedatefrom ? true : generatedatetodisabled, validationrules: generatedatefrom ? ['required'] : [],
                minDate: moment(generatedatefrom), maxDate: (moment(generatedatefrom).add(3, 'M').subtract(0, 'days') > moment().subtract(0, 'days')) ? moment().subtract(0, 'days') : moment(generatedatefrom).add(3, 'M').subtract(0, 'days')
            },
            { labeltext: "Report ID", datafield: "idreport", type: 'text', placeholder: 'Report ID', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.monitoringreport.list,
            sort: { generatedate: 'desc' },
            columns: [
                { type: 'field', title: 'Report ID', dataIndex: 'idreport', sorter: true },
                {
                    type: 'field', title: 'Type', dataIndex: 'type', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'html', title: 'Generate Date', dataIndex: 'generatedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY HH:mm') : '-' }
                },
                {
                    type: 'field', title: 'Report Type', dataIndex: 'reporttype', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return ((value) ? 'DONE' : 'IN PROGRESS') }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Download" type="success" onClick={() => this.downloadData(row.idreport)} disabled={row.status === 0 ? true : false} />
                            </span>
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
                            <Title level={3}>Download Data Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Text form={this.props.form} type="danger">{dateValidation}</Text>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find the Data Report</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);
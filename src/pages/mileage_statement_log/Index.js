
import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, TierSelect, MembershipSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';
import { formatNumber, getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';

const { Title, Text } = Typography;
const { confirm } = Modal;

const optionsStatus = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVEEMAIL', label: 'INACTIVE EMAIL' },
    { value: 'SUSPECTDUPLICATE', label: 'SUSPECT DUPLICATE' },
    { value: 'TEST', label: 'TEST' },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            visible: false,
            monthList: [],
            yearList: []
        }
        this.componentTable = [];
    }


    componentDidMount() {
        document.title = "Mileage Statement Log | Loyalty Management System";
        const callbackGeneralConfig = (rolecode) => {
            let fieldValue = { ...this.state.fieldValue, rolecode }
            this.setState({ fieldValue });
        }
        /* get general configuration reporting all branch */
        getGeneralConfig(general_config.reporting_allaccess, callbackGeneralConfig);

        this.fareMon();
        this.fareYear();
    }

    handleSearchForm = (criteria) => {
        const { form } = this.props;
        form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            }

        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.mileagestatementlog.download;
            let criteria = this.state.criteria;
            let message = 'Downloading log file...';
            RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode && responsecode.substring(0, 1) === '0') {
                    // window.location.href = response.result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }

        confirm({
            title: 'Are you sure to download this report file?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    fareMon = () => {
        const month = moment.months();
        const monthList = month.map((val, i) => ({ 'label': val, 'value': i }));
        this.setState({ monthList });
    };

    fareYear = () => {
        const years = []
        const dateStart = moment()
        const dateEnd = moment().add(3, 'y')
        while (dateEnd.diff(dateStart, 'years') >= 0) {
            years.push(dateStart.format('YYYY'))
            dateStart.add(1, 'year')
        }
        const yearList = years.map((val, i) => ({ 'label': val, 'value': val }));
        this.setState({ yearList });
    };

    render() {
        const { form } = this.props;
        const { searching, dateValidation, monthList, yearList } = this.state;
        const configurationSearchForm = [
            { labeltext: "Month", datafield: "periodemonth", type: 'select', placeholder: 'Month', showDefaultSearch: true, options: monthList },
            { labeltext: "Year", datafield: "periodeyear", type: 'select', placeholder: 'Year', showDefaultSearch: true, options: yearList },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: optionsStatus },
            { labeltext: "Tier", datafield: "tier", type: 'component', placeholder: 'Tier', showDefaultSearch: false, component: TierSelect },
            { labeltext: "Membership ID", datafield: "membershipid", type: 'component', placeholder: 'Membership ID', showDefaultSearch: true, component: MembershipSelect },
        ];
        const configurationTable = {
            url: api.url.mileagestatementlog.list,
            columnClassName: "nowrap",
            columns: [
                {
                    type: 'field', title: 'Periode', dataIndex: 'periodeyear', sorter: true,
                    render: (value, row) => { return row.periodemonth ? moment(row.periodemonth, 'MM').format('MMMM') + " " + value : value }
                },
                {
                    type: 'field', title: 'Member ID', dataIndex: 'memberid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Salutation', dataIndex: 'salutation', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Membership ID', dataIndex: 'membershipid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tier', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Opening Balance', dataIndex: 'openingbalance', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Miles Earned', dataIndex: 'milesearned', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Miles Redeemed', dataIndex: 'milesredeemed', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Expiry Miles', dataIndex: 'expirymiles', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Current Miles Balance', dataIndex: 'currentmilesbalance', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Eligible Miles', dataIndex: 'eligiblemiles', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Miles to Expiry 1', dataIndex: 'milestoexpiry1', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Miles to Expiry 2', dataIndex: 'milestoexpiry2', sorter: true,
                    render: (value) => { return (value) ? formatNumber(value) : '0' }
                },
                {
                    type: 'field', title: 'Validity Card', dataIndex: 'validitycard', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Email Member', dataIndex: 'emailmember', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Mileage Statement Log</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Text form={form} type="danger">{dateValidation}</Text>
                    <Row type="flex" justify="end" style={{ marginBottom: 10 }} className={(searching) ? '' : 'hidden'}>
                        <Button htmlType="button" type="primary" size="small" icon="download" label="Download Report" onClick={() => this.handleDownloadModal()} />
                    </Row>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find the Log</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);
import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest, RequestWithoutAuth } from '../../utilities/RequestService';
import { Button, SearchForm, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Card Number", datafield: "cardnumber", type: 'exact', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['min.9', 'pattern.numeric'] },
    { labeltext: "Corporate Code", datafield: "corporatecode", type: 'text', placeholder: 'Corporate Code', showDefaultSearch: true, validationrules: ['min.3','pattern.alphanumeric'] },
    { labeltext: "Corporate Name", datafield: "corporatename", type: 'text', placeholder: 'Corporate Name', showDefaultSearch: true, validationrules: ['min.3'] },
    { labeltext: "Corporate Email", datafield: "corporateemail", type: 'exact', placeholder: 'Corporate Email', showDefaultSearch: true, validationrules: ['pattern.email'] },
    { labeltext: "Contact Name", datafield: "contactname", type: 'text', placeholder: 'Contact Name', showDefaultSearch: false, validationrules: ['min.3'] },
    { labeltext: "Contact Email", datafield: "contactemail", type: 'exact', placeholder: 'Contact Email', showDefaultSearch: false, validationrules: ['pattern.email'] },
    { labeltext: "Enrollment Date", datafield: "enrollmentdate", type: 'datepicker', placeholder: 'Enrollment Date', showDefaultSearch: false }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false
        }

        this.componentTable = [];
    }
    componentDidMount() {
        document.title = "Manage Member Corporate | Loyalty Management System";
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
        });
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
        const { menucode, prefixmenuname } = this.props;
        const { searching } = this.state;
        const configurationTable = {
            url: api.url.membercorporate.list,
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: false },
                { type: 'field', title: 'Corporate Code', dataIndex: 'corporatecode', sorter: true },
                { type: 'field', title: 'Corporate Name', dataIndex: 'corporatename', sorter: true },
                { type: 'field', title: 'Corporate Email', dataIndex: 'corporateemail', sorter: true },
                { type: 'field', title: 'Contact Name', dataIndex: 'contactname', sorter: true },
                { type: 'field', title: 'Contact Email', dataIndex: 'contactemail', sorter: true },
                {
                    type: 'html', title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {/* <Button url={'/member-corporate/form/' + row.memberid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> */}
                                <Button url={'/member-corporate/form/' + row.memberid} size="small" title="View" icon="eye" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" />
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
                            <Title level={3}>Manage Member Corporate</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false}/>
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find a Member</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);
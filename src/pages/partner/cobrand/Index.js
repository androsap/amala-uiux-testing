import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase, SearchForm, ErrorGeneral } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const prefixmenuname = 'PARTCOBR';
const menucode = 'PARTCOBR';
const optionsStatus = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
]
const configurationSearchForm = [
    { labeltext: "Cobrand Code", datafield: "cobrandcode", type: 'text', placeholder: 'Cobrand Code', showDefaultSearch: true },
    { labeltext: "Cobrand Name", datafield: "cobrandname", type: 'text', placeholder: 'Cobrand Name', showDefaultSearch: true },
    { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partnercode: this.props.location.state ? this.props.location.state.partnercode : null,
            partnername: this.props.location.state ? this.props.location.state.partnername : null,
            activepartner: this.props.location.state ? this.props.location.state.activepartner : null
        }
    }
    componentDidMount() {
        document.title = "Manage Partner Cobrand | Loyalty Management System";
    }

    deleteData(cobrandcode) {
        let url = api.url.partnercobrand.delete;
        let data = { cobrandcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    render() {
        if (this.props.location.state && this.props.location.state.partnercode) {
            const configurationTable = {
                url: api.url.partnercobrand.list,
                criteria: { partnercode: this.state.partnercode },
                columns: [
                    { type: 'field', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true },
                    { type: 'field', title: 'Cobrand Name', dataIndex: 'cobrandname', sorter: true },
                    {
                        type: 'html', title: 'Start Tier', dataIndex: 'tiername', sorter: false,
                        render: (value, row) => { return (value) ? (row.tiername + ' ' + row.membershipname) : '-' }
                    },
                    {
                        type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                        render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                    },
                    {
                        type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                        render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                    },
                    {
                        type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                        render: (value) => { return (value) ? 'Active' : 'Inactive' }
                    },
                    {
                        type: 'html', title: 'Action', dataIndex: 'action',
                        render: (_value, row) => {
                            return (
                                <span>
                                    <Button url={{ pathname: '/partner/cobrand/form/' + row.cobrandcode, state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: this.state.activepartner } }} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                    {
                                        (this.state.activepartner) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.cobrandcode)} /> : ''
                                    }
                                </span>
                            )
                        }
                    },
                ]
            };

            return (
                <React.Fragment>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}><Button url={'/partner'} shape="circle" icon="left" /> Manage Partner Cobrand for {this.state.partnername} [{this.state.partnercode}]</Title>
                        </Col>
                        <Col xs={24} xl={2}>
                            {
                                (this.state.activepartner) ? <Button type="primary" url={{ pathname: '/partner/cobrand/form', state: { partnercode: this.state.partnercode, partnername: this.state.partnername, activepartner: this.state.activepartner } }} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                            }
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </React.Fragment>
            );
        } else {
            return (<ErrorGeneral {...this.props} message="Partner Code not detected, please do not use tab" />);
        }
    }
}

export default Form.create()(App);
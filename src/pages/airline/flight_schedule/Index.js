import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase, SearchForm, ErrorGeneral } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Icon } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Flight Number", datafield: "flightnumber", type: 'text', placeholder: 'Flight Number', showDefaultSearch: true },
    { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
    { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: true },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true }
];

const prefixmenuname = 'FLIGSCHE';
const menucode = 'FLIGSCHE';

class App extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.location.state && this.props.location.state.airlinecode) {
            this.state = {
                airlinecode: this.props.location.state.airlinecode,
                airlinename: this.props.location.state.airlinename,
                active: this.props.location.state.active,
            }
        }
    }
    componentDidMount() {
        document.title = "Manage Flight Schedule | Loyalty Management System";
    }

    deleteData(flightscheduleid) {
        let url = api.url.flightschedule.delete;
        let data = { flightscheduleid };
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
        if (this.props.location.state && this.props.location.state.airlinecode) {
            const configurationTable = {
                url: api.url.flightschedule.list,
                criteria: { airlinecode: this.state.airlinecode },
                columns: [
                    { type: 'field', title: 'Airline Code', dataIndex: 'airlinecode', sorter: true },
                    { type: 'field', title: 'Flight Number', dataIndex: 'flightnumber', sorter: true },
                    { type: 'field', title: 'Origin', dataIndex: 'origin', sorter: true },
                    { type: 'field', title: 'Destination', dataIndex: 'destination', sorter: true },
                    {
                        type: 'group', title: 'Day', childcolumns: [
                            {
                                type: 'html', title: 'M', dataIndex: 'monday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            },
                            {
                                type: 'html', title: 'T', dataIndex: 'tuesday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            },
                            {
                                type: 'html', title: 'W', dataIndex: 'wednesday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            },
                            {
                                type: 'html', title: 'T', dataIndex: 'thursday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            },
                            {
                                type: 'html', title: 'F', dataIndex: 'friday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            },
                            {
                                type: 'html', title: 'S', dataIndex: 'saturday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            },
                            {
                                type: 'html', title: 'S', dataIndex: 'sunday',
                                render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                            }
                        ]
                    },
                    {
                        type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                        render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                    },
                    {
                        type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                        render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                    },
                    {
                        type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                        render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                    },
                    {
                        type: 'html', title: 'Action', dataIndex: 'action',
                        render: (value, row, index) => {
                            return (
                                <span>
                                    <Button url={{ pathname: '/airline/schedule/form/' + row.flightscheduleid, state: { airlinecode: row.airlinecode, airlinename: row.airlinename, active: this.state.active } }} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                    {
                                        (this.state.active) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.flightscheduleid)} /> : ''
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
                            <Title level={3}><Button url={'/airline'} shape="circle" icon="left" /> Manage Flight Schedule for {this.state.airlinename} [{this.state.airlinecode}]</Title>
                        </Col>
                        <Col xs={24} xl={2}>
                            {
                                (this.state.active) ? <Button type="primary" url={{ pathname: '/airline/schedule/form', state: { airlinecode: this.state.airlinecode, airlinename: this.state.airlinename, active: this.state.active } }} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                            }
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </React.Fragment>
            );
        } else {
            return (<ErrorGeneral {...this.props} message="Airline Code not detected, please do not use tab" />);
        }
    }
}

export default Form.create()(App);
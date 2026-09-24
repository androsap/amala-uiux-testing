import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Rule Name", datafield: "bcrulename", type: 'text', placeholder: 'Rule Name', showDefaultSearch: true },
    { labeltext: "Membership", datafield: "membershipname", type: 'text', placeholder: 'Membership Name', showDefaultSearch: true },
    { labeltext: "Airline Name", datafield: "airlinename", type: 'text', placeholder: 'Airline Name', showDefaultSearch: true },
    { labeltext: "Subclass", datafield: "subclasscode", type: 'text', placeholder: 'Subclass', showDefaultSearch: true },
    { labeltext: "Route Type", datafield: "routetype", type: 'text', placeholder: 'Route Type', showDefaultSearch: true }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Accrual Booking Class | Loyalty Management System";
    }

    deleteData(bcruleheaderid) {
        let url = api.url.accrualrulebc.deleteheader;
        let data = { bcruleheaderid };
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
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.accrualrulebc.list,
            columns: [
                { type: 'field', title: 'Rule Name', dataIndex: 'bcrulename', sorter: true },
                { type: 'field', title: 'Membership Name', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Airline Name', dataIndex: 'airlinename', sorter: true },
                { type: 'field', title: 'Subclass', dataIndex: 'subclasscode', sorter: true },
                { type: 'field', title: 'Route Type', dataIndex: 'routetype', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/accrual-rule-bc/form/' + row.bcruleheaderid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.bcruleheaderid)} />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Accrual Booking Class</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/accrual-rule-bc/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
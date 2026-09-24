import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
    { labeltext: "Airline Code", datafield: "airlinecode", type: 'text', placeholder: 'Airline Code', showDefaultSearch: true },
    { labeltext: "Airline Name", datafield: "airlinename", type: 'text', placeholder: 'Airline Name', showDefaultSearch: true }
];
class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Airline | Loyalty Management System";
    }

    deleteData(airlinecode) {
        let url = api.url.airline.delete;
        let data = { airlinecode };
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
        const { menucode, prefixmenuname } = this.props;

        const configurationTable = {
            url: api.url.airline.list,
            columns: [
                { type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true },
                { type: 'field', title: 'Airline Code', dataIndex: 'airlinecode', sorter: true },
                { type: 'field', title: 'Airline Name', dataIndex: 'airlinename', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '25%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={{ pathname: '/airline/schedule', state: { airlinecode: row.airlinecode, airlinename: row.airlinename, active: row.active } }} size="small" className="btn-custom-dark-blue" label="Flight Schedule" menucode="FLIGSCHE" prefixmenuname="FLIGSCHE" actioncode="ACCESS" />
                                <Button url={'/airline/form/' + row.airlinecode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.airlinecode)} />
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
                        <Title level={3}>Manage Airline</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/airline/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);